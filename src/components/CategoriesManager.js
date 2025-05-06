import React, { useState, useEffect } from "react";
import api from "../services/api";

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const config = { headers: { "x-auth-token": token } };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/api/categories/${editCategoryId}`, formData, config);
        setMessage("Category updated successfully.");
      } else {
        await api.post("/api/categories", formData, config);
        setMessage("Category created successfully.");
      }
      setFormData({ name: "", description: "" });
      setIsEditing(false);
      setEditCategoryId(null);
      // Optionally show loading for refetching categories
      setLoading(true);
      fetchCategories();
    } catch (error) {
      setMessage(error.response?.data.msg || "Error submitting category");
    }
  };

  const handleEdit = (cat) => {
    setIsEditing(true);
    setEditCategoryId(cat._id);
    setFormData({ name: cat.name, description: cat.description });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/categories/${id}`, config);
      setMessage("Category deleted successfully.");
      // Optionally show loading for refetching categories
      setLoading(true);
      fetchCategories();
    } catch (error) {
      setMessage(error.response?.data.msg || "Error deleting category");
    }
  };

  // Show a loading indicator until categories are fetched
  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='text-xl'>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Categories Manager</h2>
      {message && <div className='mb-4 text-green-600'>{message}</div>}
      <form
        onSubmit={handleFormSubmit}
        className='bg-white p-4 rounded shadow mb-6'
      >
        <h3 className='font-bold mb-2'>
          {isEditing ? "Edit Category" : "Create Category"}
        </h3>
        <div className='mb-4'>
          <label className='block text-gray-700'>Name:</label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleInputChange}
            className='border p-2 rounded w-full'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700'>Description:</label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleInputChange}
            className='border p-2 rounded w-full'
          ></textarea>
        </div>
        <button
          type='submit'
          className='bg-blue-500 text-white py-2 px-4 rounded'
        >
          {isEditing ? "Update Category" : "Create Category"}
        </button>
      </form>
      <div>
        <h3 className='text-lg font-bold mb-2'>Categories List</h3>
        <table className='min-w-full bg-white'>
          <thead>
            <tr>
              <th className='py-2 border'>Name</th>
              <th className='py-2 border'>Description</th>
              <th className='py-2 border'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id}>
                <td className='py-2 border text-center'>{cat.name}</td>
                <td className='py-2 border text-center'>{cat.description}</td>
                <td className='py-2 border text-center'>
                  <button
                    onClick={() => handleEdit(cat)}
                    className='bg-yellow-500 text-white px-2 py-1 rounded mr-2'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className='bg-red-500 text-white px-2 py-1 rounded'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan='3' className='text-center py-4'>
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesManager;