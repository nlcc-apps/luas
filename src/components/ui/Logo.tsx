import luasLogo from "@/assets/luas-logo.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className = "", size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16"
  };

  return (
    <img 
      src={luasLogo} 
      alt="L.U.A.S Logo" 
      className={`w-auto ${sizeClasses[size]} ${className}`}
    />
  );
};