import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoPerumdam from '../../assets/logo_perumdam.png';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex flex-col relative w-full h-full pb-[40px]">
            {/* Top Status Bar (Mockup from Figma) */}
            <div className="w-full h-[44px] px-[24px] flex justify-between items-center py-[14px] bg-transparent z-10">
                <div className="text-black font-semibold text-[15px]" style={{ fontFamily: 'SF Pro, -apple-system, sans-serif' }}>
                    9:41
                </div>
                <div className="flex items-center gap-[6px]">
                    {/* Cellular */}
                    <div className="w-[17px] h-[10.5px] flex items-end justify-between">
                        <div className="w-[3px] h-[4px] bg-black rounded-[1px]"></div>
                        <div className="w-[3px] h-[6px] bg-black rounded-[1px]"></div>
                        <div className="w-[3px] h-[8px] bg-black rounded-[1px]"></div>
                        <div className="w-[3px] h-[10.5px] bg-black rounded-[1px]"></div>
                    </div>
                    {/* Wifi */}
                    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8 11C10.027 11 11.8385 10.1264 12.8797 8.70513L8 2.01633C4.85805 2.01633 1.95483 3.49399 0 5.83643L2.49635 9.25624C4.12036 10.3541 6.01258 11 8 11ZM8 9.5C6.44284 9.5 5.011 8.94165 3.88126 8.019L8 2.37508L12.1187 8.019C10.989 8.94165 9.55716 9.5 8 9.5Z" fill="black" />
                        <circle cx="8" cy="8.5" r="1.5" fill="black" />
                        <path d="M12.9231 4.57688C11.5385 3.19227 9.84616 2.5 8 2.5C6.15385 2.5 4.46154 3.19227 3.07692 4.57688L4.13846 6.05C5.17692 5.01153 6.51538 4.5 8 4.5C9.48462 4.5 10.8231 5.01153 11.8615 6.05L12.9231 4.57688Z" fill="black" />
                        <path d="M14.9615 1.76918C13.1154 0.615339 10.6538 0 8 0C5.34615 0 2.88462 0.615339 1.03846 1.76918L2.09999 3.24227C3.63846 2.39611 5.63846 2 8 2C10.3615 2 12.3615 2.39611 13.9 3.24227L14.9615 1.76918Z" fill="black" />
                    </svg>
                    {/* Battery */}
                    <div className="relative w-[25px] h-[11.5px]">
                        <div className="absolute inset-0 border border-black opacity-35 rounded-[3px]"></div>
                        <div className="absolute left-[2px] top-[2px] bottom-[2px] w-[18px] bg-black rounded-[1.5px]"></div>
                        <div className="absolute right-[-1.5px] top-[4px] bottom-[4px] w-[1px] bg-black opacity-40 rounded-r-sm"></div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-between items-center px-[16px] pt-[10px] pb-[30px] animate-[fadeIn_0.5s_ease-out]">
                <button
                    onClick={() => navigate(-1)}
                    className="p-1 text-[#1E1E1E] hover:bg-gray-100 rounded-full transition-colors active:scale-95"
                >
                    <ChevronLeft size={32} strokeWidth={2} />
                </button>
                <button
                    onClick={() => navigate('/login')}
                    className="p-1 text-[#1E1E1E] hover:bg-gray-100 rounded-full transition-colors active:scale-95"
                >
                    <ChevronRight size={32} strokeWidth={2} />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col items-center justify-start px-[40px] pt-[10px] animate-[fadeIn_0.5s_ease-out_0.1s_both]">
                {/* Text Section */}
                <div className="text-center mb-[60px]">
                    <h1 className="text-[#1E576F] font-bold text-[32px] leading-[150%] tracking-[-0.011em] mb-[10px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Selamat Datang!
                    </h1>
                    <p className="text-[#000000] text-[15px] leading-[150%] tracking-[-0.011em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Halaman beranda kami siap digunakan.<br />
                        Silakan gunakan akun yang telah diberikan.
                    </p>
                </div>

                {/* Logo Section */}
                <div className="w-[200px] h-[200px] mb-auto flex justify-center items-center">
                    <img src={logoPerumdam} alt="Logo Perumdam Bantul" className="w-full h-auto object-contain drop-shadow-sm" />
                </div>
            </div>

            {/* Login Button */}
            <div className="w-full flex justify-center pb-[40px] animate-[fadeIn_0.5s_ease-out_0.2s_both]">
                <button
                    onClick={() => navigate('/login')}
                    className="w-[303px] h-[58px] bg-[#068EC9] rounded-[50px] flex items-center justify-center transition-transform active:scale-[0.98] outline-none hover:bg-[#057ab0]"
                    style={{
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    }}
                >
                    <span className="text-[#FFFFFF] font-bold text-[24px] leading-[150%] tracking-[-0.011em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Login
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Welcome;
