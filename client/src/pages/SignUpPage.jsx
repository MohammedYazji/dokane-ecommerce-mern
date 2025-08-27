import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Loader } from "lucide-react";
import { motion } from "framer-motion";
import FormField from "../components/FormField.jsx";
import { useUserStore } from "../stores/useUserStore.js";

const SignUpPage = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signup, loading } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(userData);
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-6">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-700">
          Join Our Family
        </h2>
      </motion.div>
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-white py-8 px-4 mt-6 shadow-2xl border-amber-300 border-1 shadow-dark sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <FormField
                field_id="name"
                field_name="Full name"
                userData={userData}
                setUserData={setUserData}
                placeholder="Mohammed Yazji"
              />
              <FormField
                field_id="email"
                field_name="Email Address"
                userData={userData}
                setUserData={setUserData}
                placeholder="mohammed@example.com"
              />
              <FormField
                field_id="password"
                field_name="Password"
                userData={userData}
                setUserData={setUserData}
                placeholder="••••••••••••"
              />
              <FormField
                field_id="confirmPassword"
                field_name="Confirm Password"
                userData={userData}
                setUserData={setUserData}
                placeholder="••••••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition duration-150 ease-in-out disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader
                    className="mr-2 h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  Loading...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
                  Sign up
                </>
              )}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-gray-700 hover:text-gray-600"
            >
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
