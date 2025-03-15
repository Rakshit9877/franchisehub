import React, { useState } from 'react';
import axios from 'axios';

const DailySales = () => {
  const [sales, setSales] = useState('');
  const [customers, setCustomers] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!sales || !customers) {
      setNotification({
        show: true,
        message: 'Please fill in all fields',
        type: 'error'
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:2005/savesales', {
        sales: Number(sales),
        customers: Number(customers)
      });

      if (response.data.status) {
        setNotification({
          show: true,
          message: 'Sales data saved successfully!',
          type: 'success'
        });
        // Reset form
        setSales('');
        setCustomers('');
      }
    } catch (error) {
      setNotification({
        show: true,
        message: error.response?.data?.msg || 'Error saving sales data',
        type: 'error'
      });
    }

    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Daily Sales</h2>
      
      {/* Notification */}
      {notification.show && (
        <div className={`mb-4 p-3 rounded-lg ${
          notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">Total Sales</label>
          <input
            type="number"
            value={sales}
            onChange={(e) => setSales(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter total sales"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Total Customers</label>
          <input
            type="number"
            value={customers}
            onChange={(e) => setCustomers(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter customer count"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Publish
        </button>
      </form>
    </div>
  );
};

export default DailySales;