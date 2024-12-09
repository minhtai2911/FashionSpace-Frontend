import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import SideBar from "../../components/SideBar";
import Error from "../Error";

import { AuthContext } from "../../context/AuthContext";
import { getUserRoleById } from "../../data/userRoles";

export default function Admin() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const handleCheckRole = async () => {
      if (!isAuthenticated || !user) {
        setError({
          errorCode: 401,
          title: "Unauthorized",
          content: "Authentication is required to access this page.",
        });
        return;
      }

      const role = await getUserRoleById(user.roleId);
      if (role.roleName !== "Admin") {
        setError({
          errorCode: 403,
          title: "Forbidden",
          content: "You do not have the right to access this page",
        });
      } else {
        setUserRole(role.roleName);
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
