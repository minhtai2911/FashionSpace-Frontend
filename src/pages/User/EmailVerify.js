import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useAxios from "../../services/useAxios";

const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(true);
  const param = useParams();
  const api = useAxios();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const { data } = await api.get(`/auth/verifyAccount/${param.id}`, {
          headers: { "Content-Type": "application/json" },
        });
        console.log(data);
        setValidUrl(true);
      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [param]);

  return validUrl ? (
    <div className="w-screen h-screen flex items-center justify-center flex-col">
      <h1>Email verified successfully</h1>
      <Link to="/login">
        <button className="border-none outline-none">Login</button>
      </Link>
    </div>
  ) : (
    <h1>404 Not Found</h1>
  );
};

export default EmailVerify;
