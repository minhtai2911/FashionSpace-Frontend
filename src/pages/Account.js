import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Account() {
  const { user } = useContext(AuthContext);

  return <div>{user && <p>Hello {user.full_name}</p>}</div>;
}

export default Account;
