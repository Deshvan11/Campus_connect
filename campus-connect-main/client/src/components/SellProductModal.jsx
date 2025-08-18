import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from './Modal'; // Assuming you have a reusable Modal component

const SellProductModal = ({ isOpen, onClose, fetchProducts, fetchUserProducts, showNotification }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [images, setImages] = useState([]);

    const handleFileChange = (e) => {
        setImages(Array.from(e.target.files));
    };

    const handleSubmitProduct = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("sellerId", localStorage.getItem("userId"));

            // Append images to FormData
            images.forEach((image) => {
                formData.append("images", image);
            });

            console.log('New Product:', formData); // Debugging line
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to list product');
            }

            // Reset form and close modal
            setTitle('');
            setDescription('');
            setPrice('');
            setCategory('');
            setImages([]);
            onClose();

            // Refresh product lists
            fetchProducts();
            fetchUserProducts();

            // Show success notification
            showNotification('Product listed successfully!');
        } catch (error) {
            console.error('Error adding product:', error);
            showNotification('Unable to list product. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Sell a Product">
            <form onSubmit={handleSubmitProduct}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1 font-medium">Title</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What are you selling?"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1 font-medium">Description</label>
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your item (condition, features, etc.)"
                        required
                        rows="3"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1 font-medium">Price (₹)</label>
                    <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1 font-medium">Category</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select a category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Textbooks">Textbooks</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Home & Garden">Home & Garden</option>
                        <option value="Sports">Sports</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="mb-5">
                    <label className="block text-gray-700 mb-1 font-medium">Images</label>
                    <div className="border border-dashed border-gray-300 rounded-md p-4 text-center bg-gray-50">
                        <input
                            type="file"
                            id="file-upload"
                            onChange={(e) => setImages(Array.from(e.target.files))}
                            multiple
                            accept="image/png, image/jpeg"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="flex flex-col items-center">
                                <Plus size={24} className="text-blue-500 mb-2" />
                                <p className="text-sm text-gray-600">Click to upload images</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {images.length
                                        ? `${images.length} file(s) selected`
                                        : 'PNG, JPG up to 10MB'}
                                </p>
                            </div>
                        </label>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
                    >
                        List Product
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default SellProductModal;