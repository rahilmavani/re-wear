import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService, swapService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader, AlertTriangle, Check, X, Clock, Package, ArrowRight, Plus } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userItems, setUserItems] = useState([]);
  const [swapRequests, setSwapRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('items');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch user's items
        const itemsResponse = await userService.getUserItems();
        setUserItems(itemsResponse.data.data);
        
        // Fetch user's swap requests
        const swapsResponse = await userService.getUserSwaps();
        setSwapRequests(swapsResponse.data.data);
        
        // Fetch received swap requests
        const receivedResponse = await userService.getReceivedRequests();
        setReceivedRequests(receivedResponse.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSwapAction = async (swapId, status) => {
    try {
      await swapService.updateSwapStatus(swapId, { status });
      
      // Refresh all data after action
      const itemsResponse = await userService.getUserItems();
      setUserItems(itemsResponse.data.data);
      
      const swapsResponse = await userService.getUserSwaps();
      setSwapRequests(swapsResponse.data.data);
      
      const receivedResponse = await userService.getReceivedRequests();
      setReceivedRequests(receivedResponse.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update swap request');
    }
  };

  const handleCancelRequest = async (swapId) => {
    try {
      await swapService.cancelSwapRequest(swapId);
      
      // Refresh swap requests after cancellation
      const swapsResponse = await userService.getUserSwaps();
      setSwapRequests(swapsResponse.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel swap request');
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
        <h2 className="text-2xl font-bold mb-2">Error Loading Dashboard</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-[#8f00ff] text-white px-4 py-2 rounded hover:bg-[#6f00c4]"
        >
          Retry
        </button>
      </div>
    );
  }

  // Filter swap requests by status
  const pendingRequests = swapRequests.filter(swap => swap.status === 'pending');
  const approvedRequests = swapRequests.filter(swap => swap.status === 'approved');
  const completedRequests = swapRequests.filter(swap => swap.status === 'completed');
  const rejectedRequests = swapRequests.filter(swap => swap.status === 'rejected');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center">
          <div className="bg-[#8f00ff] text-white px-4 py-2 rounded-full mr-4">
            <span className="font-bold">{user.points}</span> points
          </div>
          <Link 
            to="/add-item" 
            className="bg-[#8f00ff] text-white px-4 py-2 rounded-lg hover:bg-[#6f00c4] flex items-center"
          >
            <Plus size={18} className="mr-1" /> Add Item
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b mb-6">
        <nav className="flex flex-wrap -mb-px">
          <button
            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'items'
                ? 'border-[#8f00ff] text-[#8f00ff]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('items')}
          >
            My Items ({userItems.length})
          </button>
          <button
            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-[#8f00ff] text-[#8f00ff]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('requests')}
          >
            My Requests ({swapRequests.length})
          </button>
          <button
            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'received'
                ? 'border-[#8f00ff] text-[#8f00ff]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('received')}
          >
            Received Requests ({receivedRequests.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {/* My Items Tab */}
        {activeTab === 'items' && (
          <div>
            {userItems.length === 0 ? (
              <div className="text-center py-8">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">No items yet</h3>
                <p className="text-gray-500 mb-4">You haven't uploaded any items yet.</p>
                <Link
                  to="/add-item"
                  className="bg-[#8f00ff] text-white px-4 py-2 rounded hover:bg-[#6f00c4]"
                >
                  Add Your First Item
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {userItems.map(item => (
                  <div key={item._id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="relative h-48">
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={item.images[0].startsWith('http') ? item.images[0] : `http://localhost:5001${item.images[0]}`}
                  alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Package size={40} className="text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.isApproved ? 'Approved' : 'Pending Approval'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 truncate">{item.title}</h3>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">{item.category} · {item.size}</span>
                        <span className="text-sm font-medium text-[#8f00ff]">{item.pointValue} pts</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${item.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                          {item.isAvailable ? 'Available' : 'Not Available'}
                        </span>
                        <button
                          onClick={() => navigate(`/item/${item._id}`)}
                          className="text-[#8f00ff] text-sm hover:underline"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Requests Tab */}
        {activeTab === 'requests' && (
          <div>
            {swapRequests.length === 0 ? (
              <div className="text-center py-8">
                <ArrowRight size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">No swap requests</h3>
                <p className="text-gray-500 mb-4">You haven't made any swap requests yet.</p>
                <Link
                  to="/items"
                  className="bg-[#8f00ff] text-white px-4 py-2 rounded hover:bg-[#6f00c4]"
                >
                  Browse Items
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingRequests.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Pending Requests</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pendingRequests.map(swap => (
                        <div key={swap._id} className="bg-white rounded-lg shadow p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">{swap.item.title}</h4>
                              <p className="text-sm text-gray-500">Requested {new Date(swap.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                              <Clock size={14} className="mr-1" /> Pending
                            </span>
                          </div>
                          <div className="flex items-center mb-3">
                            <p className="text-sm">
                              <span className="font-medium">Type:</span> {swap.type === 'swap' ? 'Direct Swap' : 'Points Redemption'}
                            </p>
                          </div>
                          {swap.type === 'swap' && swap.offeredItem && (
                            <div className="mb-3">
                              <p className="text-sm font-medium mb-1">Offered Item:</p>
                              <div className="flex items-center">
                                {swap.offeredItem.images && swap.offeredItem.images.length > 0 ? (
                                  <img
                                    src={swap.offeredItem.images[0].startsWith('http') ? swap.offeredItem.images[0] : `http://localhost:5001${swap.offeredItem.images[0]}`}
                                    alt={swap.offeredItem.title}
                                    className="w-12 h-12 object-cover rounded mr-2"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center mr-2">
                                    <Package size={20} className="text-gray-400" />
                                  </div>
                                )}
                                <span>{swap.offeredItem.title}</span>
                              </div>
                            </div>
                          )}
                          {swap.type === 'points' && (
                            <p className="text-sm mb-3">
                              <span className="font-medium">Points offered:</span> {swap.pointsOffered}
                            </p>
                          )}
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleCancelRequest(swap._id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Cancel Request
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {approvedRequests.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Approved Requests</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {approvedRequests.map(swap => (
                        <div key={swap._id} className="bg-white rounded-lg shadow p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">{swap.item.title}</h4>
                              <p className="text-sm text-gray-500">Approved</p>
                            </div>
                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                              <Check size={14} className="mr-1" /> Approved
                            </span>
                          </div>
                          <div className="flex items-center mb-3">
                            <p className="text-sm">
                              <span className="font-medium">Type:</span> {swap.type === 'swap' ? 'Direct Swap' : 'Points Redemption'}
                            </p>
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={() => navigate(`/item/${swap.item._id}`)}
                              className="text-[#8f00ff] hover:underline text-sm font-medium"
                            >
                              View Item
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {completedRequests.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Completed Requests</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {completedRequests.map(swap => (
                        <div key={swap._id} className="bg-white rounded-lg shadow p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">{swap.item.title}</h4>
                              <p className="text-sm text-gray-500">Completed on {new Date(swap.completedAt).toLocaleDateString()}</p>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                              Completed
                            </span>
                          </div>
                          <div className="flex items-center">
                            <p className="text-sm">
                              <span className="font-medium">Type:</span> {swap.type === 'swap' ? 'Direct Swap' : 'Points Redemption'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {rejectedRequests.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Rejected Requests</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {rejectedRequests.map(swap => (
                        <div key={swap._id} className="bg-white rounded-lg shadow p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">{swap.item.title}</h4>
                              <p className="text-sm text-gray-500">Rejected</p>
                            </div>
                            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                              <X size={14} className="mr-1" /> Rejected
                            </span>
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={() => navigate(`/item/${swap.item._id}`)}
                              className="text-[#8f00ff] hover:underline text-sm font-medium"
                            >
                              View Item
                            </button>
                          </div>
              </div>
            ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Received Requests Tab */}
        {activeTab === 'received' && (
          <div>
            {receivedRequests.length === 0 ? (
              <div className="text-center py-8">
                <ArrowRight size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">No received requests</h3>
                <p className="text-gray-500">You haven't received any swap requests yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {receivedRequests.map(swap => (
                  <div key={swap._id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{swap.requester.name} wants your item</h3>
                        <p className="text-gray-500">Request received {new Date(swap.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
                          Pending Approval
                        </span>
                      </div>
      </div>

                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                      <div className="md:w-1/2">
                        <h4 className="font-medium mb-2">Your Item</h4>
                        <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                          {swap.item.images && swap.item.images.length > 0 ? (
                            <img
                              src={swap.item.images[0].startsWith('http') ? swap.item.images[0] : `http://localhost:5001${swap.item.images[0]}`}
                              alt={swap.item.title}
                              className="w-16 h-16 object-cover rounded mr-4"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center mr-4">
                              <Package size={24} className="text-gray-400" />
                            </div>
                          )}
                          <div>
                            <h5 className="font-semibold">{swap.item.title}</h5>
                            <p className="text-sm text-gray-500">{swap.item.category} · {swap.item.size}</p>
                          </div>
                        </div>
        </div>

                      <div className="md:w-1/2">
                        <h4 className="font-medium mb-2">
                          {swap.type === 'swap' ? 'Offered Item' : 'Points Offered'}
                        </h4>
                        {swap.type === 'swap' && swap.offeredItem ? (
                          <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                            {swap.offeredItem.images && swap.offeredItem.images.length > 0 ? (
                              <img
                                src={swap.offeredItem.images[0].startsWith('http') ? swap.offeredItem.images[0] : `http://localhost:5001${swap.offeredItem.images[0]}`}
                                alt={swap.offeredItem.title}
                                className="w-16 h-16 object-cover rounded mr-4"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center mr-4">
                                <Package size={24} className="text-gray-400" />
                              </div>
                            )}
                            <div>
                              <h5 className="font-semibold">{swap.offeredItem.title}</h5>
                              <p className="text-sm text-gray-500">{swap.offeredItem.category} · {swap.offeredItem.size}</p>
                              <button 
                                onClick={() => navigate(`/item/${swap.offeredItem._id}`)}
                                className="text-[#8f00ff] text-sm hover:underline mt-1"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center">
                              <span className="text-2xl font-bold text-[#8f00ff] mr-2">{swap.pointsOffered}</span>
                              <span>points</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {swap.message && (
                      <div className="mb-6">
                        <h4 className="font-medium mb-2">Message</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700">{swap.message}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-end gap-4">
                      <button
                        onClick={() => handleSwapAction(swap._id, 'rejected')}
                        className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleSwapAction(swap._id, 'approved')}
                        className="px-4 py-2 bg-[#8f00ff] text-white rounded-lg hover:bg-[#6f00c4]"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
