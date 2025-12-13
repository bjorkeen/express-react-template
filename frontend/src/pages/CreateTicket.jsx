import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../services/ticketService';

export default function CreateTicket() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serialNumber: '',
    model: '',
    purchaseDate: '',
    type: 'Smartphone', // Default για το dropdown
    category: '',
    description: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTicket(formData);
      navigate('/dashboard'); // Μετά την επιτυχία, πήγαινε στη λίστα
    } catch (err) {
      setError(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Request</h2>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Details Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Serial Number</label>
            <input
              name="serialNumber"
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Model</label>
            <input
              name="model"
              type="text"
              required
              placeholder="e.g. iPhone 14"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
            <input
              name="purchaseDate"
              type="date"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500 mt-1">Used for warranty validation</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Device Type</label>
            <select
              name="type"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              onChange={handleChange}
              value={formData.type}
            >
              <option value="Smartphone">Smartphone</option>
              <option value="Laptop">Laptop</option>
              <option value="TV">TV</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Issue Details Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Problem Category</label>
          <input
            name="category"
            type="text"
            required
            placeholder="e.g. Screen Damage"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            rows="3"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
            onChange={handleChange}
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}