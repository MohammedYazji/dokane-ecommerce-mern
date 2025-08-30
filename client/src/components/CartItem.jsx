import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
  const { deleteFromCart, updateQuantity } = useCartStore();

  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-800 backdrop-blur-md p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 md:gap-6">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            className="h-24 w-24 md:h-32 md:w-32 rounded-xl object-cover shadow-inner"
            src={item.product.image}
            alt={item.product.name}
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <p className="text-lg font-semibold text-white hover:text-amber-400 truncate">
            {item.product.name}
          </p>
          <p className="text-sm text-gray-400 line-clamp-2">
            {item.product.description}
          </p>
        </div>
        {/* Quantity Controls */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 transition"
            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
          >
            <Minus size={14} />
          </button>
          <span className="text-white font-medium">{item.quantity}</span>
          <button
            className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 transition"
            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Price & Remove */}
        <div className="flex flex-col items-end gap-2 md:w-32">
          <p className="text-lg font-bold text-amber-400">
            ${item.product.price.toFixed(2)}
          </p>
          <button
            className="flex items-center justify-center text-red-400 hover:text-red-300 transition"
            onClick={() => deleteFromCart(item.product._id)}
          >
            <Trash size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
