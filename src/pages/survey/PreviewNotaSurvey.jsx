import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Download, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNavigation from '../../components/layout/BottomNavigation';
import { getReceiptPdfBlob, getSurveyResultById } from '../../api';
import { getPelangganById } from './surveyData';

const PreviewNotaSurvey = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const surveyResultId = decodeURIComponent(String(id || '')).trim();
  const [surveyDetail, setSurveyDetail] = useState(null);
  const pelanggan = surveyDetail
    ? {
        name: surveyDetail?.vcNama || surveyDetail?.title || 'Pelanggan',
        rab: surveyDetail?.customerId || surveyDetail?._id || '-',
        alamat: surveyDetail?.vcAlmt1 || surveyDetail?.description || '-'
      }
    : getPelangganById(surveyResultId);

  const [pdfBlobUrl, setPdfBlobUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSurveyDetail = async () => {
      if (!surveyResultId) {
        setError('ID hasil survey tidak valid.');
        return;
      }

      try {
        setLoading(true);
        setError('');
        const detail = await getSurveyResultById(surveyResultId);
        setSurveyDetail(detail || null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Gagal mengambil data hasil survey';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadSurveyDetail();
  }, [surveyResultId]);

  useEffect(() => {
    let mounted = true;
    let objectUrl = '';

    const loadPdfPreview = async () => {
      if (!surveyResultId) {
        setPdfBlobUrl('');
        return;
      }

      try {
        setLoading(true);
        setError('');

        const pdfBlob = await getReceiptPdfBlob(surveyResultId);
        objectUrl = URL.createObjectURL(pdfBlob);

        if (mounted) {
          setPdfBlobUrl(objectUrl);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Gagal memuat file PDF';
        if (mounted) {
          setPdfBlobUrl('');
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPdfPreview();

    return () => {
      mounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
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

          {!loading && !error && pdfBlobUrl && (
            <iframe
              title="Preview PDF Nota Survey"
              src={pdfBlobUrl}
              className="w-full h-full bg-white rounded-[4px]"
            />
          )}

          {!loading && !error && !pdfBlobUrl && (
            <div className="text-center text-[#003654]">
              <FileText size={28} className="mx-auto mb-2" />
              <p className="text-[12px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                Preview PDF belum tersedia
              </p>
            </div>
          )}
        </div>

        <a
          href={pdfBlobUrl || '#'}
          download={pdfBlobUrl ? `nota-survey-${id}.pdf` : undefined}
          className={`h-[36px] rounded-[8px] flex items-center justify-center gap-2 font-bold text-[14px] ${pdfBlobUrl ? 'bg-[#75C8EA] text-[#003654]' : 'bg-gray-300 text-gray-600 pointer-events-none'}`}
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
