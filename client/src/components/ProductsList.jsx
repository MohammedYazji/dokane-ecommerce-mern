import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../stores/useProductStore.js";

const ProductsList = () => {
  const { products, toggleFeatured, deleteProduct } = useProductStore();

  return (
    <motion.div
      className="max-w-6xl mx-auto px-6 py-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="overflow-hidden rounded-2xl shadow-lg bg-gray-800 border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {["Product", "Price", "Category", "Featured", "Delete"].map(
                (header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {products?.map((product) => (
              <motion.tr
                key={product._id}
                whileHover={{ scale: 1.01 }}
                className="hover:bg-gray-800/70 transition"
              >
                {/* Product */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      className="h-12 w-12 rounded-lg object-cover border border-gray-600"
                      src={product.image}
                      alt={product.name}
                    />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-white">
                        {product.name}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="px-6 py-4 text-sm text-gray-300">
                  ${product.price.toFixed(2)}
                </td>

                {/* Category */}
                <td className="px-6 py-4 text-sm text-gray-300">
                  {product.category}
                </td>

                {/* Featured */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleFeatured(product._id)}
                    className={`p-2 rounded-full transition-colors duration-200 shadow-sm ${
                      product.isFeatured
                        ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    <Star className="h-5 w-5" />
                  </button>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-sm font-medium">
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="p-2 rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ProductsList;
