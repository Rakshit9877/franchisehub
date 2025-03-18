import React, { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('https://franchisehubserver-production.up.railway.app/updatepassword', {
        email: 'abc@gmail.com',
        currentPassword,
        newPassword
      });

      if (response.data.status) {
        toast.success('Password updated successfully', {
          duration: 3000,
          position: 'top-center',
        });
        setCurrentPassword('');
        setNewPassword('');
      } else {
        toast.error(response.data.msg || 'Failed to update password', {
          duration: 3000,
          position: 'top-center',
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || 'An error occurred while updating password', {
        duration: 3000,
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="p-4 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6">Settings</h2>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Update Password</h3>
          
          <form onSubmit={handleUpdatePassword}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter current password"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter new password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Settings;