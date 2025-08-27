import { ShoppingCart, UserPlus, LogIn, LogOut, UserStar } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const Navbar = () => {
  const { user } = useUserStore();
  const isAdmin = user.role === "admin";

  return (
    <header className="fixed top-0 left-0 w-full bg-accent bg-opacity-90 backdrop:blur-md shadow-lg z-40 transition-all duration-300 border-b border-amber-300">
      <div className="container mx-auto px-10 py-3">
        <div className="flex flex-wrap items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold text-gray-700 items-center space-x-2 flex group hover:text-white"
          >
            Dokane<span className="group-hover:ml-3 duration-300">e</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-4">
            <Link
              to="/"
              className=" text-gray-700 hover:text-white transition duration-300 ease-in-out"
            >
              Home
            </Link>
            {user && (
              <Link
                to="/cart"
                className="relative group text-gray-700 hover:text-gray-600 transition duration-300 ease-in-out"
              >
                <ShoppingCart
                  className="inline-block mr-1 group-hover:text-gray-700"
                  size={20}
                />
                <span className="hidden sm:inline">My Cart</span>
                <span className="absolute -top-2 -left-4 bg-light text-gray-700 rounded-full px-2 py-0.5 text-xs group-hover:bg-dark group-hover:text-white  transition duration-300 ease-in-out">
                  0
                </span>
              </Link>
            )}
            {isAdmin && (
              <Link className="bg-light hover:bg-dark hover:text-white text-gray-700  px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center">
                <UserStar className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}
            {user ? (
              <button className="bg-light hover:bg-dark hover:text-white text-gray-700 py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out">
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-light hover:bg-dark hover:text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus size={18} className="mr-2" />
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-light hover:bg-dark hover:text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn size={18} className="mr-2" />
                  Log in
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
