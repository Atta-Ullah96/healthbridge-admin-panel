export const Loader = ({ size = 40, className = '' }) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className={`animate-spin rounded-full border-4 border-t-transparent border-primary ${className}`}
        style={{ width: size, height: size }}
      />
    </div>
  );
};
