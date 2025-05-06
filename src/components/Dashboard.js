import React, { useState } from "react";
import NavBar from "./NavBar";
import ProductsManager from "./ProductsManager";
import CategoriesManager from "./CategoriesManager";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className='min-h-screen bg-gray-100'>
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className='p-6'>
        {activeTab === "products" && <ProductsManager />}
        {activeTab === "categories" && <CategoriesManager />}
      </div>
    </div>
  );
};

export default Dashboard;
