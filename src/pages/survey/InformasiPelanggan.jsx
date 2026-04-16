import React, { useMemo, useState } from 'react';
import { ChevronLeft, PlusSquare } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNavigation from '../../components/layout/BottomNavigation';
import { getCustomerById, updateCustomerStatus } from '../../api';
import { getPelangganById } from './surveyData';

const InformasiPelanggan = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const normalizedCustomerId = decodeURIComponent(String(id || '')).trim();
    const [apiCustomer, setApiCustomer] = useState(null);

    React.useEffect(() => {
        let mounted = true;

        const loadCustomer = async () => {
            if (!normalizedCustomerId) {
                return;
            }

            try {
                const customer = await getCustomerById(normalizedCustomerId);
                if (mounted) {
                    setApiCustomer(customer);
                }
            } catch {
                if (mounted) {
                    setApiCustomer(null);
                }
            }
        };

        loadCustomer();

        return () => {
            mounted = false;
        };
    }, [normalizedCustomerId]);

    // Mock data based on ID - in a real app, you'd fetch this using the ID
    const customer = apiCustomer || getPelangganById(normalizedCustomerId) || {
        id: normalizedCustomerId,
        name: 'Pelanggan',
        rab: '-',
        alamat: 'Alamat Pelanggan',
        telepon: '-',
        status: 'Belum disurvei'
    };

    const initialStatus = customer.status || 'Belum disurvei';

    const normalizedStatusLabel = useMemo(() => {
        return initialStatus === 'Belum Survey' ? 'Belum disurvei' : initialStatus;
    }, [initialStatus]);

    const formattedTelepon = useMemo(() => {
        const rawTelepon = String(customer?.telepon || customer?.cTelp || customer?.chp || '').trim();
        return rawTelepon || '-';
    }, [customer]);

    const isDraft = normalizedStatusLabel === 'Draft';
    const buttonText = isDraft ? 'Lanjutkan Survey' : 'Mulai Survei';

    const handleContinue = async () => {
        const nextStatus = normalizedStatusLabel === 'Belum disurvei' ? 'Draft' : normalizedStatusLabel;
        try {
            await updateCustomerStatus(normalizedCustomerId, nextStatus);
        } catch {
            // Continue navigation to avoid blocking workflow when network is unstable.
        }
        navigate(`/survey/${encodeURIComponent(normalizedCustomerId)}/mulai`);
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
                        Data Pelanggan
                    </h1>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center w-full px-[38px] animate-[fadeIn_0.5s_ease-out_0.1s_both]">

                {/* Profile Section */}
                <div className="flex items-center justify-start w-full gap-[20px] pl-[14px] mb-[25px]">
                    {/* Custom Avatar matching Figma shapes */}
                    <div className="relative w-[100px] h-[103px] rounded-full bg-[#35C2FF] flex items-center justify-center overflow-hidden shrink-0">
                        <div className="absolute w-[36px] h-[27px] rounded-full bg-[#015E9C] top-[20px]"></div>
                        <div className="absolute w-[64px] h-[35px] rounded-t-full bg-[#015E9C] bottom-[15px]"></div>
                    </div>

                    <div className="flex flex-col items-start pt-[5px]">
                        <h2 className="text-[#000000] font-bold text-[16px] leading-[150%] tracking-[-0.011em] text-left mb-[6px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {customer.name}
                        </h2>
                        <div className="w-[133px] h-[21px] bg-[#CADBE3] rounded-[20px] flex items-center justify-center">
                            <span className="text-[#000000] font-bold text-[12px] leading-[150%] tracking-[-0.011em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                {normalizedStatusLabel}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-[318px] border-b-[3px] border-[#015E9C] mb-[20px]"></div>

                <div className="w-full flex flex-col gap-[12px] mb-[45px]">
                    <DataField label="No. RAB" value={customer?.rab || '-'} />
                    <DataField label="Alamat Rumah" value={customer?.alamat || '-'} />
                    <DataField label="Nomor Telepon" value={formattedTelepon} />
                </div>

                {/* Primary Action Button */}
                <button
                    type="button"
                    onClick={handleContinue}
                    className="relative w-[318px] h-[43px] rounded-[10px] flex items-center justify-center transition-transform active:scale-[0.98] outline-none gap-2 animate-[fadeIn_0.5s_ease-out_0.2s_both]"
                    style={{
                        background: 'rgba(53, 194, 255, 0.75)',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    }}
                >
                    <PlusSquare size={20} className="text-[#1E1E1E]" strokeWidth={2} />
                    <span className="text-[#000000] font-bold text-[16px] leading-[150%] tracking-[-0.011em]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {buttonText}
                    </span>
                </button>
            </div>

            <BottomNavigation />
        </div>
    );
};

const DataField = ({ label, value }) => (
    <div className="flex flex-col gap-[4px] w-[306px]">
        <p className="text-[#000000] text-[16px] leading-[150%] tracking-[-0.011em] m-0" style={{ fontFamily: 'Inter, sans-serif' }}>
            {label}
        </p>
        <div className="min-h-[34px] border border-[#015E9C] bg-[#F3FAFF] px-[10px] py-[6px] flex items-center">
            <p className="text-[14px] text-[#000000] leading-[150%] tracking-[-0.011em] break-words m-0" style={{ fontFamily: 'Inter, sans-serif' }}>
                {value || '-'}
            </p>
        </div>
    </div>
);

export default InformasiPelanggan;
