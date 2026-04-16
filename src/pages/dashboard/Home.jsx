import React from 'react';
import { UserPlus, CheckSquare, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../../components/layout/BottomNavigation';
import { getSurveyResults } from '../../api';
import { getSurveyorDisplayName } from '../../auth';
import logoPerumdam from '../../assets/logo_perumdam.png';

const formatCurrency = (value) => Number(value || 0).toLocaleString('id-ID');

const getSurveyTotalAmount = (item) => {
    const rows = Array.isArray(item?.items) ? item.items : [];

    const fromItems = rows.reduce((sum, row) => {
        const subtotal = Number(row?.subtotal || 0);
        if (subtotal > 0) {
            return sum + subtotal;
        }

        const price = Number(row?.price || 0);
        const qty = Number(row?.quantity ?? row?.qty ?? 1);
        return sum + (price * qty);
    }, 0);

    if (fromItems > 0) {
        return fromItems;
    }

    return Number(item?.total || 0);
};

const getHistorySurveyorName = (item) => {
    const explicitName = String(item?.surveyorName || '').trim();
    if (explicitName) {
        return explicitName;
    }

    const username = String(item?.surveyorUsername || '').trim().toLowerCase();
    const nameMap = {
        admin1: 'Nida',
        admin2: 'Fatih',
        admin3: 'Bintang'
    };

    return nameMap[username] || username || 'Surveyor';
};

const Home = () => {
    const navigate = useNavigate();
    const [historySurvey, setHistorySurvey] = React.useState([]);
    const [totalSurveyNotes, setTotalSurveyNotes] = React.useState(0);
    const surveyorName = React.useMemo(() => getSurveyorDisplayName(), []);

    React.useEffect(() => {
        let mounted = true;

        const loadHistory = async () => {
            try {
                const data = await getSurveyResults();
                if (!mounted) {
                    return;
                }

                const latestActivities = (Array.isArray(data) ? data : [])
                    .map((item) => ({
                        id: String(item?._id || ''),
                        name: String(item?.vcNama || item?.title || 'Pelanggan'),
                        rab: String(item?.customerId || item?.description || '-'),
                        surveyor: getHistorySurveyorName(item),
                        total: getSurveyTotalAmount(item),
                        createdAt: item?.createdAt ? new Date(item.createdAt).getTime() : 0,
                    }))
                    .sort((left, right) => right.createdAt - left.createdAt)
                    .slice(0, 5);

                setTotalSurveyNotes(Array.isArray(data) ? data.length : 0);
                setHistorySurvey(latestActivities);
            } catch {
                if (!mounted) {
                    return;
                }

                setTotalSurveyNotes(0);
                setHistorySurvey([]);
            }
        };

        loadHistory();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col relative w-full h-full pb-[84px]">
            <div className="page-topbar">
                <div>9:41</div>
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

            <div className="page-header">
                <div className="brand-row">
                    <img src={logoPerumdam} alt="Logo Perumdam Bantul" className="w-[36px] h-auto object-contain" />
                    <div>
                        <div className="font-bold text-[18px] flex items-center tracking-[-0.02em]">
                            <span className="text-[#0a7db7]">PERUMDAM</span>
                            <span className="text-[#6f8596] font-medium ml-1">BANTUL</span>
                        </div>
                        <p className="m-0 text-[12px] text-[#527085]">Mobile Surveyor Dashboard</p>
                    </div>
                </div>
            </div>

            <div className="px-[18px] mb-[18px] animate-[fadeIn_0.5s_ease-out]">
                <div className="hero-card px-[18px] py-[18px]">
                    <p className="m-0 text-[11px] uppercase tracking-[0.22em] text-[#0a7db7] font-bold">Selamat Datang</p>
                    <h1 className="text-[#0f3553] font-bold text-[23px] leading-[1.25] tracking-[-0.03em] mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Hai, selamat pagi {surveyorName}!
                    </h1>
                    <p className="page-subtitle mt-2 mb-0 max-w-[320px]">
                        Kelola data pelanggan, entri survey, dan hasil survei dalam satu tampilan yang lebih rapi.
                    </p>
                </div>
            </div>

            <div className="px-[18px] flex flex-col gap-[14px] mb-[18px]">
                <button
                    onClick={() => navigate('/list-surveyor')}
                    className="section-card relative w-full min-h-[96px] flex items-center px-[18px] py-[16px] transition-transform active:scale-[0.98] outline-none group animate-[fadeIn_0.5s_ease-out_0.1s_both]"
                >
                    <div className="brand-badge mr-[16px] shrink-0">
                        <UserPlus size={24} strokeWidth={2} />
                    </div>
                    <div className="flex flex-col items-start justify-center h-full pt-1">
                        <h2 className="text-[#0f3553] font-bold text-[20px] leading-[150%] tracking-[-0.02em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            ENTRI SURVEY
                        </h2>
                        <p className="text-[#527085] text-[13px] leading-[150%] tracking-[-0.01em] text-left -mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Catat kebutuhan material & RAB
                        </p>
                    </div>
                </button>

                <button
                    onClick={() => navigate('/hasil-survey')}
                    className="section-card relative w-full min-h-[96px] flex items-center px-[18px] py-[16px] transition-transform active:scale-[0.98] outline-none group animate-[fadeIn_0.5s_ease-out_0.2s_both]"
                >
                    <div className="brand-badge mr-[16px] shrink-0">
                        <CheckSquare size={22} strokeWidth={2} />
                    </div>
                    <div className="flex flex-col items-start justify-center h-full pt-1">
                        <h2 className="text-[#0f3553] font-bold text-[20px] leading-[150%] tracking-[-0.02em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            HASIL SURVEY
                        </h2>
                        <p className="text-[#527085] text-[13px] leading-[150%] tracking-[-0.01em] text-left -mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Lihat rekap hasil survey
                        </p>
                    </div>
                </button>
            </div>

            <div className="px-[18px] flex-1 pb-[10px] animate-[fadeIn_0.5s_ease-out_0.3s_both]">
                <div className="section-card overflow-hidden pb-3 min-h-[276px]">
                    <div className="pt-[16px] px-[18px] pb-[10px] flex items-center justify-between">
                        <div>
                            <p className="m-0 text-[11px] uppercase tracking-[0.18em] text-[#0a7db7] font-bold">Activity</p>
                            <h3 className="text-[#0f3553] font-bold text-[18px] leading-[150%] tracking-[-0.02em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                History Survey
                            </h3>
                        </div>
                        <div className="chip chip-muted">{totalSurveyNotes} Nota</div>
                    </div>

                    <div className="px-[18px] pb-1">
                        <div className="soft-divider" />
                    </div>

                    <div className="flex flex-col pt-1">
                        {historySurvey.map((item, index) => (
                            <div key={item.id} className="px-[18px]">
                                {index !== 0 && <div className="soft-divider my-1"></div>}
                                <div className="flex items-center py-[11px] gap-[14px]">
                                    <div className="w-[36px] h-[36px] rounded-full bg-[#E7F5FC] grid place-items-center shrink-0">
                                        <User size={18} className="text-[#0a7db7]" strokeWidth={2} />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <p className="text-[#0f3553] font-bold text-[14px] leading-[150%] tracking-[-0.01em] truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                                            {item.name}
                                        </p>
                                        <p className="text-[#527085] text-[13px] leading-[150%] tracking-[-0.01em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                            No. RAB {item.rab}
                                        </p>
                                        <p className="text-[#527085] text-[12px] leading-[140%] tracking-[-0.01em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                            Disurvey oleh Admin <span className="font-bold text-[#0f3553]">{item.surveyor}</span>
                                        </p>
                                        <p className="text-[#527085] text-[12px] leading-[140%] tracking-[-0.01em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                            Total: <span className="font-bold text-[#0f3553]">{formatCurrency(item.total)}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {historySurvey.length === 0 && (
                            <div className="px-[18px] pb-[14px] text-center">
                                <p className="text-[#527085] text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Belum ada aktivitas survey terbaru.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <BottomNavigation />
        </div>
    );
};

export default Home;
