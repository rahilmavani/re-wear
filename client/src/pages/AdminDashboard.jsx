import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader, Users, Package, BarChart2, Check, X, Eye, Trash, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    // Redirect if not admin
    if (user && !isAdmin()) {
      navigate('/dashboard');
      return;
    }

    fetchDashboardData();
  }, [user, isAdmin, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard stats
      const statsResponse = await adminService.getDashboardStats();
      setStats(statsResponse.data.data);

      // Fetch users
      const usersResponse = await adminService.getAllUsers();
      setUsers(usersResponse.data.data);

      // Fetch pending items
      const pendingItemsResponse = await adminService.getPendingItems();
      setPendingItems(pendingItemsResponse.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveItem = async (itemId) => {
    try {
      setActionLoading(true);
      await adminService.approveRejectItem(itemId, { isApproved: true });
      
      // Refresh pending items
      const pendingItemsResponse = await adminService.getPendingItems();
      setPendingItems(pendingItemsResponse.data.data);
      
      // Refresh stats
      const statsResponse = await adminService.getDashboardStats();
      setStats(statsResponse.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve item');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectItem = async (itemId) => {
    try {
      setActionLoading(true);
      await adminService.approveRejectItem(itemId, { isApproved: false });
      
      // Refresh pending items
      const pendingItemsResponse = await adminService.getPendingItems();
      setPendingItems(pendingItemsResponse.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject item');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      setActionLoading(true);
      await adminService.deleteUser(userId);
      
      // Refresh users
      const usersResponse = await adminService.getAllUsers();
      setUsers(usersResponse.data.data);
      
      // Refresh stats
      const statsResponse = await adminService.getDashboardStats();
      setStats(statsResponse.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    } finally {
      setActionLoading(false);
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
        <h2 className="text-2xl font-bold mb-2">Error Loading Admin Dashboard</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={fetchDashboardData} 
          className="bg-[#8f00ff] text-white px-4 py-2 rounded hover:bg-[#6f00c4]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Admin Tabs */}
      <div className="border-b mb-6">
        <nav className="flex flex-wrap -mb-px">
          <button
            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-[#8f00ff] text-[#8f00ff]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="flex items-center">
              <BarChart2 size={18} className="mr-2" />
              Dashboard
            </div>
          </button>
          <button
            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-[#8f00ff] text-[#8f00ff]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('users')}
          >
            <div className="flex items-center">
              <Users size={18} className="mr-2" />
              Users ({stats?.users || 0})
            </div>
          </button>
          <button
            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-[#8f00ff] text-[#8f00ff]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            <div className="flex items-center">
              <Package size={18} className="mr-2" />
              Pending Items ({stats?.items?.pending || 0})
            </div>
          </button>
        </nav>
      </div>

      {/* Dashboard Stats */}
      {activeTab === 'dashboard' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Users</h3>
            <p className="text-3xl font-bold">{stats.users}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Items</h3>
            <p className="text-3xl font-bold">{stats.items.total}</p>
            <div className="mt-2 text-sm">
              <span className="text-green-600">{stats.items.approved} approved</span> • 
              <span className="text-yellow-600 ml-1">{stats.items.pending} pending</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Available Items</h3>
            <p className="text-3xl font-bold">{stats.items.available}</p>
            <p className="mt-2 text-sm text-gray-500">Ready for swapping</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Completed Swaps</h3>
            <p className="text-3xl font-bold">{stats.swaps.completed}</p>
            <p className="mt-2 text-sm text-gray-500">
              {stats.swaps.pending} pending requests
            </p>
          </div>
        </div>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.points}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => navigate(`/admin/users/${user._id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </button>
                      {!user.isAdmin && (
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={actionLoading}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {users.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found.</p>
            </div>
          )}
        </div>
      )}

      {/* Pending Items */}
      {activeTab === 'pending' && (
        <div>
          {pendingItems.length === 0 ? (
            <div className="text-center py-8">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">No pending items</h3>
              <p className="text-gray-500">All items have been reviewed!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingItems.map(item => (
                <div key={item._id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 mb-4 md:mb-0">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={item.images[0].startsWith('http') ? item.images[0] : `http://localhost:5001${item.images[0]}`}
                            alt={item.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package size={40} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="md:w-3/4 md:pl-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-500 mb-1">
                              Uploaded by {item.uploader.name} ({item.uploader.email})
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                {item.category}
                              </span>
                              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                {item.type}
                              </span>
                              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                {item.size}
                              </span>
                              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                {item.condition}
                              </span>
                            </div>
                          </div>
                          
                          <div className="bg-[#8f00ff] text-white px-3 py-1 rounded-full">
                            {item.pointValue} points
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{item.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {item.tags && item.tags.map((tag, index) => (
                            <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex justify-end mt-4 space-x-3">
                          <button
                            onClick={() => navigate(`/item/${item._id}`)}
                            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            <Eye size={16} className="mr-2" /> View Details
                          </button>
                          <button
                            onClick={() => handleRejectItem(item._id)}
                            disabled={actionLoading}
                            className="flex items-center px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
                          >
                            <X size={16} className="mr-2" /> Reject
                          </button>
                          <button
                            onClick={() => handleApproveItem(item._id)}
                            disabled={actionLoading}
                            className="flex items-center px-4 py-2 bg-[#8f00ff] text-white rounded-lg hover:bg-[#6f00c4]"
                          >
                            <Check size={16} className="mr-2" /> Approve
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
