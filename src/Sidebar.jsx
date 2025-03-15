import React from 'react';
import { CalendarDays, Settings as SettingsIcon, LineChart, DollarSign } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'daily', label: 'Daily Sales', icon: DollarSign },
    { id: 'history', label: 'Sales History', icon: CalendarDays },
    { id: 'charts', label: 'Charts', icon: LineChart },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-8">Dashboard</h2>
      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center p-3 mb-2 rounded-lg ${
                activeTab === item.id ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}
            >
              <Icon className="mr-3" size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;