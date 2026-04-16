import React from 'react';
import { ChevronLeft, Search, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomNavigation from '../../components/layout/BottomNavigation';
import { getCustomers } from '../../api';
import { DEFAULT_PELANGGAN } from './surveyData';

const EntriSurvey = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const selectedStatus = String(location.state?.filterStatus || '');
    const [search, setSearch] = React.useState('');
    const [customers, setCustomers] = React.useState([]);

    React.useEffect(() => {
        let mounted = true;

        const loadCustomers = async () => {
            try {
                const data = await getCustomers('', 500);
                if (!mounted) {
                    return;
                }

                setCustomers(Array.isArray(data) ? data : []);
            } catch {
                if (!mounted) {
                    return;
                }

                setCustomers([]);
            }
        };

        loadCustomers();

        return () => {
            mounted = false;
        };
    }, []);

    const sourceCustomers = customers.length > 0 ? customers : DEFAULT_PELANGGAN;
    const dataPelanggan = sourceCustomers;

    const filteredPelanggan = dataPelanggan.filter((item) => {
        const byStatus = selectedStatus ? item.status === selectedStatus : true;
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
            return byStatus;
        }

        const byKeyword =
            item.name.toLowerCase().includes(keyword) ||
            String(item.rab).toLowerCase().includes(keyword);

        return byStatus && byKeyword;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Belum disurvei':
                return { bg: '#CADBE3', color: '#0f3553' };
            case 'Draft':
                return { bg: '#F8E7B6', color: '#855A00' };
            case 'Selesai':
                return { bg: '#BBE1AE', color: '#1F5C36' };
            default:
                return { bg: '#E5E7EB', color: '#334155' };
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative w-full h-full pb-[84px]">
            <div className="page-topbar">
                <button
                    onClick={() => navigate(-1)}
                    className="p-1 z-10 text-[#0f3553] hover:bg-white/80 rounded-full transition-colors active:scale-95"
                >
                    <ChevronLeft size={28} strokeWidth={3} />
                </button>
                <div className="font-semibold">9:41</div>
                <div className="status-icons">
                    <div className="w-[17px] h-[10.5px] flex items-end justify-between">
                        <div className="w-[3px] h-[4px] bg-[#0f3553] rounded-[1px]"></div>
                        <div className="w-[3px] h-[6px] bg-[#0f3553] rounded-[1px]"></div>
                        <div className="w-[3px] h-[8px] bg-[#0f3553] rounded-[1px]"></div>
                        <div className="w-[3px] h-[10.5px] bg-[#0f3553] rounded-[1px]"></div>
                    </div>
                    <div className="w-[16px] h-[11px] rounded-full border border-[#0f3553] opacity-80"></div>
                    <div className="relative w-[25px] h-[11.5px]">
                        <div className="absolute inset-0 border border-[#0f3553] opacity-35 rounded-[3px]"></div>
                        <div className="absolute left-[2px] top-[2px] bottom-[2px] w-[18px] bg-[#0f3553] rounded-[1.5px]"></div>
                        <div className="absolute right-[-1.5px] top-[4px] bottom-[4px] w-[1px] bg-[#0f3553] opacity-40 rounded-r-sm"></div>
                    </div>
                </div>
            </div>

            <div className="page-header pt-2 pb-4">
                <div className="hero-card px-[18px] py-[16px]">
                    <p className="m-0 text-[11px] uppercase tracking-[0.2em] text-[#0a7db7] font-bold">Survey</p>
                    <h1 className="page-title mt-2 text-[24px]">Entri Survey</h1>
                    <p className="page-subtitle mt-2 mb-0">
                        Pilih pelanggan yang akan diinput kebutuhan survey-nya.
                    </p>
                </div>
            </div>

            <div className="px-[18px] mb-[16px]">
                <div className="search-bar section-card h-[46px] rounded-[16px] flex items-center px-4 gap-3">
                    <Search size={20} className="text-[#0a7db7] shrink-0" strokeWidth={2.25} />
                    <input
                        type="text"
                        placeholder="Cari Nama / No. RAB"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="w-full h-full outline-none bg-transparent text-[#173043] text-[14px] placeholder-[#7B93A8]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                </div>
            </div>

            <div className="px-[18px] flex-1 flex flex-col gap-[12px]">
                <div className="flex items-center justify-between">
                    <h2 className="text-[#0f3553] font-bold text-[16px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Data Pelanggan {selectedStatus ? `- ${selectedStatus}` : ''}
                    </h2>
                    <span className="chip chip-muted">{filteredPelanggan.length} Data</span>
                </div>

                <div className="flex flex-col gap-[12px] pb-2">
                    {filteredPelanggan.map((item, index) => {
                        const statusStyle = getStatusStyle(item.status);
                        return (
                            <div
                                key={item.id}
                                className="section-card px-[16px] py-[14px] transition-transform active:scale-[0.99] cursor-pointer animate-[fadeIn_0.45s_ease-out_both]"
                                style={{ animationDelay: `${0.12 + (index * 0.06)}s` }}
                                onClick={() => navigate(`/survey/${encodeURIComponent(String(item.id))}`)}
                            >
                                <div className="flex justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-[#0f3553] font-bold text-[15px] leading-[150%] tracking-[-0.01em] truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                                                {item.name}
                                            </h3>
                                        </div>
                                        <p className="text-[#527085] text-[13px] leading-[150%] tracking-[-0.01em] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                                            {item.alamat}
                                        </p>
                                    </div>
                                    <ChevronRight size={22} className="text-[#0a7db7] shrink-0 mt-0.5" strokeWidth={2} />
                                </div>

                                <div className="mt-3 pt-3 soft-divider"></div>

                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-[#527085] text-[12px] leading-[150%] tracking-[-0.01em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                        No. RAB : {item.rab}
                                    </p>
                                    <div
                                        className="chip text-[11px]"
                                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                                    >
                                        {item.status}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {filteredPelanggan.length === 0 && (
                        <div className="section-card px-[18px] py-[18px] text-center">
                            <p className="text-[#527085] text-[13px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Data pelanggan tidak ditemukan.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <BottomNavigation />
        </div>
    );
};

export default EntriSurvey;
