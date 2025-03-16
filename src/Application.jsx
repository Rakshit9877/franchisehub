import React, { useState } from "react";
import axios from "axios";

const FormRegistration = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    uid: "",
    name: "",
    mob: "",
    addr: "",
    existing: "",
    since: "",
    site_address: "",
    site_city: "",
    site_postal: "",
    site_area: "",
    site_floor: "",
    doa: "",
    owner: ""
  });
  const [file, setFile] = useState(null);
  const [submitStatus, setSubmitStatus] = useState({ message: "", error: false });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Append file if exists
      if (file) {
        formDataToSend.append("ppic", file);
      }

      const response = await axios.post("http://franchisehubserver-production.up.railway.app/saveapplicant", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status) {
        setSubmitStatus({ message: "Registration successful!", error: false });
        // Reset form
        setFormData({
          uid: "",
          name: "",
          mob: "",
          addr: "",
          existing: "",
          since: "",
          site_address: "",
          site_city: "",
          site_postal: "",
          site_area: "",
          site_floor: "",
          doa: "",
          owner: ""
        });
        setFile(null);
      } else {
        setSubmitStatus({ message: response.data.msg || "Registration failed", error: true });
      }
    } catch (error) {
      setSubmitStatus({ 
        message: error.response?.data?.msg || "An error occurred during registration", 
        error: true 
      });
    }
  };

  const inputClassName = `w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-offset-2 transition-all outline-none ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
      : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-600"
  }`;

  const labelClassName = `block text-sm font-medium mb-2 ${
    darkMode ? "text-gray-300" : "text-gray-700"
  }`;

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Dark Mode
          </h3>
          <label className="flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only" checked={darkMode} readOnly />
            <div
              onClick={() => setDarkMode(!darkMode)}
              className={`w-14 h-7 rounded-full relative transition-colors duration-300 ${
                darkMode ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div className={`absolute w-6 h-6 rounded-full top-0.5 left-0.5 bg-white shadow-lg transform transition-transform duration-300 ${
                darkMode ? "translate-x-7" : "translate-x-0"
              }`} />
            </div>
          </label>
        </div>

        <form onSubmit={handleSubmit} className={`max-w-4xl mx-auto rounded-xl shadow-xl transition-colors duration-300 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}>
          <div className="p-8">
            <h1 className={`text-3xl font-bold text-center mb-8 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
              Register for a Free Account
            </h1>

            {submitStatus.message && (
              <div className={`mb-6 p-4 rounded-lg ${submitStatus.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {submitStatus.message}
              </div>
            )}

            <div className="space-y-8">
              {/* Personal Information Section */}
              <section>
                <h2 className={`text-xl font-semibold mb-6 pb-2 border-b ${
                  darkMode ? "text-white border-gray-700" : "text-gray-900 border-gray-200"
                }`}>
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClassName}>User ID</label>
                    <input 
                      type="text" 
                      name="uid" 
                      value={formData.uid}
                      onChange={handleInputChange}
                      className={inputClassName} 
                      placeholder="User ID" 
                      required 
                    />
                  </div>
                  <div>
                    <label className={labelClassName}>Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={inputClassName} 
                      placeholder="Your Name" 
                      required 
                    />
                  </div>
                  <div>
                    <label className={labelClassName}>Mobile Number</label>
                    <input 
                      type="tel" 
                      name="mob"
                      value={formData.mob}
                      onChange={handleInputChange}
                      className={inputClassName} 
                      placeholder="+1 (555) 000-0000" 
                      required 
                    />
                  </div>
                  <div>
                    <label className={labelClassName}>Residential Address</label>
                    <input 
                      type="text" 
                      name="addr"
                      value={formData.addr}
                      onChange={handleInputChange}
                      className={inputClassName} 
                      placeholder="123 Street Name" 
                      required 
                    />
                  </div>
                </div>
              </section>

              {/* Business Information Section */}
              <section>
                <h2 className={`text-xl font-semibold mb-6 pb-2 border-b ${
                  darkMode ? "text-white border-gray-700" : "text-gray-900 border-gray-200"
                }`}>
                  Business Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClassName}>Existing Business</label>
                    <input 
                      type="text" 
                      name="existing"
                      value={formData.existing}
                      onChange={handleInputChange}
                      className={inputClassName} 
                      placeholder="Business Name" 
                    />
                  </div>
                  <div>
                    <label className={labelClassName}>Operating Since</label>
                    <input 
                      type="number" 
                      name="since"
                      value={formData.since}
                      onChange={handleInputChange}
                      className={inputClassName} 
                      placeholder="e.g., 2018" 
                    />
                  </div>
                </div>
              </section>

              {/* Site Information Section */}
              <section>
                <h2 className={`text-xl font-semibold mb-6 pb-2 border-b ${
                  darkMode ? "text-white border-gray-700" : "text-gray-900 border-gray-200"
                }`}>
                  Site Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClassName}>Site Location</label>
                    <input 
                      type="text" 
                      name="site_address"
                      value={formData.site_address}
                      onChange={handleInputChange}
                      className={inputClassName} 
                      placeholder="Location" 
                      required 
                    />
                  </div>
                  <div>
                    <label className={labelClassName}>City</label>
                    <input 
                      type="text" 
                      name="site_city"
                      value={formData.site_city}
                      onChange={handleInputChange}
                      className={inputClassName} 
                      placeholder="City" 
                      required 
                    />
                  </div>
                  <div>
                    <label className={labelClassName}>Postal Code</label>
                    <input 
                      type="text" 
                      name="site_postal"
                      value={formData.site_postal}
                      onChange={handleInputChange}
                      className={inputClassName} 
                      placeholder="Postal Code" 
                      required 
                    />
                  </div>
                  <div>
                    <label className={labelClassName}>Area (sq ft)</label>
                    <input 
                      type="number" 
                      name="site_area"
                      value={formData.site_area}
                      onChange={handleInputChange}
                      className={inputClassName} 
                      placeholder="Area" 
                      required 
                    />
                  </div>
                  <div>
                    <label className={labelClassName}>Floor</label>
                    <input 
                      type="number" 
                      name="site_floor"
                      value={formData.site_floor}
                      onChange={handleInputChange}
                      className={inputClassName} 
                      placeholder="Floor Number" 
                      required 
                    />
                  </div>
                  <div>
                    <label className={labelClassName}>Date of Application</label>
                    <input 
                      type="date" 
                      name="doa"
                      value={formData.doa}
                      onChange={handleInputChange}
                      className={inputClassName} 
                      required 
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className={labelClassName}>Upload Documents</label>
                  <div className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${
                    darkMode ? "border-gray-600" : "border-gray-300"
                  }`}>
                    <div className="space-y-1 text-center">
                      <svg className={`mx-auto h-12 w-12 ${darkMode ? "text-gray-400" : "text-gray-500"}`} stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className={`flex text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload a file</span>
                          <input 
                            type="file" 
                            className="sr-only" 
                            onChange={handleFileChange}
                            accept=".png,.jpg,.pdf"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        PNG, JPG, PDF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className={labelClassName}>Ownership Status</label>
                  <div className="mt-2 space-x-6">
                    <label className={`inline-flex items-center ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <input 
                        type="radio" 
                        name="owner" 
                        value="owned"
                        checked={formData.owner === "owned"}
                        onChange={handleInputChange}
                        className="form-radio text-blue-600" 
                      />
                      <span className="ml-2">Owned</span>
                    </label>
                    <label className={`inline-flex items-center ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <input 
                        type="radio" 
                        name="owner" 
                        value="rented"
                        checked={formData.owner === "rented"}
                        onChange={handleInputChange}
                        className="form-radio text-blue-600" 
                      />
                      <span className="ml-2">Rented</span>
                    </label>
                  </div>
                </div>
              </section>

              <div className="flex flex-col gap-6">
                <button 
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Complete Registration
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormRegistration;
