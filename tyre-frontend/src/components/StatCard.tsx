import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, onClick }) => {
    return (
        <button
            onClick={onClick}
            disabled={!onClick}
            className="w-full bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 hover:bg-gray-800/70 transition-all duration-200 ease-in-out border border-gray-700/50 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-400 text-sm">{title}</p>
                    <p className="text-2xl font-semibold text-white mt-2">{value}</p>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg">
                    {icon}
                </div>
            </div>
        </button>
    );
};

export default StatCard;