import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemService, swapService, userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader, Heart, MessageCircle, AlertTriangle, Check, X } from 'lucide-react';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [swapType, setSwapType] = useState('swap');
  const [message, setMessage] = useState('');
  const [swapRequestSent, setSwapRequestSent] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await itemService.getItem(id);
        setItem(response.data.data);
        
        // If user is logged in, fetch their items for swap
        if (user) {
          const userItemsResponse = await userService.getUserItems();
          // Filter out items that are not available or approved
          const availableItems = userItemsResponse.data.data.filter(
            item => item.isAvailable && item.isApproved
          );
          setUserItems(availableItems);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load item');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, user]);

  const handleSwapRequest = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      
      const swapData = {
        item: id,
        type: swapType,
        message
      };

      if (swapType === 'swap' && selectedItem) {
        swapData.offeredItem = selectedItem;
      }

      await swapService.createSwapRequest(swapData);
      setSwapRequestSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send swap request');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size={40} className="animate-spin text-[#8f00ff]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertTriangle size={60} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Item</h2>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => navigate('/items')} 
          className="mt-6 bg-[#8f00ff] text-white px-4 py-2 rounded hover:bg-[#6f00c4]"
        >
          Back to Items
        </button>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertTriangle size={60} className="text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Item Not Found</h2>
        <p className="text-gray-600">The item you're looking for may have been removed or doesn't exist.</p>
        <button 
          onClick={() => navigate('/items')} 
          className="mt-6 bg-[#8f00ff] text-white px-4 py-2 rounded hover:bg-[#6f00c4]"
        >
          Browse Items
        </button>
      </div>
    );
  }

  // Check if the current user is the uploader
  const isUploader = user && item.uploader._id === user.id;

  return (
    <div className="container mx-auto px-4 py-8">
      {swapRequestSent ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
          <div className="flex items-center">
            <Check size={24} className="mr-2" />
            <span className="block sm:inline">Swap request sent successfully!</span>
          </div>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="mt-4 bg-[#8f00ff] text-white px-4 py-2 rounded hover:bg-[#6f00c4]"
          >
            View My Requests
          </button>
        </div>
      ) : null}
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image gallery */}
        <div className="md:w-1/2">
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
            {item.images && item.images.length > 0 ? (
              <img 
                src={item.images[activeImage].startsWith('http') ? item.images[activeImage] : `http://localhost:5001${item.images[activeImage]}`} 
                alt={item.title} 
                className="w-full h-[500px] object-cover"
              />
            ) : (
              <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>
          
          {/* Thumbnail gallery */}
          {item.images && item.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {item.images.map((image, index) => (
                <div 
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`cursor-pointer border-2 rounded ${activeImage === index ? 'border-[#8f00ff]' : 'border-transparent'}`}
                >
                  <img 
                    src={image.startsWith('http') ? image : `http://localhost:5001${image}`} 
                    alt={`${item.title} thumbnail ${index + 1}`} 
                    className="w-20 h-20 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Item details */}
        <div className="md:w-1/2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <span className="bg-[#8f00ff] text-white px-2 py-1 rounded text-sm">{item.category}</span>
                <span className="bg-gray-200 px-2 py-1 rounded text-sm">{item.type}</span>
                <span className="bg-gray-200 px-2 py-1 rounded text-sm">{item.size}</span>
              </div>
            </div>
            <div className="bg-[#8f00ff] text-white px-3 py-1 rounded-full">
              {item.pointValue} points
            </div>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h2 className="font-semibold mb-2">Condition</h2>
            <p className="text-gray-700">{item.condition}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{item.description}</p>
          </div>
          
          {item.tags && item.tags.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-200 px-2 py-1 rounded text-sm">{tag}</span>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Uploaded by</h2>
            <p className="text-gray-700">{item.uploader.name}</p>
          </div>
          
          {!isUploader && item.isAvailable && (
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <h2 className="font-semibold mb-4">Request this item</h2>
              
              {!user ? (
                <div className="text-center">
                  <p className="mb-4">You need to be logged in to request this item.</p>
                  <button 
                    onClick={() => navigate('/login')} 
                    className="bg-[#8f00ff] text-white px-4 py-2 rounded hover:bg-[#6f00c4]"
                  >
                    Login to Continue
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSwapRequest}>
                  <div className="mb-4">
                    <label className="block mb-2">Swap Type</label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="swapType" 
                          value="swap" 
                          checked={swapType === 'swap'} 
                          onChange={() => setSwapType('swap')}
                          className="mr-2"
                        />
                        Direct Swap
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="swapType" 
                          value="points" 
                          checked={swapType === 'points'} 
                          onChange={() => setSwapType('points')}
                          className="mr-2"
                        />
                        Use Points ({item.pointValue} points)
                      </label>
                    </div>
                  </div>
                  
                  {swapType === 'swap' && (
                    <div className="mb-4">
                      <label className="block mb-2">Select an item to offer</label>
                      {userItems.length > 0 ? (
                        <select 
                          value={selectedItem} 
                          onChange={(e) => setSelectedItem(e.target.value)}
                          className="w-full p-2 border rounded"
                          required={swapType === 'swap'}
                        >
                          <option value="">Select an item</option>
                          {userItems.map(item => (
                            <option key={item._id} value={item._id}>{item.title}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-yellow-600">
                          You don't have any available items to swap. 
                          <button 
                            type="button"
                            onClick={() => navigate('/add-item')} 
                            className="ml-2 text-[#8f00ff] underline"
                          >
                            Add an item
                          </button>
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label className="block mb-2">Message (optional)</label>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-2 border rounded"
                      rows="3"
                      placeholder="Add a message to the item owner"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full bg-[#8f00ff] text-white px-4 py-2 rounded hover:bg-[#6f00c4] disabled:bg-gray-400"
                    disabled={loading || (swapType === 'swap' && !selectedItem)}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <Loader size={20} className="animate-spin mr-2" /> Processing...
                      </span>
                    ) : (
                      `Request ${swapType === 'swap' ? 'Swap' : 'with Points'}`
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
          
          {!item.isAvailable && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Not Available:</strong>
              <span className="block sm:inline"> This item is currently not available for swap.</span>
            </div>
          )}
          
          {isUploader && (
            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => navigate(`/edit-item/${item._id}`)} 
                className="flex-1 bg-[#8f00ff] text-white px-4 py-2 rounded hover:bg-[#6f00c4]"
              >
                Edit Item
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this item?')) {
                    itemService.deleteItem(item._id)
                      .then(() => navigate('/dashboard'))
                      .catch(err => setError(err.response?.data?.error || 'Failed to delete item'));
                  }
                }} 
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete Item
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail; 