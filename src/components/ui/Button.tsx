type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "green" | "destructive";
  onClick?: () => void;
};

export default function Button({
  children,
  className = "",
  variant = "default",
  ...props
}: ButtonProps) {
  const baseClass = "px-4 py-2 rounded-lg text-white transition";
  const variants = {
    default: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    destructive: "bg-red-500 hover:bg-red-600",
  };

  return (
    <button
      className={`${baseClass} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
