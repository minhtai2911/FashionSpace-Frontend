import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Cookies from "js-cookie";

import SideBar from "../../components/SideBar";
import Error from "../Error";

import { AuthContext } from "../../context/AuthContext";
import { getUserRoleById } from "../../data/userRoles";

export default function Admin() {
  const { isAuthenticated } = useContext(AuthContext);
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const handleCheckRole = async () => {
      if (!user) {
        setError({
          errorCode: 401,
          title: "Unauthorized",
          content: "Cần xác thực để truy cập trang này.",
        });
        return;
      }

      const role = await getUserRoleById(user.roleId);
      if (role.roleName === "Admin" || role.roleName === "Employee") {
        setUserRole(role.roleName);
      } else {
        setError({
          errorCode: 403,
          title: "Forbidden",
          content: "Bạn không có quyền truy cập trang này.",
        });
      }
    };

    handleCheckRole();
  }, [isAuthenticated, user]);

  if (error) {
    return <Error {...error} />;
  }

  return (
    <div className="bg-[#F9F9F9] flex flex-row admin-font h-screen">
      <SideBar userRole={userRole} />
      <div className="overflow-y-auto flex-1">
        <Outlet />
      </div>
    </div>
  );
}
