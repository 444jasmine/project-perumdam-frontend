import React from 'react';
import { UserPlus, User, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../../components/layout/BottomNavigation';
import logoPerumdam from '../../assets/logo_perumdam.png';

const Home = () => {
    const navigate = useNavigate();

    const historySurvey = [
        { id: 1, name: 'Rizky Prasetya', rab: '123456789' },
        { id: 2, name: 'Muhammad Al Kahfi', rab: '123456789' },
        { id: 3, name: 'Bintang Berlian Pratama', rab: '123456789' },
        { id: 4, name: 'Rizky Wildansani', rab: '123456789' },
    ];

    return (
        <div className="min-h-screen bg-[#F8FBFF] flex flex-col relative w-full h-full pb-[80px]">
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

            {/* Header / Brand Logo */}
            <div className="flex items-center px-[24px] pt-[20px] pb-[40px]">
                <div className="flex items-center gap-[8px]">
                    <img src={logoPerumdam} alt="Logo Perumdam Bantul" className="w-[36px] h-auto object-contain" />
                    <div className="font-bold text-[18px] flex items-center tracking-[-0.02em] ml-1">
                        <span className="text-[#35C2FF]">PERUMDAM</span>
                        <span className="text-[#8B8B8B] font-medium ml-1">BANTUL</span>
                    </div>
                </div>
            </div>

            {/* Welcome Text */}
            <div className="px-[24px] mb-[45px] animate-[fadeIn_0.5s_ease-out]">
                <h1 className="text-[#1F2937] font-bold text-[20px] leading-[150%] tracking-[-0.011em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Hai, Selamat Pagi Nida!
                </h1>
                <p className="text-[#1F2937] text-[16px] leading-[150%] tracking-[-0.011em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Selamat Datang di Aplikasi Mobile Surveyor
                </p>
            </div>

            {/* Main Action Buttons */}
            <div className="px-[18px] flex flex-col gap-[20px] mb-[45px]">
                {/* Entri Survey Button */}
                <button
                    onClick={() => navigate('/entri-survey')}
                    className="relative w-full h-[91px] rounded-[10px] flex items-center px-[22px] transition-transform active:scale-[0.98] outline-none group animate-[fadeIn_0.5s_ease-out_0.1s_both]"
                    style={{
                        background: 'linear-gradient(180deg, rgba(53, 194, 255, 0.75) 0%, rgba(202, 219, 227, 0.75) 100%)',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    }}
                >
                    <div className="mr-[22px]">
                        <UserPlus size={44} className="text-[#1E1E1E]" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col items-start justify-center h-full pt-1">
                        <h2 className="text-[#000000] font-bold text-[24px] leading-[150%] tracking-[-0.011em]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            ENTRI SURVEY
                        </h2>
                        <p className="text-[#000000] text-[14px] leading-[150%] tracking-[-0.011em] text-left -mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Catat kebutuhan material & RAB
                        </p>
                    </div>
                </button>

                {/* Hasil Survey Button */}
                <button
                    onClick={() => navigate('/hasil-survey')}
                    className="relative w-full h-[91px] rounded-[10px] flex items-center px-[22px] transition-transform active:scale-[0.98] outline-none group animate-[fadeIn_0.5s_ease-out_0.2s_both]"
                    style={{
                        background: 'linear-gradient(180deg, rgba(53, 194, 255, 0.75) 0%, rgba(202, 219, 227, 0.75) 100%)',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    }}
                >
                    <div className="mr-[22px]">
                        <CheckSquare size={38} className="text-[#1E1E1E]" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col items-start justify-center h-full pt-1">
                        <h2 className="text-[#000000] font-bold text-[24px] leading-[150%] tracking-[-0.011em]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            HASIL SURVEY
                        </h2>
                        <p className="text-[#000000] text-[14px] leading-[150%] tracking-[-0.011em] text-left -mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Lihat rekap hasil survey
                        </p>
                    </div>
                </button>
            </div>

            {/* History Survey Section */}
            <div className="px-[18px] flex-1 pb-[10px] animate-[fadeIn_0.5s_ease-out_0.3s_both]">
                <div className="w-full border-2 border-[#015E9C] rounded-[20px] bg-white overflow-hidden pb-4 min-h-[276px]">
                    <div className="pt-[14px] px-[22px] pb-[8px]">
                        <h3 className="text-[#015E9C] font-bold text-[20px] leading-[150%] tracking-[-0.011em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                            History Survey
                        </h3>
                    </div>

                    <div className="flex flex-col relative w-full pt-2">
                        {historySurvey.map((item, index) => (
                            <div key={item.id} className="relative w-[318px] mx-auto">
                                {/* Divider Line */}
                                {index !== 0 && (
                                    <div className="w-full h-[1px] bg-[#8B8A8A] absolute top-0 left-0 right-0"></div>
                                )}

                                <div className="flex items-center py-[10px] pl-[15px] pr-[15px]">
                                    <div className="w-[32px] h-[35px] relative mr-[24px]">
                                        <div className="absolute inset-0 border-2 border-[#1E1E1E] rounded-full scale-75 top-[-4px]"></div>
                                        <div className="absolute w-[24px] h-[12px] border-2 border-[#1E1E1E] border-b-0 rounded-t-full bottom-[2px] left-[4px]"></div>
                                    </div>
                                    <div className="flex flex-col pt-1">
                                        <p className="text-[#000000] font-bold text-[15px] leading-[150%] tracking-[-0.011em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                            {item.name}
                                        </p>
                                        <p className="text-[#000000] text-[15px] leading-[150%] tracking-[-0.011em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                            No. RAB {item.rab}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <BottomNavigation />
        </div>
    );
};

export default Home;
