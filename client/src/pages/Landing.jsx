import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { itemService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader, Package, ArrowRight } from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        setLoading(true);
        // Get latest 6 items
        const response = await itemService.getAllItems({
          limit: 6,
          sort: '-createdAt'
        });
        setFeaturedItems(response.data.data);
      } catch (error) {
        console.error('Failed to fetch featured items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-[#8f00ff] text-white py-16 px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Welcome to ReWear</h1>
        <p className="text-lg sm:text-xl max-w-2xl mx-auto">
          Join our community clothing exchange and give your unused clothes a new life. Reduce textile waste and earn points for every swap.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          {!user ? (
            <>
              <Link
                to="/register"
                className="bg-white text-[#8f00ff] px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
              >
                Join Now
              </Link>
              <Link
                to="/login"
                className="bg-transparent border border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-[#8f00ff] transition"
              >
                Login
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/add-item"
                className="bg-white text-[#8f00ff] px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
              >
                List an Item
              </Link>
              <Link
                to="/dashboard"
                className="bg-transparent border border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-[#8f00ff] transition"
              >
                My Dashboard
              </Link>
            </>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[#8f00ff] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">List Your Items</h3>
              <p className="text-gray-600">Upload photos and details of clothing items you no longer wear.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[#8f00ff] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Method</h3>
              <p className="text-gray-600">Swap directly with other users or use our points-based system.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[#8f00ff] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Get New Clothes</h3>
              <p className="text-gray-600">Refresh your wardrobe while reducing waste and saving money.</p>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link 
              to="/items" 
              className="inline-flex items-center bg-[#8f00ff] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6f00c4] transition"
            >
              Browse Available Items <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Items</h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader size={40} className="animate-spin text-[#8f00ff]" />
            </div>
          ) : featuredItems.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">No items available yet</h3>
              <p className="text-gray-500 mb-4">Be the first to list your items!</p>
              <Link
                to="/add-item"
                className="bg-[#8f00ff] text-white px-4 py-2 rounded-lg hover:bg-[#6f00c4]"
              >
                Add Item
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {featuredItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition duration-300 cursor-pointer"
                    onClick={() => navigate(`/item/${item._id}`)}
                  >
                    <div className="h-48 relative">
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
                        <span className="bg-[#8f00ff] text-white text-xs font-semibold px-2 py-1 rounded-full">
                          {item.pointValue} pts
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 truncate">{item.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{item.category} · {item.size}</span>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{item.condition}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-10">
                <Link 
                  to="/items" 
                  className="inline-flex items-center text-[#8f00ff] font-medium hover:underline"
                >
                  View All Items <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-[#8f00ff] text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Join ReWear?</h2>
          <p className="text-xl mb-8">
            Start swapping clothes today and be part of the sustainable fashion movement.
          </p>
          {!user ? (
            <Link
              to="/register"
              className="bg-white text-[#8f00ff] px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition"
            >
              Sign Up Now
            </Link>
          ) : (
            <Link
              to="/add-item"
              className="bg-white text-[#8f00ff] px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition"
            >
              List Your First Item
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Landing;
