import React from 'react';
import { ChevronLeft, Search, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../../components/layout/BottomNavigation';
import { DEFAULT_PELANGGAN } from './surveyData';
import { getStoredStatusByCustomerId } from './surveyStorage';

const EntriSurvey = () => {
    const navigate = useNavigate();

    const dataPelanggan = DEFAULT_PELANGGAN.map((item) => ({
        ...item,
        status: getStoredStatusByCustomerId(item.id) || item.status,
    }));

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Belum disurvei':
                return { bg: '#CADBE3', color: '#000000' };
            case 'Draft':
                return { bg: '#F2D995', color: '#000000' };
            case 'Selesai':
                return { bg: '#BBE1AE', color: '#000000' };
            default:
                return { bg: '#E5E7EB', color: '#000000' };
        }
    };

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

            {/* Header: Back Button & Title */}
            <div className="flex items-center px-[22px] pt-[15px] pb-[25px] relative animate-[fadeIn_0.5s_ease-out]">
                <button
                    onClick={() => navigate(-1)}
                    className="p-1 z-10 text-[#1E1E1E] hover:bg-gray-100 rounded-full transition-colors active:scale-95"
                >
                    <ChevronLeft size={30} strokeWidth={3} />
                </button>
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none pt-[15px] pb-[25px]">
                    <h1 className="text-[#000000] font-bold text-[20px] leading-[150%] tracking-[-0.011em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Entri Survey
                    </h1>
                </div>
            </div>

            {/* Search Input */}
            <div className="px-[19px] mb-[30px] animate-[fadeIn_0.5s_ease-out_0.1s_both]">
                <div className="relative w-full h-[45px] border border-[#015E9C] rounded-[20px] bg-white overflow-hidden flex items-center px-4 transition-colors focus-within:ring-2 focus-within:ring-[#068ec9]/20 focus-within:border-[#068EC9]">
                    <input
                        type="text"
                        placeholder="Cari Nama / No. RAB"
                        className="w-full h-full outline-none bg-transparent text-[#000000] text-[16px] leading-[150%] tracking-[-0.011em] placeholder-[#8B8A8A]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                    <Search size={24} className="text-[#1E1E1E] ml-2 shrink-0" strokeWidth={2} />
                </div>
            </div>

            {/* Data Pelanggan List */}
            <div className="px-[16px] flex-1 flex flex-col gap-[14px]">
                <h2 className="text-[#000000] text-[16px] leading-[150%] tracking-[-0.011em] ml-2 mb-1 animate-[fadeIn_0.5s_ease-out_0.2s_both]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Data Pelanggan
                </h2>

                <div className="flex flex-col gap-[15px] pb-4">
                    {dataPelanggan.map((item, index) => {
                        const statusStyle = getStatusStyle(item.status);
                        return (
                            <div
                                key={item.id}
                                className="w-[354px] mx-auto bg-white border h-[104px] border-[#015E9C] rounded-[20px] px-[20px] pt-[15px] pb-[10px] animate-[fadeIn_0.5s_ease-out_both] active:scale-[0.98] transition-transform cursor-pointer overflow-hidden flex flex-col justify-between"
                                style={{ animationDelay: `${0.3 + (index * 0.1)}s` }}
                                onClick={() => navigate(`/survey/${item.id}`)}
                            >
                                <div className="flex justify-between items-start w-full">
                                    <div className="flex flex-col w-full">
                                        <div className="flex justify-between items-center h-[24px]">
                                            <h3 className="text-[#000000] font-bold text-[16px] leading-[150%] tracking-[-0.011em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                {item.name}
                                            </h3>
                                            <ChevronRight size={24} className="text-[#1E1E1E]" strokeWidth={1.5} />
                                        </div>

                                        <p className="text-[#000000] text-[16px] leading-[150%] tracking-[-0.011em] mt-[2px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                            {item.alamat}
                                        </p>
                                    </div>
                                </div>

                                <div className="w-full relative h-[30px] flex items-end justify-between px-1">
                                    <div className="absolute top-0 left-[-4px] right-[-4px] h-[1px] bg-[#8B8A8A] opacity-60"></div>
                                    <p className="text-[#000000] text-[15px] leading-[150%] tracking-[-0.011em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                        No. RAB : {item.rab}
                                    </p>
                                    <div
                                        className="h-[19px] w-[118px] flex items-center justify-center rounded-[5px] mb-1"
                                        style={{ backgroundColor: statusStyle.bg }}
                                    >
                                        <span
                                            className="text-[14px] leading-[150%] tracking-[-0.011em]"
                                            style={{ fontFamily: 'Inter, sans-serif', color: statusStyle.color }}
                                        >
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <BottomNavigation />
        </div>
    );
};

export default EntriSurvey;
