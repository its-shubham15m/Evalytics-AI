import { useState, useEffect } from 'react';
import { useUser } from '../../utils/UserContext';
import api from '../../utils/api';

const Settings = () => {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // This endpoint doesn't exist yet, but we are setting up the form
      // const response = await api.put('/user/profile', formData);
      // setUser(prevUser => ({ ...prevUser, ...response.data.user }));
      setMessage('Profile updated successfully! (API endpoint to be connected)');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile.');
      console.error(error);
    }
  };

  if (!user) return <div>Loading settings...</div>;

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div className="mt-8">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Save Changes
            </button>
          </div>
        </form>
        {message && <p className="mt-4 text-center text-green-400">{message}</p>}
      </div>
    </div>
  );
};

export default Settings;
