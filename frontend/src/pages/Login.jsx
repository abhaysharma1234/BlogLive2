import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../url";
import { UserContext } from "../context/UserContext";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { user, loginWithRedirect, logout, loginWithPopup, isAuthenticated } = useAuth0();
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    // If user is authenticated (via Auth0), automatically set the user in context and localStorage
    if (isAuthenticated && user) {
      const userData = {
        name: user.name,
        email: user.email,
        picture: user.picture,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      // Redirect to home after successful login
      navigate("/");
    }
  }, [isAuthenticated, user, setUser, navigate]);

  const handleLogin = async () => {
    try{
      const res=await axios.post(URL+"/api/auth/login",{email,password},{withCredentials:true})
      // console.log(res.data)
      setUser(res.data)
      navigate("/")

    }
    catch(err){
      setError(true)
      console.log(err)

    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Perform the Google login
      await loginWithPopup(); // This will trigger the popup and wait for authentication to finish
      
      // After successful login, check if the user is authenticated
      if (user) {
        // Set user data into the context and localStorage only after successful login
        const userData = {
          name: user.name,
          email: user.email,
          picture: user.picture,
        };
  
        setUser(userData); // Set the user data in context
        localStorage.setItem("user", JSON.stringify(userData)); // Persist user data in localStorage
  
        // Redirect to the homepage
        navigate("/"); 
      } else {
        // If user is not available after login, log an error
        console.error("User data is not available after Google login");
      }
    } catch (err) {
      console.error("Error during login:", err); // Log any error
    }
  };
  

  return (
    <>
      <div className="flex items-center justify-between px-6 md:px-[200px] py-4">
        <h1 className="text-lg md:text-xl font-extrabold"><Link to="/">Blog Live</Link></h1>
        <h3><Link to="/register">Register</Link></h3>
      </div>

      <div className="w-full flex justify-center items-center h-[80vh]">
        <div className="flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%]">
          <h1 className="text-xl font-bold text-left">Log in to your account</h1>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border-2 border-black outline-0"
            type="text"
            placeholder="Enter your email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border-2 border-black outline-0"
            type="password"
            placeholder="Enter your password"
          />
          <button
            onClick={handleLogin}
            className="w-full px-4 py-4 text-lg font-bold text-white bg-black rounded-lg hover:bg-gray-500 hover:text-black"
          >
            Log in
          </button>
          {error && <h3 className="text-red-500 text-sm">Wrong Credentials, Please try again</h3>}
          <div className="flex justify-center items-center space-x-3">
            <p>New here?</p>
            <p className="text-gray-500 hover:text-black"><Link to="/register">Register</Link></p>
            <p className="text-gray-500 hover:text-black"><Link to="/forgot">Forgot password</Link></p>
          </div>

          {/* Only show the Google button, remove logout button completely */}
          <button
            onClick={handleGoogleLogin}
            className="text-gray-500 hover:text-black"
          >
            Google
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;
