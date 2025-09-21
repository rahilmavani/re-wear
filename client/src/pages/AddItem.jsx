import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService, uploadService } from '../services/api';
import { Loader, Upload, X, Check, AlertTriangle } from 'lucide-react';

const AddItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Men',
    type: 'Tops',
    size: 'M',
    condition: 'Good',
    tags: '',
    pointValue: 10,
    images: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Category options
  const categories = ['Men', 'Women', 'Kids', 'Unisex', 'Accessories'];
  const types = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear', 'Accessories', 'Other'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size', 'Other'];
  const conditions = ['New with tags', 'Like new', 'Good', 'Fair', 'Poor'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Create preview URLs for the selected images
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...previews]);
    
    // Store the actual files
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    // Remove from preview
    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
    
    // Remove from form data
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // First, upload the images
      const imageUrls = await uploadImages(formData.images);
      
      // Then create the item with the image URLs
      const itemData = {
        ...formData,
        images: imageUrls,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };
      
      delete itemData.images; // Remove the actual file objects
      
      // Create the item
      const response = await itemService.createItem({
        ...itemData,
        images: imageUrls
      });
      
      setSuccess(true);
      
      // Redirect to the item page after a delay
      setTimeout(() => {
        navigate(`/dashboard`);
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create item');
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (images) => {
    if (!images || images.length === 0) return [];
    
    try {
      const formData = new FormData();
      images.forEach(image => {
        formData.append('images', image);
      });
      
      const response = await uploadService.uploadMultipleImages(formData);
      return response.data.data.map(img => img.filePath);
    } catch (err) {
      throw new Error('Failed to upload images');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">List a New Item</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 flex items-start">
          <AlertTriangle className="mr-2 mt-0.5" size={20} />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 flex items-center">
          <Check className="mr-2" size={20} />
          <span>Item created successfully! Redirecting to dashboard...</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required
                  maxLength={100}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  rows="4"
                  required
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/500 characters
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Point Value</label>
                <input
                  type="number"
                  name="pointValue"
                  value={formData.pointValue}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required
                  min="1"
                  max="100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set how many points this item is worth (1-100)
                </p>
              </div>
            </div>
          </div>
          
          {/* Item Details */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Item Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required
                >
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Size</label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required
                >
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                  required
                >
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              placeholder="e.g. summer, casual, blue, cotton"
            />
            <p className="text-xs text-gray-500 mt-1">
              Add tags to help others find your item
            </p>
          </div>
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Upload Images</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                name="images"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <Upload size={40} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 1MB</p>
                </div>
              </label>
            </div>
            
            {/* Image Previews */}
            {previewImages.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Uploaded Images</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || success}
              className={`w-full ${
                loading || success
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#8f00ff] hover:bg-[#6f00c4]'
              } text-white py-3 rounded-lg font-medium flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin mr-2" /> Uploading...
                </>
              ) : success ? (
                <>
                  <Check size={20} className="mr-2" /> Item Created
                </>
              ) : (
                'List Item'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddItem;
