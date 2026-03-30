import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Download, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNavigation from '../../components/layout/BottomNavigation';
import { getReceiptUrl, getSurveyResults } from '../../api';
import { getPelangganById } from './surveyData';
import { getSurveyResultIdByCustomerId } from './surveyStorage';

const PreviewNotaSurvey = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const pelanggan = getPelangganById(id);

  const [surveyResultId, setSurveyResultId] = useState(getSurveyResultIdByCustomerId(id));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const findSurveyResultId = async () => {
      if (surveyResultId) {
        return;
      }

      try {
        setLoading(true);
        setError('');

        const results = await getSurveyResults();
        const list = Array.isArray(results) ? results : [];
        const byTitle = list.find((item) => {
          const title = String(item?.title || '').toLowerCase();
          const name = String(pelanggan?.name || '').toLowerCase();
          return name && title.includes(name);
        });

        const fallbackLatest = list.length > 0 ? list[list.length - 1] : null;
        const found = byTitle || fallbackLatest;

        if (found?._id) {
          setSurveyResultId(String(found._id));
        } else {
          setError('Data hasil survey tidak ditemukan untuk pelanggan ini.');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Gagal mengambil data hasil survey';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    findSurveyResultId();
  }, [surveyResultId, pelanggan]);

  const pdfUrl = useMemo(() => {
    if (!surveyResultId) {
      return '';
    }

    return getReceiptUrl(surveyResultId);
  }, [surveyResultId]);

  return (
    <div className="min-h-screen bg-[#F8FBFF] flex flex-col relative w-full h-full pb-[80px]">
      <div className="flex items-center px-[18px] pt-[15px] pb-[16px] relative">
        <button
          onClick={() => navigate(-1)}
          className="p-1 z-10 text-[#1E1E1E] hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          aria-label="Kembali"
        >
          <ChevronLeft size={28} strokeWidth={3} />
        </button>
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none pt-[15px] pb-[16px]">
          <h1 className="text-[#000000] font-bold text-[20px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Hasil Survey
          </h1>
        </div>
      </div>

      <div className="px-[10px] flex-1 flex flex-col gap-[8px]">
        <div className="rounded-[8px] border border-[#3B91C0] bg-white p-[8px] text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>
          <p className="font-bold">{pelanggan?.name || 'Pelanggan'}</p>
          <p>No. RAB : {pelanggan?.rab || id || '-'}</p>
          <p>Alamat : {pelanggan?.alamat || '-'}</p>
          <p>Telp. : 0821xxxxxxxx</p>
        </div>

        <div className="rounded-[8px] border border-[#3B91C0] bg-[#53BDE8] p-[4px] h-[390px] flex items-center justify-center overflow-hidden">
          {loading && (
            <p className="text-[12px] font-semibold text-[#003654]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Memuat preview PDF...
            </p>
          )}

          {!loading && error && (
            <p className="text-[12px] font-semibold text-[#8b0000] text-center px-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              {error}
            </p>
          )}

          {!loading && !error && pdfUrl && (
            <iframe
              title="Preview PDF Nota Survey"
              src={pdfUrl}
              className="w-full h-full bg-white rounded-[4px]"
            />
          )}

          {!loading && !error && !pdfUrl && (
            <div className="text-center text-[#003654]">
              <FileText size={28} className="mx-auto mb-2" />
              <p className="text-[12px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                Preview PDF belum tersedia
              </p>
            </div>
          )}
        </div>

        <a
          href={pdfUrl || '#'}
          download={pdfUrl ? `nota-survey-${id}.pdf` : undefined}
          target="_blank"
          rel="noopener noreferrer"
          className={`h-[36px] rounded-[8px] flex items-center justify-center gap-2 font-bold text-[14px] ${pdfUrl ? 'bg-[#75C8EA] text-[#003654]' : 'bg-gray-300 text-gray-600 pointer-events-none'}`}
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <Download size={16} />
          Download PDF
        </a>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PreviewNotaSurvey;
