import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, X, Plus, Search, ShoppingBag, Tag, Grid, User } from 'lucide-react';
import Navbar from '../components/Navbar';
import SellProductModal from '../components/SellProductModal';

const MarketMingle = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showSellModal, setShowSellModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '' });

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
    fetchUserProducts();
    fetchFavorites();
  }, [activeTab]);

  const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    headers: { 'Content-Type': 'application/json' }
  });

  // API calls
  const fetchProducts = async () => {
    try {
      const response = await API.get('/products');
      setProducts(response.data);
      console.log(response.data); // Debugging line
    } catch (error) {
      console.error('Error fetching products:', error);
      showNotification('Unable to load products. Please try again later.');
    }
  };

  const fetchUserProducts = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await API.get(`/products/seller/${userId}`);
      setUserProducts(response.data);
    } catch (error) {
      console.error('Error fetching user products:', error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await API.get(`/favorites/${userId}`);
      console.log(response.data);
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const fetchProductDetails = async (id) => {
    try {
      const response = await API.get(`/products/${id}`);
      setSelectedProduct(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
      showNotification('Unable to load product details. Please try again later.');
    }
  };

  const toggleFavorite = async (productId) => {
    const userId = localStorage.getItem('userId');
    try {
      await API.post('/favorites', { productId, userId });
      fetchFavorites();
      showNotification('Favorites updated successfully!');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showNotification('Unable to update favorites. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await API.delete(`/products/${productId}`);
      showNotification('Product deleted successfully!');
      fetchUserProducts(); // Refresh the user's product list
    } catch (error) {
      console.error('Error deleting product:', error);
      showNotification('Unable to delete product. Please try again.');
    }
  };

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  const isFavorite = (productId) => {
    return favorites.some(fav => fav.id === productId);
  };

  // Get products to display based on active tab and search query
  const getDisplayProducts = () => {
    let filteredProducts;

    switch (activeTab) {
      case 'favorites':
        filteredProducts = filteredProducts = favorites.map(fav => fav.productId);;
        break;
      case 'myListings':
        filteredProducts = userProducts;
        break;
      default:
        filteredProducts = products;
    }

    if (searchQuery.trim() !== '') {
      return filteredProducts.filter(product =>
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredProducts;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // The filtering is already handled by getDisplayProducts
    // This function is for the form submission
  };

  // Components
  const ProductCard = ({ product, activeTab, onDelete }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden">
      <div className="h-40 bg-gray-200 relative">
        {product.images?.length > 0 ? (
          <img
            src={`${import.meta.env.VITE_API_URL}${product.images[0]}`}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-50">
            <ShoppingBag size={30} className="text-blue-300" />
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product._id);
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition duration-200"
        >
          <Heart
            className={`${favorites.some(fav => fav.productId._id === product._id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            size={18}
          />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">{product.title}</h3>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <p className="text-green-600 font-bold text-lg">₹{product.price}</p>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{product.category}</span>
        </div>
        <button
          onClick={() => fetchProductDetails(product.id)}
          className="mt-3 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center font-medium"
        >
          View Details
        </button>
        {activeTab === 'myListings' && (
          <button
            onClick={() => onDelete(product.id)}
            className="mt-3 w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center justify-center font-medium"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm transition duration-300">
        <div className="bg-white p-6 rounded-xl w-full max-w-md mx-4 relative shadow-xl transform transition-all">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition focus:outline-none">
              <X size={20} />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };
  const ProductDetailsModal = () => (
    <Modal
      isOpen={showDetailsModal}
      onClose={() => setShowDetailsModal(false)}
      title={selectedProduct?.title || 'Product Details'}
    >
      {selectedProduct && (
        <div>
          <div className="h-52 bg-gray-200 mb-4 rounded-lg flex items-center justify-center overflow-hidden">
            {selectedProduct.images?.length > 0 ? (
              <img
                src={`${import.meta.env.VITE_API_URL}${selectedProduct.images[0]}`}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-50">
                <ShoppingBag size={40} className="text-blue-300" />
              </div>
            )}
          </div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-green-600 font-bold text-2xl">₹{selectedProduct.price}</p>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{selectedProduct.category}</span>
          </div>
          <p className="mb-4 text-gray-700">{selectedProduct.description}</p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-medium text-gray-800 mb-2">Seller Information:</p>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-700">
                <User size={16} />
              </div>
              <p>{selectedProduct.sellerId.name || 'Name not available'}</p>
            </div>
            <p className="text-gray-600 ml-11">{selectedProduct.sellerId.phoneNumber || 'Contact information not available'}</p>
          </div>
          <button
            onClick={() => setShowDetailsModal(false)}
            className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
          >
            Close
          </button>
        </div>
      )}
    </Modal>
  );


  const Notification = () => {
    if (!notification.show) return null;

    return (
      <div className="fixed bottom-4 right-4 bg-blue-600 text-white py-2 px-4 rounded-md shadow-lg transition-opacity duration-300">
        {notification.message}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      {/* Hero Section with Enhanced Design */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat opacity-20" style={{ backgroundImage: 'url(/api/placeholder/100/100)' }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Market Mingle</h1>
          <p className="text-xl max-w-2xl mx-auto">Buy & Sell in Your College Community</p>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Find great deals on textbooks, electronics, furniture, and more!</p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for items..."
                  className="w-full pl-10 pr-4 py-3 rounded-l-full sm:rounded-r-none text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="mt-2 sm:mt-0 bg-white text-blue-900 font-medium px-6 py-3 rounded-full sm:rounded-l-none shadow-md hover:bg-gray-100 transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Action Button and Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex space-x-2 mb-4 sm:mb-0 bg-white p-1 rounded-lg shadow-sm">
            <button
              className={`px-4 py-2 rounded-md transition ${activeTab === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('all')}
            >
              <span className="flex items-center">
                <Grid size={16} className="mr-1" />
                All Products
              </span>
            </button>
            <button
              className={`px-4 py-2 rounded-md transition ${activeTab === 'favorites' ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('favorites')}
            >
              <span className="flex items-center">
                <Heart size={16} className="mr-1" />
                My Favorites
              </span>
            </button>
            <button
              className={`px-4 py-2 rounded-md transition ${activeTab === 'myListings' ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('myListings')}
            >
              <span className="flex items-center">
                <Tag size={16} className="mr-1" />
                My Listings
              </span>
            </button>
          </div>
          <button
            onClick={() => setShowSellModal(true)}
            className="flex items-center bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 transition shadow-md"
          >
            <Plus size={18} className="mr-2" />
            Sell Product
          </button>
        </div>

        {searchQuery && (
          <div className="mb-4 text-gray-600">
            Showing results for "{searchQuery}"
          </div>
        )}

        {/* Product Listing with Improved Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {getDisplayProducts().map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              activeTab={activeTab} 
              onDelete={handleDeleteProduct} 
            />
          ))}
        </div>

        {/* No Products Message - Enhanced */}
        {getDisplayProducts().length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <ShoppingBag size={48} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              {activeTab === 'all' && !searchQuery && 'No products found.'}
              {activeTab === 'favorites' && !searchQuery && 'No favorites yet.'}
              {activeTab === 'myListings' && !searchQuery && 'You haven\'t listed any products yet.'}
              {searchQuery && 'No matches found for your search.'}
            </h3>
            <p className="text-gray-500">
              {activeTab === 'all' && !searchQuery && 'Check back later for new listings.'}
              {activeTab === 'favorites' && !searchQuery && 'Find products you love and add them to your favorites.'}
              {activeTab === 'myListings' && !searchQuery && 'Click "Sell Product" to create your first listing.'}
              {searchQuery && 'Try adjusting your search terms or browse all products.'}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProductDetailsModal />
      <SellProductModal
        isOpen={showSellModal}
        onClose={() => setShowSellModal(false)}
        fetchProducts={fetchProducts}
        showNotification={showNotification}
        fetchUserProducts={fetchUserProducts}
      />
      <Notification />
    </div>
  );
};

export default MarketMingle;