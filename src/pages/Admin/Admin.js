import { useState } from "react";

import NavBar from "../../components/NavBar";
import Dashboard from "./Dashboard";
import Products from "./Products";
import Categories from "./Categories";
import Analysis from "./Analysis";
export default function Admin() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="bg-[#F9F9F9] flex flex-row gap-x-10">
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="pt-14">
        {activeTab === 0 && <Dashboard />}
        {activeTab === 1 && <Products />}
        {activeTab === 2 && <Categories />}
        {activeTab === 3 && <Analysis />}
      </div>
    </div>
  );
}
