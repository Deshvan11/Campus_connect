import React from 'react';

const TeamMemberCard = ({ name, image }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="h-80 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="font-bold text-lg">{name}</h3>
      </div>
    </div>
  );
};

export default TeamMemberCard;