import toast from "react-hot-toast";
import { ShoppingCart, Star } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products to cart", { id: "login" });
      return;
    } else {
      addToCart(product);
    }
  };

  return (
    <div className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-lg transition hover:shadow-xl hover:border-emerald-500/50">
      {/* Product Image */}
      <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <img
          className="object-cover w-full h-full transform transition duration-500 group-hover:scale-105"
          src={product.image}
          alt={product.name}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-70 group-hover:opacity-60 transition" />
        {/* Featured badge (optional) */}
        {product.isFeatured && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-md bg-yellow-400 px-2 py-1 text-xs font-semibold text-gray-900 shadow">
            <Star className="h-3 w-3" /> Featured
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 justify-between px-5 py-5">
        <div>
          <h5 className="text-lg font-semibold tracking-tight text-white group-hover:text-gray-300 transition">
            {product.name}
          </h5>
          <p className="mt-2 text-sm text-gray-400 line-clamp-2">
            {product.description || "No description available"}
          </p>
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-dark">${product.price}</span>
          <button
            className="flex items-center justify-center gap-2 rounded-lg bg-dark px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={20} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
