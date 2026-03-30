import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Search, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomNavigation from '../../components/layout/BottomNavigation';
import { DEFAULT_PELANGGAN } from './surveyData';
import { getStoredStatusByCustomerId } from './surveyStorage';

const HasilSurvey = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState(location.state?.notice || '');

  useEffect(() => {
    if (!location.state?.notice) {
      return;
    }

    setNotice(location.state.notice);

    const timerId = window.setTimeout(() => {
      setNotice('');
      navigate(location.pathname, { replace: true, state: {} });
    }, 2200);

    return () => window.clearTimeout(timerId);
  }, [location.pathname, location.state, navigate]);

  const dataPelangganSelesai = useMemo(() => {
    return DEFAULT_PELANGGAN
      .map((item) => {
        const status = getStoredStatusByCustomerId(item.id) || item.status;
        return {
          ...item,
          status,
        };
      })
      .filter((item) => item.status === 'Selesai');
  }, []);

  const filteredPelanggan = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      return dataPelangganSelesai;
    }

    return dataPelangganSelesai.filter((item) => {
      return (
        String(item.name || '').toLowerCase().includes(keyword) ||
        String(item.rab || '').toLowerCase().includes(keyword)
      );
    });
  }, [dataPelangganSelesai, search]);

  return (
    <div className="min-h-screen bg-[#F8FBFF] flex flex-col relative w-full h-full pb-[80px]">
      <div className="flex items-center px-[22px] pt-[15px] pb-[22px] relative">
        <button
          onClick={() => navigate(-1)}
          className="p-1 z-10 text-[#1E1E1E] hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          aria-label="Kembali"
        >
          <ChevronLeft size={28} strokeWidth={3} />
        </button>
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none pt-[15px] pb-[22px]">
          <h1 className="text-[#000000] font-bold text-[20px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Hasil Survey
          </h1>
        </div>
      </div>

      <div className="px-[10px] mb-[10px]">
        {notice && (
          <div className="mb-[8px] rounded-[8px] bg-[#BBE1AE] px-[10px] py-[8px] text-[11px] font-semibold text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {notice}
          </div>
        )}

        <div className="relative h-[30px] border border-[#015E9C] rounded-[8px] bg-white flex items-center px-[10px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari Nama / No. RAB"
            className="w-full h-full bg-transparent outline-none text-[11px] text-[#1E1E1E]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
          <Search size={14} className="text-[#1E1E1E]" strokeWidth={2} />
        </div>
      </div>

      <div className="px-[10px] flex-1 overflow-auto pb-[8px]">
        <p className="text-[#000000] text-[11px] mb-[6px]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Data Pelanggan
        </p>

        <div className="flex flex-col gap-[8px]">
          {filteredPelanggan.map((item) => (
            <div
              key={item.id}
              className="rounded-[8px] border border-[#1E1E1E]/25 bg-white px-[8px] py-[6px]"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[12px] font-bold text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {item.name}
                </p>
                <span
                  className="h-[16px] min-w-[56px] px-2 rounded-[8px] text-[10px] flex items-center justify-center font-semibold"
                  style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#BBE1AE', color: '#000' }}
                >
                  Selesai
                </span>
              </div>

              <p className="text-[11px] text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {item.alamat}
              </p>

              <div className="mt-[2px] flex items-center justify-between">
                <p className="text-[11px] text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  No. RAB : {item.rab}
                </p>
                <button
                  type="button"
                  onClick={() => navigate(`/hasil-survey/${item.id}/nota`)}
                  className="text-[10px] text-[#1E1E1E] flex items-center gap-1"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Lihat Hasil
                  <ChevronRight size={12} strokeWidth={2.2} />
                </button>
              </div>
            </div>
          ))}

          {filteredPelanggan.length === 0 && (
            <div className="rounded-[8px] border border-[#1E1E1E]/20 bg-white p-[12px] text-center">
              <p className="text-[12px] text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>
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
