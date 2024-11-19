import { useState } from "react";
import { Outlet } from "react-router-dom";

import SideBar from "../../components/SideBar";
import Dashboard from "./Dashboard";
import Products from "./AdminProducts";
import Categories from "./Categories";
import Analysis from "./Analysis";
export default function Admin() {
  return (
    <div className="bg-[#F9F9F9] flex flex-row admin-font h-screen">
      <SideBar />
      <div className="overflow-y-auto flex-1">
        <Outlet />
      </div>
    </div>
  );
}
