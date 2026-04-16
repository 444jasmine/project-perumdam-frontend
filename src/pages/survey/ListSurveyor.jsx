import React, { useMemo } from 'react';
import { UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../../components/layout/BottomNavigation';
import { getCustomers } from '../../api';
import { DEFAULT_PELANGGAN } from './surveyData';

const normalizeStatus = (status) => {
    const value = String(status || '').trim().toLowerCase();

    if (value === 'draft' || value === 'b') {
        return 'Draft';
    }

    if (value === 'selesai' || value === 'c') {
        return 'Selesai';
    }

    return 'Belum disurvei';
};

const ListSurveyor = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = React.useState([]);

    React.useEffect(() => {
        let mounted = true;

        const loadCustomers = async () => {
            try {
                const data = await getCustomers('', 1000);
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

    const dataPelanggan = useMemo(() => {
        const sourceCustomers = customers.length > 0 ? customers : DEFAULT_PELANGGAN;

        return sourceCustomers.map((item) => ({
            ...item,
            status: normalizeStatus(item.status || item.cStati),
        }));
    }, [customers]);

    const statusCards = useMemo(() => {
        const countByStatus = dataPelanggan.reduce(
            (acc, item) => {
                acc[item.status] = (acc[item.status] || 0) + 1;
                return acc;
            },
            {}
        );

        return [
            {
                id: 'belum',
                title: 'BELUM DISURVEY',
                filterStatus: 'Belum disurvei',
                total: countByStatus['Belum disurvei'] || 0,
                bg: '#CADBE3',
            },
            {
                id: 'draft',
                title: 'DRAFT',
                filterStatus: 'Draft',
                total: countByStatus.Draft || 0,
                bg: '#F2D995',
            },
            {
                id: 'selesai',
                title: 'SELESAI',
                filterStatus: 'Selesai',
                total: countByStatus.Selesai || 0,
                bg: '#BBE1AE',
            },
        ];
    }, [dataPelanggan]);

    return (
        <div className="min-h-screen bg-[#F8FBFF] flex flex-col relative w-full h-full pb-[88px]">
            <div className="flex items-center justify-center px-[18px] pt-[18px] pb-[14px]">
                <h1 className="text-[#000000] font-bold text-[20px] leading-[150%]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Surveyor
                </h1>
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
                        <p className="text-[#1E1E1E] text-[11px] leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Jumlah pelanggan : {dataPelanggan.length}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {statusCards.map((card) => (
                        <button
                            key={card.id}
                            type="button"
                            className="w-full rounded-[12px] border border-[#4A90C2] px-3 py-2 text-left"
                            style={{ backgroundColor: card.bg }}
                            onClick={() => navigate('/entri-survey', { state: { filterStatus: card.filterStatus } })}
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
                    onClick={() => navigate('/entri-survey', { state: { filterStatus: '' } })}
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
