import React from 'react';
import { X } from 'lucide-react';

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

export default Modal;