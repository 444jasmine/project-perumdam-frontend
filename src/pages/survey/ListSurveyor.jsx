import React from 'react';
import { ChevronLeft, Search, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../../components/layout/BottomNavigation';

const ListSurveyor = () => {
    const navigate = useNavigate();

    const statusCards = [
        { id: 'belum', title: 'BELUM DISURVEY', total: 3, bg: '#CADBE3' },
        { id: 'draft', title: 'DRAFT', total: 2, bg: '#F2D995' },
        { id: 'selesai', title: 'SELESAI', total: 7, bg: '#BBE1AE' },
    ];

    return (
        <div className="min-h-screen bg-[#F8FBFF] flex flex-col relative w-full h-full pb-[88px]">
            <div className="flex items-center px-[18px] pt-[18px] pb-[14px] relative">
                <button
                    onClick={() => navigate(-1)}
                    className="p-1 z-10 text-[#1E1E1E] hover:bg-gray-100 rounded-full transition-colors active:scale-95"
                    aria-label="Kembali"
                >
                    <ChevronLeft size={24} strokeWidth={2.5} />
                </button>
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                    <h1 className="text-[#000000] font-bold text-[20px] leading-[150%]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Surveyor
                    </h1>
                </div>
            </div>

            <div className="px-[14px] flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-[62px] h-[62px] rounded-full bg-[#35C2FF] flex items-center justify-center">
                        <UserRound size={32} className="text-[#015E9C]" strokeWidth={2.2} />
                    </div>
                    <div>
                        <h2 className="text-[#1E1E1E] font-bold text-[13px] uppercase leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                            OKTARINA NIDA SIDEBANG
                        </h2>
                        <p className="text-[#1E1E1E] text-[11px] leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>SURVEYOR 1</p>
                        <p className="text-[#1E1E1E] text-[11px] leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>Jumlah pelanggan :</p>
                    </div>
                </div>

                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full h-[34px] border border-[#015E9C] rounded-[16px] bg-white pl-3 pr-9 text-[12px] text-[#1E1E1E] outline-none"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                    <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]" strokeWidth={2} />
                </div>

                <div className="flex flex-col gap-3">
                    {statusCards.map((card) => (
                        <button
                            key={card.id}
                            type="button"
                            className="w-full rounded-[12px] border border-[#4A90C2] px-3 py-2 text-left"
                            style={{ backgroundColor: card.bg }}
                            onClick={() => navigate('/entri-survey')}
                        >
                            <p className="text-[#1E1E1E] font-extrabold text-[13px] leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                                {card.title}
                            </p>
                            <div className="mt-1 flex items-center justify-between">
                                <p className="text-[#1E1E1E] text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Total : {card.total} Pelanggan
                                </p>
                                <span className="text-[#1E1E1E] text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Lihat Pelanggan &gt;
                                </span>
                            </div>
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => navigate('/entri-survey')}
                    className="mt-8 w-full h-[34px] rounded-[6px] font-bold text-[13px] text-[#003654]"
                    style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#53BDE8' }}
                >
                    Lihat Data Pelanggan
                </button>
            </div>

            <BottomNavigation />
        </div>
    );
};

export default ListSurveyor;
