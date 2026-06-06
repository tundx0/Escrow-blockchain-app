import React from "react";
import classNames from "classnames";

export const Card: React.FC<
  React.PropsWithChildren<{ variant?: "primary" | "secondary" }>
> = ({ children, variant = "primary" }) => {
  const cardClasses = classNames(
    "rounded-2xl overflow-hidden border backdrop-blur-md",
    {
      "bg-slate-950/60 border-slate-800/80 shadow-xl": variant === "primary",
      "bg-slate-900/40 border-slate-800/40": variant === "secondary",
    }
  );

  return <div className={cardClasses}>{children}</div>;
};

export const CardHeader: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="bg-slate-900/60 px-6 py-4 border-b border-slate-800/80">{children}</div>;
};

export const CardContent: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <div className="p-6">{children}</div>;
};

export const CardFooter: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="bg-slate-900/60 px-6 py-4 border-t border-slate-800/80">{children}</div>;
};

export const Button: React.FC<
  React.PropsWithChildren<{
    variant?: "primary" | "secondary";
    size?: "sm" | "md" | "lg";
  }> &
    React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, variant = "primary", size = "md", className, ...props }) => {
  const buttonClasses = classNames(
    "inline-flex justify-center items-center font-semibold rounded-xl transition-all duration-300 cursor-pointer shadow-md",
    {
      "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-900/35 hover:shadow-lg hover:-translate-y-[1px] active:translate-y-0":
        variant === "primary",
      "bg-slate-800 text-slate-200 border border-slate-700/80 hover:bg-slate-700":
        variant === "secondary",
      "text-xs px-3 py-1.5": size === "sm",
      "text-sm px-5 py-2.5": size === "md",
      "text-base px-6 py-3.5": size === "lg",
    },
    className
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
  const headingClasses = classNames("font-bold text-slate-100 tracking-wide", {
    "text-xl": size === "sm",
    "text-2xl": size === "md",
    "text-3xl": size === "lg",
  });

  return <h2 className={headingClasses}>{children}</h2>;
};

export const Text: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <p className="text-slate-350 leading-relaxed">{children}</p>;
};

export const Divider: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={classNames("border-b border-slate-800/80 my-4", className)}
      {...props}
    />
  );
};
