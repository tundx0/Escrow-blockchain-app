import React from "react";
import classNames from "classnames";

export const Card: React.FC<
  React.PropsWithChildren<{ variant?: "primary" | "secondary" }>
> = ({ children, variant = "primary" }) => {
  const cardClasses = classNames("rounded-lg overflow-hidden", {
    "bg-white shadow-lg": variant === "primary",
    "bg-gray-100": variant === "secondary",
  });

  return <div className={cardClasses}>{children}</div>;
};

export const CardHeader: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="bg-gray-100 px-6 py-4 border-b">{children}</div>;
};

export const CardContent: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <div className="p-6">{children}</div>;
};

export const CardFooter: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="bg-gray-100 px-6 py-4 border-t">{children}</div>;
};

export const Button: React.FC<
  React.PropsWithChildren<{
    variant?: "primary" | "secondary";
    size?: "sm" | "md" | "lg";
  }>
> = ({ children, variant = "primary", size = "md", ...props }) => {
  const buttonClasses = classNames(
    "inline-flex justify-center items-center px-4 py-2 rounded-md transition-colors duration-300",
    {
      "bg-blue-500 text-white hover:bg-blue-600": variant === "primary",
      "bg-gray-200 text-gray-700 hover:bg-gray-300": variant === "secondary",
      "text-sm": size === "sm",
      "text-base": size === "md",
      "text-lg": size === "lg",
    }
  );

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export const Heading: React.FC<
  React.PropsWithChildren<{ size: "sm" | "md" | "lg" }>
> = ({ children, size }) => {
  const headingClasses = classNames("font-bold", {
    "text-xl": size === "sm",
    "text-2xl": size === "md",
    "text-3xl": size === "lg",
  });

  return <h2 className={headingClasses}>{children}</h2>;
};

export const Text: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <p className="text-gray-700">{children}</p>;
};

export const Divider: React.FC = () => {
  return <div className="border-b border-gray-200 my-4" />;
};
