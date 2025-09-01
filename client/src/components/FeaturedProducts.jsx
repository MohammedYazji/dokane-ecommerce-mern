import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const FeaturedProducts = ({ featuredProducts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const { addToCart } = useCartStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else if (window.innerWidth < 1280) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => prev + itemsPerPage);
  const prevSlide = () => setCurrentIndex((prev) => prev - itemsPerPage);

  const isStartDisabled = currentIndex === 0;
  const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-5xl sm:text-6xl font-extrabold text-gray-700 mb-10 tracking-wide">
          Featured Products
        </h2>

        <div className="relative">
          <div className="overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsPerPage)
                }%)`,
              }}
            >
              {featuredProducts?.map((product) => (
                <div
                  key={product._id}
                  className={`flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-3`}
                >
                  <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden h-full flex flex-col justify-between border border-amber-300 hover:shadow-2xl transition-shadow duration-300">
                    <div className="overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-56 object-cover transform transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {product.name}
                      </h3>
                      <p className="text-amber-400 font-bold text-lg mb-4">
                        ${product.price.toFixed(2)}
                      </p>
                      <button
                        onClick={() => addToCart(product)}
                        className="mt-auto w-full bg-light hover:bg-dark text-gray-700 font-semibold py-3 rounded-lg flex items-center justify-center transition-all duration-300"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={isStartDisabled}
            className={`absolute top-1/2 -left-5 transform -translate-y-1/2 p-3 rounded-full transition-colors duration-300 ${
              isStartDisabled
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-amber-500 hover:bg-"
            }`}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isEndDisabled}
            className={`absolute top-1/2 -right-5 transform -translate-y-1/2 p-3 rounded-full transition-colors duration-300 ${
              isEndDisabled
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-amber-500 hover:bg-"
            }`}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
