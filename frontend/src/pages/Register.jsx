import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useState } from "react";
import axios from "axios";
import { URL } from "../url";
import { useAuth0 } from "@auth0/auth0-react";

const Register = () => {
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const validateEmailWithZeroBounce = async (email) => {
    const apiKey = "c38f213db48d4e66b2ca29cff41c8733"; // Replace with your ZeroBounce API Key

    try {
      const response = await axios.get("https://api.zerobounce.net/v2/validate", {
        params: {
          api_key: apiKey,
          email: email,
        },
      });

      const data = response.data;

      if (data.status === "valid") {
        return true; // Email is valid
      } else if (data.status === "invalid") {
        return false; // Email is invalid
      } else if (data.status === "catch-all" || data.status === "unknown") {
        return "unknown"; // You can customize this handling based on your app
      } else {
        return false; // Any other status
      }
    } catch (error) {
      console.error("Error validating email:", error);
      return false; // In case of API error, consider email invalid
    }
  };

  const handleRegister = async () => {
    setLoading(true); // Set loading to true when starting the registration process

    const isValidEmail = await validateEmailWithZeroBounce(email);
    if (isValidEmail === false) {
      setError(true);
      setMessage("The email address is invalid.");
      setLoading(false); // Set loading back to false
      return;
    } else if (isValidEmail === "unknown") {
      setError(true);
      setMessage("Unable to verify the email address.");
      setLoading(false); // Set loading back to false
      return;
    }

    if (password.length < 8 || password.length > 16) {
      setError(true);
      setMessage("Password length should be between 8 to 16 characters.");
      setLoading(false); // Set loading back to false
      return;
    }

    try {
      const res = await axios.post(URL + "/api/auth/register", { username, email, password });
      setUsername(res.data.username);
      setEmail(res.data.email);
      setPassword(res.data.password);
      setError(false);
      navigate("/login");
    } catch (err) {
      setError(true);
      setMessage("An error occurred during registration.");
      console.log(err);
    } finally {
      setLoading(false); // Set loading back to false after request completes
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Trigger login with redirect
      await loginWithRedirect(); // This triggers the redirect to Auth0 login page
  
      // Check if the user is authenticated
      if (isAuthenticated && user) {
        // Once logged in, check if the user exists in your database
        const { email, name } = user;
  
        const res = await axios.get(`${URL}/api/users/${email}`);
  
        if (res.data) {
          // User exists, log them in
          console.log("User exists:", res.data);
          setUser(res.data); // Store user data in context
          localStorage.setItem("user", JSON.stringify(res.data)); // Store in localStorage
          navigate("/"); // Redirect to homepage
        } else {
          // User doesn't exist, create a new user in your database
          await axios.post(URL + "/api/auth/register", {
            username: name,
            email: email,
            password: null, // Password will be handled by OAuth
          });
  
          // Redirect to login page after successful registration
          navigate("/login");
        }
      }
    } catch (err) {
      console.error("Error during login:", err);
    }
  };
  

  return (
    <>
      <div className="flex items-center justify-between px-6 md:px-[200px] py-4">
        <h1 className="text-lg md:text-xl font-extrabold">
          <Link to="/">Blog Live</Link>
        </h1>
        <h3>
          <Link to="/login">Login</Link>
        </h3>
      </div>

      <div className="w-full flex justify-center items-center h-[80vh]">
        <div className="flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%]">
          <h1 className="text-xl font-bold text-left">Create an account</h1>
          <input
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border-2 border-black outline-0"
            type="text"
            placeholder="Enter your username"
            disabled={loading} // Disable input while loading
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border-2 border-black outline-0"
            type="text"
            placeholder="Enter your email"
            disabled={loading} // Disable input while loading
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border-2 border-black outline-0"
            type="password"
            placeholder="Enter your password"
            disabled={loading} // Disable input while loading
          />
          <button
            onClick={handleRegister}
            className="w-full px-4 py-4 text-lg font-bold text-white bg-black rounded-lg hover:bg-gray-500 hover:text-black"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Registering..." : "Register"} {/* Change button text based on loading state */}
          </button>
          {error && <h3 className="text-red-500 text-sm ">{message}</h3>}
          <div className="flex justify-center items-center space-x-3">
            <p>Already have an account?</p>
            <p className="text-gray-500 hover:text-black">
              <Link to="/login">Login</Link>
            </p>
          </div>

          {/* Google Login Button */}
          {!isAuthenticated && (
            <button
              onClick={handleGoogleLogin}
              className="text-gray-500 hover:text-black"
            >
              Google
            </button>
          )}

          {/* Logout Button (for Auth0 authenticated users) */}
          {isAuthenticated && (
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="text-gray-500 hover:text-black"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Register;
