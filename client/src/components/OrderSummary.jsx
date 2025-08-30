import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";

const OrderSummary = () => {
  const { total, subTotal, coupon, isCouponApplied } = useCartStore();

  const savings = subTotal - total;
  const formattedSubtotal = subTotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  return (
    <motion.div
      className="w-full max-w-md mx-auto rounded-xl bg-gray-900 border border-gray-700 p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-light mb-6">Order Summary</h2>

      <div className="space-y-4">
        <div className="space-y-3">
          <dl className="flex justify-between text-gray-300">
            <dt>Original Price</dt>
            <dd className="font-medium text-white">${formattedSubtotal}</dd>
          </dl>

          {savings > 0 && (
            <dl className="flex justify-between text-gray-300">
              <dt>Savings</dt>
              <dd className="font-medium text-amber-300">
                -${formattedSavings}
              </dd>
            </dl>
          )}

          {coupon && isCouponApplied && (
            <dl className="flex justify-between text-gray-300">
              <dt>Coupon ({coupon.code})</dt>
              <dd className="font-medium text-amber-300">
                -{coupon.discountPercentage}%
              </dd>
            </dl>
          )}

          <dl className="flex justify-between text-white border-t border-gray-600 pt-3 font-bold">
            <dt>Total</dt>
            <dd className="text-amber-200">${formattedTotal}</dd>
          </dl>
        </div>

        <motion.button
          className="w-full bg-dark hover:bg-light text-white font-semibold py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 transition-transform duration-200"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Proceed to Checkout
        </motion.button>

        <div className="flex justify-center items-center gap-2 mt-2">
          <span className="text-gray-400">or</span>
          <Link
            to="/"
            className="flex items-center gap-1 text-amber-200 font-medium hover:text-amber-300 underline hover:no-underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
