import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { FaBars } from "react-icons/fa";
import { useContext, useState } from "react";
import Menu from "./Menu";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const [prompt, setPrompt] = useState("");
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();
  const path = useLocation().pathname;

  const showMenu = () => {
    setMenu(!menu);
  };

  const { user } = useContext(UserContext);

  return (
    <div className="flex items-center justify-between px-6 md:px-[200px] py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md">
      {/* Logo */}
      <h1 className="text-lg md:text-2xl font-extrabold tracking-wider hover:text-yellow-300 transition duration-200">
        <Link to="/">Blog Live</Link>
      </h1>

      {/* Search Bar */}
      {path === "/" && (
        <div className="flex justify-center items-center space-x-2 bg-white text-gray-700 px-4 py-1 rounded-full shadow-md">
          <p
            onClick={() =>
              navigate(prompt ? "?search=" + prompt : navigate("/"))
            }
            className="cursor-pointer"
          >
            <BsSearch className="text-gray-500 hover:text-blue-500" />
          </p>
          <input
            onChange={(e) => setPrompt(e.target.value)}
            className="outline-none bg-transparent w-full text-sm placeholder-gray-500"
            placeholder="Search a post"
            type="text"
          />
        </div>
      )}

      {/* Links */}
      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          <h3 className="hover:text-yellow-300 transition duration-200">
            <Link to="/write">Write</Link>
          </h3>
        ) : (
          <h3 className="hover:text-yellow-300 transition duration-200">
            <Link to="/login">Login</Link>
          </h3>
        )}
        {user ? (
          <div onClick={showMenu}>
            <p className="cursor-pointer relative hover:text-yellow-300 transition duration-200">
              <FaBars />
            </p>
            {menu && <Menu />}
          </div>
        ) : (
          <h3 className="hover:text-yellow-300 transition duration-200">
            <Link to="/register">Register</Link>
          </h3>
        )}
      </div>

      {/* Mobile Menu */}
      <div
        onClick={showMenu}
        className="md:hidden text-lg cursor-pointer hover:text-yellow-300 transition duration-200"
      >
        <p className="relative">
          <FaBars />
        </p>
        {menu && <Menu />}
      </div>
    </div>
  );
};

export default Navbar;
