import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import axios from 'axios';

const SalesHistory = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [totals, setTotals] = useState({ totalSales: 0, totalCustomers: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSalesData = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Fetch sales history
      const [historyResponse, totalsResponse] = await Promise.all([
        axios.get(`http://localhost:2005/saleshistory?from=${startDate}&to=${endDate}`),
        axios.get(`http://localhost:2005/totalsales?from=${startDate}&to=${endDate}`)
      ]);

      if (historyResponse.data.status) {
        setSalesData(historyResponse.data.data);
      }

      if (totalsResponse.data.status) {
        setTotals(totalsResponse.data.data);
      }
    } catch (err) {
      setError('Error fetching sales data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Sales History</h2>
      
      {/* Date Filter Section */}
      <div className="flex items-center space-x-4 max-w-2xl mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          onClick={fetchSalesData}
          disabled={loading}
          className="mt-6 bg-gray-100 p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
        >
          <CalendarDays size={24} />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Totals Display */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Period Totals</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Sales</p>
            <p className="text-xl font-bold">₹{totals.totalSales.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Customers</p>
            <p className="text-xl font-bold">{totals.totalCustomers.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-right">Sales</th>
              <th className="px-4 py-2 text-right">Customers</th>
              <th className="px-4 py-2 text-right">Avg. per Customer</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale) => (
              <tr key={sale._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{formatDate(sale.date)}</td>
                <td className="px-4 py-2 text-right">₹{sale.sales.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">{sale.customers.toLocaleString()}</td>
                <td className="px-4 py-2 text-right">
                  ₹{(sale.sales / sale.customers).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {salesData.length === 0 && !loading && (
          <p className="text-center py-4 text-gray-500">No sales data available for selected period</p>
        )}

        {loading && (
          <p className="text-center py-4 text-gray-500">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default SalesHistory;