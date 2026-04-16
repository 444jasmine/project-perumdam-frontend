import React, { useMemo, useState } from 'react';
import { ChevronLeft, Camera, ImagePlus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNavigation from '../../components/layout/BottomNavigation';
import { createSurvey, getCustomerById, getItems, updateCustomerStatus, uploadDocument } from '../../api';
import { getPelangganById } from './surveyData';
import {
  clearSurveyDraft,
  getSurveyDraft,
  setSurveyResultIdByCustomerId,
} from './surveyStorage';

const formatCurrency = (value) => Number(value || 0).toLocaleString('id-ID');

const RekapRab = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const normalizedCustomerId = decodeURIComponent(String(id || '')).trim();
  const [apiCustomer, setApiCustomer] = useState(null);
  const pelanggan = apiCustomer || getPelangganById(normalizedCustomerId);
  const draft = getSurveyDraft(normalizedCustomerId);

  const [mediaSlots, setMediaSlots] = useState([null, null, null]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [itemPrices, setItemPrices] = useState({});

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

  React.useEffect(() => {
    let mounted = true;

    const loadItemPrices = async () => {
      try {
        const data = await getItems();
        if (!mounted) {
          return;
        }

        const map = {};
        (Array.isArray(data) ? data : []).forEach((item) => {
          const key = String(item?._id || '');
          map[key] = Number(item?.price || 0);
        });

        setItemPrices(map);
      } catch {
        if (!mounted) {
          return;
        }

        setItemPrices({});
      }
    };

    loadItemPrices();

    return () => {
      mounted = false;
    };
  }, []);

  const kebutuhan = useMemo(() => {
    const baseRows = Array.isArray(draft?.kebutuhan) ? draft.kebutuhan : [];

    return baseRows.map((row) => {
      const price = Number(row?.price || 0);
      const qty = Number(row?.qty || 0);
      const subtotal = Number(row?.subtotal || 0);

      if (price > 0 && subtotal > 0) {
        return row;
      }

      const fallbackPrice = Number(itemPrices[String(row?.itemId || '')] || 0);
      if (fallbackPrice <= 0 || qty <= 0) {
        return row;
      }

      return {
        ...row,
        price: fallbackPrice,
        subtotal: qty * fallbackPrice,
      };
    });
  }, [draft?.kebutuhan, itemPrices]);

  const groupedRows = useMemo(() => {
    const groups = new Map();

    for (const row of kebutuhan) {
      const key = row.categoryLabel || row.categoryKey || 'Lainnya';
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(row);
    }

    return Array.from(groups.entries()).map(([category, rows]) => ({ category, rows }));
  }, [kebutuhan]);

  const total = useMemo(
    () => kebutuhan.reduce((sum, row) => sum + Number(row.subtotal || 0), 0),
    [kebutuhan]
  );

  const handlePickMedia = (slotIndex, file) => {
    if (!file) {
      return;
    }

    setMediaSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = file;
      return next;
    });
  };

  const uploadSelectedMedia = async () => {
    const files = mediaSlots.filter(Boolean);
    if (files.length === 0) {
      return { results: [], failedCount: 0 };
    }

    const results = [];
    let failedCount = 0;
    for (const file of files) {
      try {
        const result = await uploadDocument(file);
        results.push(result);
      } catch {
        failedCount += 1;
      }
    }

    return { results, failedCount };
  };

  const submitStatus = async (status) => {
    try {
      setSubmitting(true);
      setMessage('Menyimpan data...');

      const uploadSummary = await uploadSelectedMedia();

      if (status === 'Selesai') {
        const payload = {
          title: `Survey ${pelanggan?.name || id}`,
          description: `Rekap RAB - ${pelanggan?.rab || '-'}`,
          customerId: normalizedCustomerId,
          vcNama: pelanggan?.name || '',
          vcAlmt1: pelanggan?.alamat || '',
          status: status,
          items: kebutuhan.map((row) => ({
            itemId: String(row.itemId || ''),
            name: String(row.name || 'Item'),
            satuan: String(row.satuan || '-'),
            price: Number(row.price || 0),
            quantity: Number(row.qty || 1),
            subtotal: Number(row.subtotal || 0),
          })),
        };

        const created = await createSurvey(payload);
        const createdId = created?.data?._id || created?._id || null;
        if (createdId) {
          setSurveyResultIdByCustomerId(normalizedCustomerId, String(createdId));
        }
      }

      await updateCustomerStatus(normalizedCustomerId, status);
      if (status === 'Selesai') {
        clearSurveyDraft(normalizedCustomerId);
      }

      const nextMessage = uploadSummary.failedCount > 0
        ? 'Status berhasil disimpan. Beberapa foto gagal diupload.'
        : 'Status berhasil disimpan';

      setMessage(nextMessage);

      window.setTimeout(() => {
        if (status === 'Selesai') {
          navigate('/hasil-survey', { state: { notice: nextMessage } });
          return;
        }

        navigate('/entri-survey', { state: { notice: nextMessage } });
      }, 900);
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : 'Gagal menyimpan data survey';
      const errMessage = rawMessage === 'HTTP 500' ? 'Gagal menyimpan ke backend. Coba lagi.' : rawMessage;
      setMessage(errMessage);
    } finally {
      window.setTimeout(() => {
        setSubmitting(false);
      }, 900);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] flex flex-col relative w-full h-full pb-[88px]">
      <div className="flex items-center px-[18px] pt-[16px] pb-[14px] relative">
        <button
          onClick={() => navigate(-1)}
          className="p-1 z-10 text-[#1E1E1E] hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          aria-label="Kembali"
        >
          <ChevronLeft size={26} strokeWidth={2.5} />
        </button>
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <h1 className="text-[#000000] font-bold text-[22px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Rekap RAB
          </h1>
        </div>
      </div>

      <div className="px-[12px] flex-1 flex flex-col gap-3">
        <div className="rounded-[8px] border border-[#3B91C0] bg-white p-[8px] text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>
          <p className="font-bold">{pelanggan?.name || 'Pelanggan'}</p>
          <p>No. RAB : {pelanggan?.rab || id || '-'}</p>
          <p>Alamat : {pelanggan?.alamat || '-'}</p>
          <p>Telp. : 0821xxxxxxxx</p>
        </div>

        <div className="rounded-[8px] bg-[#53BDE8] p-[8px] text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>
          <h2 className="text-center text-[15px] font-bold text-[#003654] mb-[6px]">
            Rekap Rincian Anggaran Biaya
          </h2>

          {groupedRows.length === 0 && (
            <p className="text-[#003654] text-center py-2">Belum ada data kebutuhan dari entri survey.</p>
          )}

          {groupedRows.map((group) => (
            <div key={group.category} className="mb-[8px] rounded-[6px] bg-[#9DD6EC] overflow-hidden">
              <div className="bg-[#7DCBEA] px-[6px] py-[3px] font-bold text-[#003654]">{group.category}</div>
              {group.rows.map((row) => (
                <div key={row.rowId} className="grid grid-cols-[1fr_62px_72px] gap-[4px] px-[6px] py-[3px] border-t border-[#84CFEA] text-[#1E1E1E]">
                  <span>{row.name}</span>
                  <span className="text-right">{row.qty} {row.satuan}</span>
                  <span className="text-right">{formatCurrency(row.subtotal)}</span>
                </div>
              ))}
            </div>
          ))}

          <div className="mt-[8px] rounded-[6px] border border-[#4A90C2] bg-white p-[6px]">
            <p className="font-bold text-[#003654] mb-[4px]">Foto Rumah</p>
            <div className="grid grid-cols-3 gap-[8px]">
              {[0, 1, 2].map((slotIndex) => (
                <label
                  key={slotIndex}
                  className="h-[52px] rounded-[6px] border border-[#1E1E1E] bg-[#8ED4EE] flex flex-col items-center justify-center text-[#003654] cursor-pointer"
                >
                  {mediaSlots[slotIndex] ? <ImagePlus size={15} /> : <Camera size={15} />}
                  <span className="text-[9px] leading-tight text-center px-1">
                    {mediaSlots[slotIndex] ? mediaSlots[slotIndex].name : 'Tambah Foto'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handlePickMedia(slotIndex, event.target.files?.[0])}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="h-[44px] rounded-[8px] border border-[#3B91C0] bg-white px-[10px] flex items-center justify-between">
          <span className="text-[20px] font-bold leading-none text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>
            TOTAL
          </span>
          <span className="text-[24px] font-bold leading-none text-[#1E1E1E]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {formatCurrency(total)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-[12px]">
          <button
            type="button"
            onClick={() => submitStatus('Draft')}
            disabled={submitting}
            className="h-[42px] rounded-[9px] font-bold text-[14px] text-[#003654] disabled:opacity-70"
            style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#75C8EA' }}
          >
            DRAFT
          </button>
          <button
            type="button"
            onClick={() => submitStatus('Selesai')}
            disabled={submitting}
            className="h-[42px] rounded-[9px] font-bold text-[14px] text-[#003654] disabled:opacity-70"
            style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#75C8EA' }}
          >
            SIMPAN
          </button>
        </div>

        {message && (
          <p className="text-[12px] text-center text-[#003654] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
            {message}
          </p>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default RekapRab;
