import React from 'react';

const ModuleCard = ({ 
  title, 
  description, 
  icon: Icon, 
  color,
  onClick 
}) => {
  return (
    <div 
      className="module-card cursor-pointer" 
      onClick={onClick}
    >
      <div className={`w-12 h-12 flex items-center justify-center rounded-full ${color} mb-4`}>
        <Icon size={24} className="text-white" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ModuleCard;