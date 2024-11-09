import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ROLE_NAME } from "../utils/Constants";
import Rating from "./Rating";

function Review({
  user = null,
  rating = null,
  content = "",
  createdDate = "",
  onReply,
  showInput,
}) {
  const [role, setRole] = useState("");
  const { getRoleName } = useContext(AuthContext);
  const roleId = JSON.parse(localStorage.getItem("user")).roleId;
  useEffect(() => {
    const getRole = async () => {
      try {
        const roleName = await getRoleName(roleId);
        setRole(roleName);
      } catch (error) {}
    };
    getRole();
  }, []);
  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex flex-row gap-x-2">
        <img
          className="w-12 h-12 rounded-full"
          src={user?.avatar}
          alt={user?.name}
        />
        <div>
          <p className="text-sm font-medium">{user?.name}</p>
          <div className="flex items-center space-x-1 gap-x-2 text-gray-500">
            {rating && (
              <div className="flex flex-row items-center">
                <Rating percentage={Math.round((rating / 5) * 100)} />
                <p className="ml-2 text-lg">{rating}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="ml-14 text-sm mt-1">{content}</div>
      <div className="flex flex-row mt-2 gap-x-8 ml-14">
        <p className="text-[#818181] text-sm">{createdDate}</p>
        {ROLE_NAME.EMPLOYEE === role && (
          <button className="text-[#4A4A4A] text-sm" onClick={onReply}>
            {showInput ? "Cancel" : "Reply"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Review;
