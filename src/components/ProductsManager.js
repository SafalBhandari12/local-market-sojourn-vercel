import React, { useState, useEffect } from "react";
import api from "../services/api";

const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    detailedDescription: "",
    price: "",
    origin: "",
    usageInstructions: "",
    careInstructions: "",
    nutritionalInfo: "",
    category: "",
    rating: "",
    featured: false,
    image: null,
    multipleImages: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [message, setMessage] = useState("");

  // Get token from localStorage and include it in headers
  const token = localStorage.getItem("token");
  const config = { headers: { "x-auth-token": token } };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/localmarketproduct");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      if (name === "multipleImages") {
        setFormData({ ...formData, multipleImages: files });
      } else {
        setFormData({ ...formData, [name]: files[0] });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      for (let key in formData) {
        if (key === "multipleImages" && formData.multipleImages.length > 0) {
          for (let i = 0; i < formData.multipleImages.length; i++) {
            form.append("multipleImages", formData.multipleImages[i]);
          }
        } else {
          form.append(key, formData[key]);
        }
      }
      if (isEditing) {
        await api.put(`/api/localmarketproduct/${editProductId}`, form, config);
        setMessage("Product updated successfully.");
      } else {
        await api.post("/api/localmarketproduct", form, config);
        setMessage("Product created successfully.");
      }
      // Reset form and refresh product list
      setFormData({
        name: "",
        description: "",
        detailedDescription: "",
        price: "",
        origin: "",
        usageInstructions: "",
        careInstructions: "",
        nutritionalInfo: "",
        category: "",
        rating: "",
        featured: false,
        image: null,
        multipleImages: [],
      });
      setIsEditing(false);
      setEditProductId(null);
      // Optionally show loading for refetching products
      setLoadingProducts(true);
      fetchProducts();
    } catch (error) {
      setMessage(error.response?.data.msg || "Error submitting form");
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setEditProductId(product.id);
    // Remove any non-numeric characters (like the rupee symbol)
    const numericPrice = product.price
      ? product.price.replace(/[^\d.]/g, "")
      : "";
    setFormData({
      name: product.name,
      description: product.description,
      detailedDescription: product.detailedDescription,
      price: numericPrice,
      origin: product.origin,
      usageInstructions: product.usageInstructions,
      careInstructions: product.careInstructions,
      nutritionalInfo: product.nutritionalInfo,
      category: product.category,
      rating: product.rating,
      featured: product.featured,
      image: null,
      multipleImages: [],
    });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/localmarketproduct/${id}`, config);
      setMessage("Product deleted successfully.");
      // Optionally show loading for refetching products
      setLoadingProducts(true);
      fetchProducts();
    } catch (error) {
      setMessage(error.response?.data.msg || "Error deleting product");
    }
  };

  // Show a loading indicator until both products and categories are fetched
  if (loadingProducts || loadingCategories) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='text-xl'>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Products Manager</h2>
      {message && <div className='mb-4 text-green-600'>{message}</div>}
      <form
        onSubmit={handleFormSubmit}
        className='bg-white p-4 rounded shadow mb-6'
      >
        <h3 className='font-bold mb-2'>
          {isEditing ? "Edit Product" : "Create Product"}
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
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
          <div>
            <label className='block text-gray-700'>Price:</label>
            <input
              type='number'
              name='price'
              value={formData.price}
              onChange={handleInputChange}
              className='border p-2 rounded w-full'
              required
            />
          </div>
          <div>
            <label className='block text-gray-700'>Category:</label>
            <select
              name='category'
              value={formData.category}
              onChange={handleInputChange}
              className='border p-2 rounded w-full'
              required
            >
              <option value=''>Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-gray-700'>Rating:</label>
            <input
              type='number'
              name='rating'
              value={formData.rating}
              onChange={handleInputChange}
              className='border p-2 rounded w-full'
            />
          </div>
          <div className='md:col-span-2'>
            <label className='block text-gray-700'>Description:</label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              className='border p-2 rounded w-full'
              required
            ></textarea>
          </div>
          <div className='md:col-span-2'>
            <label className='block text-gray-700'>Detailed Description:</label>
            <textarea
              name='detailedDescription'
              value={formData.detailedDescription}
              onChange={handleInputChange}
              className='border p-2 rounded w-full'
            ></textarea>
          </div>
          <div className='md:col-span-2'>
            <label className='block text-gray-700'>Origin:</label>
            <input
              type='text'
              name='origin'
              value={formData.origin}
              onChange={handleInputChange}
              className='border p-2 rounded w-full'
            />
          </div>
          <div className='md:col-span-2'>
            <label className='block text-gray-700'>Usage Instructions:</label>
            <textarea
              name='usageInstructions'
              value={formData.usageInstructions}
              onChange={handleInputChange}
              className='border p-2 rounded w-full'
            ></textarea>
          </div>
          <div className='md:col-span-2'>
            <label className='block text-gray-700'>Care Instructions:</label>
            <textarea
              name='careInstructions'
              value={formData.careInstructions}
              onChange={handleInputChange}
              className='border p-2 rounded w-full'
            ></textarea>
          </div>
          <div className='md:col-span-2'>
            <label className='block text-gray-700'>Nutritional Info:</label>
            <textarea
              name='nutritionalInfo'
              value={formData.nutritionalInfo}
              onChange={handleInputChange}
              className='border p-2 rounded w-full'
            ></textarea>
          </div>
          <div>
            <label className='block text-gray-700'>Featured:</label>
            <input
              type='checkbox'
              name='featured'
              checked={formData.featured}
              onChange={handleInputChange}
              className='mt-2'
            />
          </div>
          <div>
            <label className='block text-gray-700'>Image:</label>
            <input
              type='file'
              name='image'
              onChange={handleInputChange}
              className='border p-2 rounded w-full'
              accept='image/*'
            />
          </div>
          <div className='md:col-span-2'>
            <label className='block text-gray-700'>Multiple Images:</label>
            <input
              type='file'
              name='multipleImages'
              onChange={handleInputChange}
              className='border p-2 rounded w-full'
              accept='image/*'
              multiple
            />
          </div>
        </div>
        <button
          type='submit'
          className='mt-4 bg-blue-500 text-white py-2 px-4 rounded'
        >
          {isEditing ? "Update Product" : "Create Product"}
        </button>
      </form>
      <div>
        <h3 className='text-lg font-bold mb-2'>Product List</h3>
        <table className='min-w-full bg-white'>
          <thead>
            <tr>
              <th className='py-2 border'>Name</th>
              <th className='py-2 border'>Price</th>
              <th className='py-2 border'>Category</th>
              <th className='py-2 border'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id}>
                <td className='py-2 border text-center'>{prod.name}</td>
                <td className='py-2 border text-center'>{prod.price}</td>
                <td className='py-2 border text-center'>{prod.category}</td>
                <td className='py-2 border text-center'>
                  <button
                    onClick={() => handleEdit(prod)}
                    className='bg-yellow-500 text-white px-2 py-1 rounded mr-2'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id)}
                    className='bg-red-500 text-white px-2 py-1 rounded'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan='4' className='text-center py-4'>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsManager;