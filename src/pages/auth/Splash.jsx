import React, { useEffect } from 'react';
import { Target, Wrench, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoPerumdam from '../../assets/logo_perumdam.png';

const Splash = () => {
    const navigate = useNavigate();

    // Optionally auto-redirect after a few seconds (common for splash screens)
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/welcome');
        }, 3000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div
            className="min-h-screen bg-white flex flex-col relative w-full h-full overflow-hidden cursor-pointer"
            onClick={() => navigate('/welcome')}
        >
            {/* Top Status Bar (Mockup from Figma) */}
            <div className="w-full h-[44px] px-[24px] flex justify-between items-center py-[14px] bg-transparent z-20 absolute top-0 left-0 right-0">
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

            {/* Background Gradient Circle */}
            <div
                className="absolute w-[426px] h-[388px] rounded-full left-1/2 -translate-x-1/2 top-[142px] z-0 animate-[fadeIn_1s_ease-out]"
                style={{
                    background: 'linear-gradient(178.26deg, rgba(18, 165, 229, 0.54) 5.18%, #FFFFFF 89.72%)',
                    opacity: 0.5
                }}
            ></div>

            {/* Logo and Brand Title */}
            <div className="w-full flex flex-col items-center mt-[200px] z-10 animate-[fadeIn_0.5s_ease-out_0.2s_both]">
                <img src={logoPerumdam} alt="Logo Perumdam Bantul" className="w-[180px] h-auto object-contain mb-[20px]" />

                <div className="font-bold text-[28px] flex items-center tracking-[-0.02em] whitespace-nowrap">
                    <span className="text-[#35C2FF]">PERUMDAM</span>
                    <span className="text-[#666666] font-medium ml-[2px]">BANTUL</span>
                </div>
                {/* Simulated Siap Prima font style since the exact font isn't specified, using a bold rounded sans-serif */}
                <div className="text-[#35C2FF] font-bold text-[36px] tracking-[-0.02em] leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Siap Prima
                </div>
            </div>

            {/* Features List */}
            <div className="w-full flex-1 flex flex-col items-center justify-center -mt-8 z-10 animate-[fadeIn_0.5s_ease-out_0.4s_both]">
                <div className="flex flex-col gap-[16px]">
                    <div className="flex items-center gap-[12px]">
                        <Target size={28} className="text-[#35C2FF]" strokeWidth={2.5} />
                        <span className="text-[#35C2FF] text-[22px] tracking-[-0.011em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Measurement
                        </span>
                    </div>
                    <div className="flex items-center gap-[12px]">
                        <Wrench size={28} className="text-[#35C2FF]" strokeWidth={2.5} />
                        <span className="text-[#35C2FF] text-[22px] tracking-[-0.011em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Maintenance
                        </span>
                    </div>
                    <div className="flex items-center gap-[12px]">
                        <MapPin size={28} className="text-[#35C2FF]" strokeWidth={2.5} />
                        <span className="text-[#35C2FF] text-[22px] tracking-[-0.011em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Mapping
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Splash;
