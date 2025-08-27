export const Loader = () => {
  return (
    <div className="flex justify-center items-center bg-cream min-h-screen">
      <div className="relative">
        <div className="w-20 h-20 border-amber-300 border-2 rounded-full" />
        <div className="w-20 h-20 border-amber-600 border-t-2 rounded-full absolute animate-spin  left-0 top-0" />
      </div>
      <div className="sr-only">Loading</div>
    </div>
  );
};

export default Loader;
