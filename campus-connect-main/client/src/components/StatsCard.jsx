const StatsCard = ({ icon, title, value, color }) => {
    return (
      <div className={`bg-blue-800 p-6 rounded-lg shadow-lg text-white flex flex-col items-center justify-center`}>
        <div className="mt-2 text-center flex items-center justify-center gap-2">
        {icon}
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
          <p className="text-sm font-medium opacity-90">{title}</p>
      </div>
    );
  };

export default StatsCard;