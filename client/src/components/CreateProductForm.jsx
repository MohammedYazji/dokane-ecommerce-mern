import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import toast from "react-hot-toast";

const categories = [
  "t-shirts",
  "shoes",
  "glasses",
  "makeup",
  "bags",
  "accessories",
];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const { loading, createProduct } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(newProduct);
      // Reset the form after successful submission
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });
      toast.success("Product created successfully!");
    } catch (error) {
      // Error is already handled in the store
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };

      reader.readAsDataURL(file); // as base64 format
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl p-10 mb-10 max-w-2xl mx-auto border border-gray-700"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-cream to-yellow-200 bg-clip-text text-transparent">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-300 mb-1"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="w-full rounded-xl bg-gray-800 border border-gray-600 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-cream focus:outline-none transition"
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-300 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            rows="4"
            className="w-full rounded-xl bg-gray-800 border border-gray-600 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-cream focus:outline-none transition"
            placeholder="Write something about this product..."
            required
          />
        </div>

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-semibold text-gray-300 mb-1"
          >
            Price
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: Number(e.target.value) })
            }
            className="w-full rounded-xl bg-gray-800 border border-gray-600 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-cream focus:outline-none transition"
            placeholder="Enter price in USD"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-semibold text-gray-300 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="w-full rounded-xl bg-gray-800 border border-gray-600 px-4 py-3 text-white focus:ring-2 focus:ring-cream focus:outline-none transition"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-gray-800">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Product Image
          </label>
          <label
            htmlFor="image"
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl p-6 cursor-pointer hover:border-cream transition"
          >
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-gray-400 text-sm">
              Click to upload or drag & drop
            </span>
            <input
              type="file"
              id="image"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
          {newProduct.image && (
            <p className="mt-2 text-sm text-green-400">✔ Image uploaded</p>
          )}
        </div>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-cream text-gray-900 font-semibold py-3 transition hover:bg-yellow-200 focus:ring-2 focus:ring-offset-2 focus:ring-cream disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <PlusCircle className="h-5 w-5" />
              Create Product
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
