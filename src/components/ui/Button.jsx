import React from 'react';

const Button = ({ children, variant = "primary", className = "", ...props }) => {
    const baseStyle = "w-full max-w-[303px] h-[58px] rounded-[50px] font-bold text-[24px] leading-[150%] tracking-[-0.011em] flex justify-center items-center mx-auto transition-all duration-300 active:scale-[0.98] outline-none";
    const variants = {
        primary: "bg-[#068EC9] border border-[#015E9C] text-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:bg-[#057ab0] hover:shadow-[0px_6px_8px_rgba(0,0,0,0.3)]",
        secondary: "bg-gray-light text-gray-dark hover:bg-gray-300 shadow-none",
        outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-none",
    };

    return (
        <button
            className={`${baseStyle} ${variants[variant]} ${className}`}
            style={{ fontFamily: 'Inter, sans-serif' }}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
