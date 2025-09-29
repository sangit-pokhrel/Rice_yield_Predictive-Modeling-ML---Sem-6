import React from "react";

export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`group flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-semibold 
                  bg-yellow-200 text-black border border-yellow-200 
                  hover:bg-transparent hover:text-white hover:border-yellow-200 
                  transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}