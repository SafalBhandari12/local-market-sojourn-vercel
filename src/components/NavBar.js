import React from "react";

const NavBar = ({ activeTab, setActiveTab }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className='bg-white shadow p-4 flex justify-between items-center'>
      <div className='flex space-x-4'>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-3 py-2 rounded ${
            activeTab === "products"
              ? "bg-blue-500 text-white"
              : "text-gray-700"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-3 py-2 rounded ${
            activeTab === "categories"
              ? "bg-blue-500 text-white"
              : "text-gray-700"
          }`}
        >
          Categories
        </button>
      </div>
      <div>
        <button
          onClick={handleLogout}
          className='px-3 py-2 bg-red-500 text-white rounded'
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
