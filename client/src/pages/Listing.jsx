import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { itemService } from '../services/api';
import { Loader, Search, Filter, Package, X } from 'lucide-react';

const Listing = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    size: searchParams.get('size') || '',
    condition: searchParams.get('condition') || '',
    sort: searchParams.get('sort') || '-createdAt'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);

  // Category options
  const categories = ['Men', 'Women', 'Kids', 'Unisex', 'Accessories'];
  const types = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear', 'Accessories', 'Other'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size', 'Other'];
  const conditions = ['New with tags', 'Like new', 'Good', 'Fair', 'Poor'];
  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: '-pointValue', label: 'Highest Points' },
    { value: 'pointValue', label: 'Lowest Points' }
  ];

  useEffect(() => {
    fetchItems();
  }, [page, filters]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const queryParams = {
        page,
        limit: 12,
        sort: filters.sort
      };
      
      // Add filters if they exist
      if (filters.search) queryParams.search = filters.search;
      if (filters.category) queryParams.category = filters.category;
      if (filters.type) queryParams.type = filters.type;
      if (filters.size) queryParams.size = filters.size;
      if (filters.condition) queryParams.condition = filters.condition;
      
      // Update URL with current filters
      setSearchParams(queryParams);
      
      const response = await itemService.getAllItems(queryParams);
      setItems(response.data.data);
      
      // Calculate total pages
      if (response.data.pagination) {
        const total = Math.ceil(response.data.count / 12);
        setTotalPages(total || 1);
      }
      
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
    
    // Reset to page 1 when filters change
    if (page !== 1) setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to page 1 when searching
    if (page !== 1) setPage(1);
    fetchItems();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      type: '',
      size: '',
      condition: '',
      sort: '-createdAt'
    });
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Browse Items</h1>
        
        <div className="flex items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center bg-[#8f00ff] text-white px-4 py-2 rounded-lg hover:bg-[#6f00c4] mr-2"
          >
            <Filter size={18} className="mr-1" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2 bg-white"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`mb-6 ${showFilters ? 'block' : 'hidden'}`}>
        <div className="bg-white p-4 rounded-lg shadow">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search items..."
                  className="w-full border rounded-lg px-4 py-2 pl-10"
                />
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              <button
                type="submit"
                className="bg-[#8f00ff] text-white px-4 py-2 rounded-lg hover:bg-[#6f00c4]"
              >
                Search
              </button>
            </div>
          </form>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Size</label>
              <select
                name="size"
                value={filters.size}
                onChange={handleFilterChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">All Sizes</option>
                {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Condition</label>
              <select
                name="condition"
                value={filters.condition}
                onChange={handleFilterChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">All Conditions</option>
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <X size={16} className="mr-1" /> Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(filters.category || filters.type || filters.size || filters.condition || filters.search) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.search && (
            <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
              Search: {filters.search}
              <button
                onClick={() => setFilters({ ...filters, search: '' })}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <X size={14} />
              </button>
            </div>
          )}
          
          {filters.category && (
            <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
              Category: {filters.category}
              <button
                onClick={() => setFilters({ ...filters, category: '' })}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <X size={14} />
              </button>
            </div>
          )}
          
          {filters.type && (
            <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
              Type: {filters.type}
              <button
                onClick={() => setFilters({ ...filters, type: '' })}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <X size={14} />
              </button>
            </div>
          )}
          
          {filters.size && (
            <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
              Size: {filters.size}
              <button
                onClick={() => setFilters({ ...filters, size: '' })}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <X size={14} />
              </button>
            </div>
          )}
          
          {filters.condition && (
            <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
              Condition: {filters.condition}
              <button
                onClick={() => setFilters({ ...filters, condition: '' })}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Items Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader size={40} className="animate-spin text-[#8f00ff]" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchItems}
            className="bg-[#8f00ff] text-white px-4 py-2 rounded-lg hover:bg-[#6f00c4]"
          >
            Try Again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">No items found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria.</p>
          <button
            onClick={clearFilters}
            className="bg-[#8f00ff] text-white px-4 py-2 rounded-lg hover:bg-[#6f00c4]"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition duration-300"
              onClick={() => navigate(`/item/${item._id}`)}
              style={{ cursor: 'pointer' }}
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
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{item.category} · {item.size}</span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{item.condition}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${item.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {item.isAvailable ? 'Available' : 'Not Available'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/item/${item._id}`);
                    }}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg ${
                page === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#8f00ff] text-white hover:bg-[#6f00c4]'
              }`}
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Calculate page numbers to show
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg ${
                      page === pageNum
                        ? 'bg-[#8f00ff] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg ${
                page === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#8f00ff] text-white hover:bg-[#6f00c4]'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Listing;
