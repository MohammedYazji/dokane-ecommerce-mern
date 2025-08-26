import { Mail, Lock, User } from "lucide-react";

const FormField = ({
  field_id,
  field_name,
  userData,
  setUserData,
  placeholder,
}) => {
  return (
    <>
      <label
        htmlFor={field_id}
        className="block text-sm font-medium text-gray-700"
      >
        {field_name}
      </label>
      <div className="mt-1 mb-4 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {field_id === "name" && (
            <User className="h-5 w-5 text-dark" aria-hidden="true" />
          )}
          {field_id === "email" && (
            <Mail className="h-5 w-5 text-dark" aria-hidden="true" />
          )}
          {field_id === "password" && (
            <Lock className="h-5 w-5 text-dark" aria-hidden="true" />
          )}
          {field_id === "confirmPassword" && (
            <Lock className="h-5 w-5 text-dark" aria-hidden="true" />
          )}
        </div>
        <input
          id={field_id}
          type={
            field_id === "password" || field_id === "confirmPassword"
              ? "password"
              : field_id === "email"
              ? "email"
              : "text"
          }
          required
          value={userData[field_id]}
          onChange={(e) =>
            setUserData({ ...userData, [field_id]: e.target.value })
          }
          className="block w-full px-3 py-2 pl-10 bg-cream border-amber-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
          placeholder={placeholder}
        />
      </div>
    </>
  );
};

export default FormField;
