import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { nanoid } from 'nanoid';
import emailjs from '@emailjs/browser';
import { toast, Toaster } from 'react-hot-toast';

// Initialize EmailJS
emailjs.init('0PTJyqq31m5PVkCTN');

const ShowApp = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://localhost:2005/allapplications");
      setApplications(response.data);
      setLoading(false);
      setActiveFilter('all');
    } catch (err) {
      setError('Error fetching data');
      setLoading(false);
      console.error("Error fetching applications:", err);
    }
  };

  const fetchFilteredApplications = async (status) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:2005/showfilter/${status}`);
      setApplications(response.data);
      setLoading(false);
      setActiveFilter(status.toString());
    } catch (err) {
      setError('Error fetching filtered data');
      setLoading(false);
      console.error("Error fetching filtered applications:", err);
    }
  };

  const generateLoginCredentials = (uid) => {
    const randomNumbers = nanoid(6); // Generate 6 random characters
    return {
      username: uid,
      password: `${uid}${randomNumbers}`
    };
  };

  const saveLoginCredentials = async (credentials) => {
    try {
      const response = await axios.post(
        "http://localhost:2005/savelogin",
        credentials
      );
      if (!response.data.status) {
        throw new Error(response.data.msg);
      }
      return true;
    } catch (err) {
      console.error("Error saving login credentials:", err);
      return false;
    }
  };

  const sendEmail = async (uid, templateParams, templateId) => {
    try {
      const response = await emailjs.send(
        'service_w4u6v79',
        templateId,
        {
          to_email: uid,  // Match the template parameter {{to_email}}
          ...templateParams
        }
      );

      if (response.status === 200) {
        toast.success('Email sent successfully!');
        return true;
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error('Failed to send email');
      return false;
    }
  };

  const updateStatus = async (uid, status) => {
    try {
      const response = await axios.post(
        "http://localhost:2005/updatestatus",
        { uid, status }
      );
      
      if (response.data.status) {
        const application = applications.find(app => app.uid === uid);
        
        if (status === 2) { // Franchise approval
          const credentials = generateLoginCredentials(uid);
          const credentialsSaved = await saveLoginCredentials(credentials);
          
          if (credentialsSaved) {
            await sendEmail(
              application.uid,
              {
                to_email: application.uid,  // Match the template parameter {{to_email}}
                name: application.name || 'User',
                username: credentials.username,
                password: credentials.password,
                login_url: 'http://localhost:5173/login',
                support_email: 'support@franchise.com',
                mobile: application.mob || '',
                address: application.addr || '',
                franchise_location: application.site_address || '',
                city: application.site_city || '',
                postal_code: application.site_postal || ''
              },
              'template_ekmko6t'
            );
          } else {
            toast.error('Failed to create login credentials');
          }
        } else if (status === 1) { // Accept for consideration
          await sendEmail(
            application.uid,
            {
              to_email: application.uid,  // Match the template parameter {{to_email}}
              name: application.name || 'User',
              contact_number: '+1-234-567-8900',
              next_steps: 'Our team will contact you within 2 business days.',
              support_email: 'support@franchise.com',
              mobile: application.mob || '',
              address: application.addr || '',
              franchise_location: application.site_address || '',
              city: application.site_city || '',
              postal_code: application.site_postal || ''
            },
            'template_uzevb5b'
          );
        }

        // Refresh the view
        if (activeFilter === 'all') {
          await fetchApplications();
        } else {
          await fetchFilteredApplications(activeFilter);
        }

        toast.success(`Application ${status === 2 ? 'franchised' : 'accepted'} successfully`);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error('Failed to update application status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-2xl font-bold text-center mb-8 text-blue-600">User Applications</h1>
        
        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => fetchApplications()}
            className={`px-4 py-2 rounded-lg transition ${
              activeFilter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => fetchFilteredApplications(-1)}
            className={`px-4 py-2 rounded-lg transition ${
              activeFilter === '-1' 
                ? 'bg-red-600 text-white' 
                : 'bg-white text-red-600 hover:bg-red-50'
            }`}
          >
            Ignored
          </button>
          <button 
            onClick={() => fetchFilteredApplications(1)}
            className={`px-4 py-2 rounded-lg transition ${
              activeFilter === '1' 
                ? 'bg-green-600 text-white' 
                : 'bg-white text-green-600 hover:bg-green-50'
            }`}
          >
            Accepted
          </button>
          <button 
            onClick={() => fetchFilteredApplications(2)}
            className={`px-4 py-2 rounded-lg transition ${
              activeFilter === '2' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            Franchised
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {applications.map((application) => (
            <div key={application._id} className="max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
                <h2 className="text-xl font-semibold">User Profile</h2>
                <p className="text-sm">Current Status: {application.status}</p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-500 text-lg">@</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">UID</p>
                    <p className="font-medium">{application.uid}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-500 text-lg">U</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{application.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-500 text-lg">📱</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mobile</p>
                    <p className="font-medium">{application.mob}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-500 text-lg">📍</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{application.addr}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between mt-4">
                  <button 
                    onClick={() => updateStatus(application.uid, 1)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => updateStatus(application.uid, -1)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Ignore
                  </button>
                  <button 
                    onClick={() => updateStatus(application.uid, 2)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Franchise
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ShowApp;