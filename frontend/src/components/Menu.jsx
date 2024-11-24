import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { URL } from "../url";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Menu = () => {
  const { loginWithRedirect, logout } = useAuth0();
  const { user, setUser } = useContext(UserContext); // Use user from UserContext
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Immediately clear user from localStorage and context for UI update
      setUser(null);
      localStorage.removeItem("user");
  
      // Invalidate backend session (wait for completion)
      await axios.get(URL + "/api/auth/logout", { withCredentials: true });
  
      // Perform Auth0 logout
      const isGoogleAuthenticated = typeof logout === "function";
      if (isGoogleAuthenticated) {
        await logout(); // Ensure it completes
      }
  
      // Redirect to login page
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
  
      // As a fallback, still redirect to the login page if errors occur
      navigate("/login");
    }
  };
  

  return (
    <div className="bg-black w-[200px] z-10 flex flex-col items-start absolute top-12 right-6 md:right-32 rounded-md p-4 space-y-4">
      {!user && (
        <>
          <h3 className="text-white text-sm hover:text-gray-500 cursor-pointer">
            <Link to="/login">Login</Link>
          </h3>
          <h3 className="text-white text-sm hover:text-gray-500 cursor-pointer">
            <Link to="/register">Register</Link>
          </h3>
        </>
      )}
      {user && (
        <>
          <h3 className="text-white text-sm hover:text-gray-500 cursor-pointer">
            <Link to={`/profile/${user._id}`}>Profile</Link>
          </h3>
          <h3 className="text-white text-sm hover:text-gray-500 cursor-pointer">
            <Link to="/write">Write</Link>
          </h3>
          <h3 className="text-white text-sm hover:text-gray-500 cursor-pointer">
            <Link to={`/myblogs/${user._id}`}>My blogs</Link>
          </h3>
          <h3
            onClick={handleLogout}
            className="text-white text-sm hover:text-gray-500 cursor-pointer"
          >
            Logout
          </h3>
        </>
      )}
    </div>
  );
};

export default Menu;
