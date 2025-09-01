import { CheckCircle, HandHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const { clearCart } = useCartStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCheckoutSuccess = async (sessionId) => {
      try {
        await axios.post("/payments/checkout-success", { sessionId });
        clearCart();
      } catch (error) {
        console.error(error);
      } finally {
        setIsProcessing(false);
      }
    };

    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    if (sessionId) {
      handleCheckoutSuccess(sessionId);
    } else {
      setIsProcessing(false);
      setError("No session ID found in the URL");
    }
  }, [clearCart]);

  if (isProcessing) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-700 text-lg">
        Processing your order...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-400 text-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 relative">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.15}
        numberOfPieces={500}
        recycle={false}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-gray-700"
      >
        <div className="p-8">
          {/* Icon */}
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <CheckCircle className="text-amber-300 w-16 h-16 mb-4 drop-shadow-lg" />
            </motion.div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-extrabold text-center text-white mb-3 tracking-tight">
            Purchase Successful!
          </h1>

          {/* Description */}
          <p className="text-gray-300 text-center mb-1">
            🎉 Thank you for your order!
          </p>
          <p className="text-dark text-center text-sm mb-8">
            Check your email for details and delivery updates.
          </p>

          {/* Order Summary */}
          <div className="bg-gray-700/70 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Order number</span>
              <span className="text-sm font-semibold text-dark">#12345</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Estimated delivery</span>
              <span className="text-sm font-semibold text-dark">
                3-5 business days
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              className="w-full bg-dark hover:bg-light text-gray-700 font-semibold py-2.5 px-4
               rounded-xl transition duration-300 flex items-center justify-center shadow-md"
            >
              <HandHeart className="mr-2" size={18} />
              Thanks for trusting us!
            </button>
            <Link
              to="/"
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 px-4 
              rounded-xl transition duration-300 flex items-center justify-center shadow-md"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PurchaseSuccessPage;
