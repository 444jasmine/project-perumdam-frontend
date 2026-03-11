import React from 'react';

const Input = React.forwardRef(({ label, error, rightIcon, className = "", ...props }, ref) => {
    return (
        <div className={`flex flex-col mb-[16px] w-full max-w-[303px] mx-auto ${className}`}>
            {label && (
                <label className="text-black text-[16px] leading-[150%] tracking-[-0.011em] mb-[8px] font-normal" style={{ fontFamily: 'Inter' }}>
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    ref={ref}
                    className={`w-full h-[48px] px-4 border outline-none transition-all duration-200 bg-white ${error ? "border-red-500 focus:ring-2 focus:ring-red-100" : "border-black focus:border-[#068EC9] focus:ring-2 focus:ring-[#068ec9]/20"
                        }`}
                    style={{ fontFamily: 'Inter', fontSize: '16px' }}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black cursor-pointer hover:opacity-70 transition-opacity p-1">
                        {rightIcon}
                    </div>
                )}
            </div>
            <div className="min-h-[16px] mt-1">
                {error && (
                    <span className="text-red-500 leading-tight block" style={{ fontFamily: 'Inter', fontSize: '10px' }}>
                        {error}
                    </span>
                )}
            </div>
        </div>
    );
});

Input.displayName = "Input";
export default Input;
