import React, { useMemo, useState } from 'react';
import { ChevronLeft, Search, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomNavigation from '../../components/layout/BottomNavigation';
import { getCustomers, getSurveyResults } from '../../api';

const HasilSurvey = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [notice] = useState(location.state?.notice || '');
  const [surveyResults, setSurveyResults] = useState([]);
  const [completedCustomers, setCompletedCustomers] = useState([]);

  React.useEffect(() => {
    let mounted = true;

    const loadResults = async () => {
      try {
        const data = await getSurveyResults();
        if (!mounted) {
          return;
        }

        setSurveyResults(Array.isArray(data) ? data : []);
      } catch {
        if (!mounted) {
          return;
        }

        setSurveyResults([]);
      }
    };

    loadResults();

    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    let mounted = true;

    const loadCompletedCustomers = async () => {
      try {
        const data = await getCustomers('', 1000, 'Selesai');
        if (!mounted) {
          return;
        }

        setCompletedCustomers(Array.isArray(data) ? data : []);
      } catch {
        if (!mounted) {
          return;
        }

        setCompletedCustomers([]);
      }
    };

    loadCompletedCustomers();

    return () => {
      mounted = false;
    };
  }, []);

  const dataPelangganSelesai = useMemo(() => {
    const selesaiIdSet = new Set(
      completedCustomers
        .map((item) => String(item?.id || '').trim())
        .filter(Boolean)
    );

    const selesaiNameSet = new Set(
      completedCustomers
        .map((item) => String(item?.name || '').trim().toLowerCase())
        .filter(Boolean)
    );

    return surveyResults
      .filter((item) => {
        const customerId = String(item?.customerId || '').trim();
        if (customerId && selesaiIdSet.has(customerId)) {
          return true;
        }

        const customerName = String(item?.vcNama || item?.title || '').trim().toLowerCase();
        return customerName ? selesaiNameSet.has(customerName) : false;
      })
      .sort((left, right) => {
        const rightCreatedAt = Number(new Date(right?.createdAt || 0));
        const leftCreatedAt = Number(new Date(left?.createdAt || 0));
        return rightCreatedAt - leftCreatedAt;
      })
      .map((item) => ({
      id: String(item?._id || ''),
      name: String(item?.vcNama || item?.title || 'Pelanggan'),
      alamat: String(item?.vcAlmt1 || item?.description || '-'),
      rab: String(item?.customerId || item?.selectedItem || item?._id || '-')
    }));
  }, [surveyResults, completedCustomers]);

  const filteredPelanggan = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      return dataPelangganSelesai;
    }

    return dataPelangganSelesai.filter((item) => (
      String(item.name || '').toLowerCase().includes(keyword) ||
      String(item.rab || '').toLowerCase().includes(keyword)
    ));
  }, [dataPelangganSelesai, search]);

  return (
    <div className="min-h-screen flex flex-col relative w-full h-full pb-[84px]">
      <div className="page-topbar">
        <button
          onClick={() => navigate(-1)}
          className="p-1 z-10 text-[#0f3553] hover:bg-white/80 rounded-full transition-colors active:scale-95"
          aria-label="Kembali"
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
          <h1 className="page-title mt-2 text-[24px]">Hasil Survey</h1>
          <p className="page-subtitle mt-2 mb-0">
            Lihat daftar hasil survey yang sudah selesai dan buka file PDF-nya.
          </p>
        </div>
      </div>

      <div className="px-[18px] mb-[14px]">
        {notice ? (
          <div className="mb-[10px] rounded-[14px] bg-[#D9F2DF] px-[14px] py-[10px] text-[12px] font-semibold text-[#13643f]">
            {notice}
          </div>
        ) : null}

        <div className="search-bar section-card h-[46px] rounded-[16px] flex items-center px-4 gap-3">
          <Search size={20} className="text-[#0a7db7] shrink-0" strokeWidth={2.25} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari Nama / No. RAB"
            className="w-full h-full bg-transparent outline-none text-[14px] text-[#173043] placeholder-[#7B93A8]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
        </div>
      </div>

      <div className="px-[18px] flex-1 overflow-auto pb-[8px]">
        <div className="flex items-center justify-between mb-[10px]">
          <p className="text-[#0f3553] font-bold text-[15px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Data Pelanggan
          </p>
          <span className="chip chip-success">Selesai</span>
        </div>

        <div className="flex flex-col gap-[12px]">
          {filteredPelanggan.map((item) => (
            <div key={item.id} className="section-card px-[16px] py-[14px]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-[#0f3553] leading-[150%] tracking-[-0.01em] truncate">
                    {item.name}
                  </p>
                  <p className="text-[12px] text-[#527085] leading-[150%] mt-1">
                    {item.alamat}
                  </p>
                </div>
                <span className="chip chip-success shrink-0">Selesai</span>
              </div>

              <div className="mt-3 pt-3 soft-divider" />

              <div className="flex items-center justify-between gap-3">
                <p className="text-[12px] text-[#527085]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  No. RAB : {item.rab}
                </p>
                <button
                  type="button"
                  onClick={() => navigate(`/hasil-survey/${encodeURIComponent(String(item.id))}/nota`)}
                  className="nav-pill text-[12px] text-[#0a7db7] font-bold"
                >
                  Lihat Hasil
                  <ChevronRight size={14} strokeWidth={2.2} />
                </button>
              </div>
            </div>
          ))}

          {filteredPelanggan.length === 0 && (
            <div className="section-card p-[16px] text-center">
              <p className="text-[12px] text-[#527085]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Belum ada pelanggan dengan status Selesai.
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default HasilSurvey;
