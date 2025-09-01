import { XCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PurchaseCancelPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-center">
            <XCircle className="text-red-500 w-20 h-20 mb-4 drop-shadow-lg" />
          </div>

          <h1 className="text-3xl font-extrabold text-center text-red-500 mb-3">
            Purchase Cancelled
          </h1>
          <p className="text-gray-400 text-center mb-6">
            Your order has been cancelled. No charges have been made.
          </p>

          <div className="bg-gray-800/60 rounded-xl p-4 mb-8 border border-gray-700">
            <p className="text-sm text-gray-400 text-center leading-relaxed">
              If you experienced any issues during checkout, please contact our
              support team for help.
            </p>
          </div>

          <Link
            to="/"
            className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="mr-2" size={18} />
            Return to Shop
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PurchaseCancelPage;
