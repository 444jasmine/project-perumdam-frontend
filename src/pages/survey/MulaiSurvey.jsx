import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronDown, PlusSquare } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNavigation from '../../components/layout/BottomNavigation';
import { getItems } from '../../api';
import { getPelangganById } from './surveyData';
import { saveSurveyDraft } from './surveyStorage';

const FALLBACK_QTY_OPTIONS = Array.from({ length: 20 }, (_, i) => i + 1);

const formatCurrency = (value) => Number(value || 0).toLocaleString('id-ID');

const getCategoryKey = (item) => {
  if (item.idkategori !== undefined && item.idkategori !== null) {
    return String(item.idkategori);
  }

  if (item.category !== undefined && item.category !== null) {
    return String(item.category);
  }

  return 'Lainnya';
};

const getCategoryLabel = (key, sampleItem) => {
  if (sampleItem?.kategori) {
    return String(sampleItem.kategori);
  }

  if (sampleItem?.categoryName) {
    return String(sampleItem.categoryName);
  }

  if (key === 'Lainnya') {
    return key;
  }

  return `Kategori ${key}`;
};

const normalizeJumlahOptions = (item) => {
  if (!item || typeof item !== 'object') {
    return FALLBACK_QTY_OPTIONS;
  }

  if (Array.isArray(item.jumlahOptions) && item.jumlahOptions.length > 0) {
    return item.jumlahOptions
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value) && value > 0);
  }

  if (Array.isArray(item.qtyOptions) && item.qtyOptions.length > 0) {
    return item.qtyOptions
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value) && value > 0);
  }

  if (item.maxQty !== undefined && Number(item.maxQty) > 0) {
    const max = Math.min(100, Number(item.maxQty));
    return Array.from({ length: max }, (_, i) => i + 1);
  }

  return FALLBACK_QTY_OPTIONS;
};

const MulaiSurvey = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const pelanggan = getPelangganById(id);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedQty, setSelectedQty] = useState('1');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [kebutuhan, setKebutuhan] = useState([]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        setError('');

        const payload = await getItems();
        const nextItems = Array.isArray(payload) ? payload : [];
        setItems(nextItems);

        if (nextItems.length > 0) {
          const firstCategory = getCategoryKey(nextItems[0]);
          setSelectedCategory(firstCategory);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Gagal memuat item dari backend';
        if (message === 'Failed to fetch') {
          setError('Gagal terhubung ke backend. Pastikan server backend aktif dan API URL benar.');
        } else {
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  const categoryOptions = useMemo(() => {
    const map = new Map();

    for (const item of items) {
      const key = getCategoryKey(item);
      if (!map.has(key)) {
        map.set(key, getCategoryLabel(key, item));
      }
    }

    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [items]);

  useEffect(() => {
    if (!selectedCategory && categoryOptions.length > 0) {
      setSelectedCategory(categoryOptions[0].value);
    }
  }, [selectedCategory, categoryOptions]);

  const filteredItems = useMemo(
    () => items.filter((item) => getCategoryKey(item) === selectedCategory),
    [items, selectedCategory]
  );

  useEffect(() => {
    if (filteredItems.length === 0) {
      setSelectedItemId('');
      return;
    }

    const exists = filteredItems.some((item) => String(item._id) === selectedItemId);
    if (!exists) {
      const first = filteredItems[0];
      setSelectedItemId(String(first._id));
    }
  }, [filteredItems, selectedItemId]);

  const selectedItem = useMemo(
    () => filteredItems.find((item) => String(item._id) === selectedItemId),
    [filteredItems, selectedItemId]
  );

  const qtyOptions = useMemo(() => normalizeJumlahOptions(selectedItem), [selectedItem]);

  useEffect(() => {
    if (qtyOptions.length === 0) {
      setSelectedQty('1');
      return;
    }

    const qtyExists = qtyOptions.some((value) => String(value) === selectedQty);
    if (!qtyExists) {
      setSelectedQty(String(qtyOptions[0]));
    }
  }, [qtyOptions, selectedQty]);

  const unitOptions = useMemo(() => {
    const options = new Set();

    for (const item of filteredItems) {
      if (item?.satuan) {
        options.add(String(item.satuan));
      }
    }

    return Array.from(options);
  }, [filteredItems]);

  useEffect(() => {
    if (selectedItem?.satuan) {
      setSelectedUnit(String(selectedItem.satuan));
      return;
    }

    if (unitOptions.length > 0 && !unitOptions.includes(selectedUnit)) {
      setSelectedUnit(unitOptions[0]);
    }
  }, [selectedItem, unitOptions, selectedUnit]);

  const subtotal = useMemo(() => {
    return kebutuhan.reduce((sum, row) => sum + Number(row.subtotal || 0), 0);
  }, [kebutuhan]);

  const addKebutuhan = () => {
    if (!selectedItem) {
      return;
    }

    const qty = Number(selectedQty || 1);
    const price = Number(selectedItem.price || 0);
    const next = {
      rowId: `${selectedItem._id}-${Date.now()}`,
      itemId: selectedItem._id,
      categoryKey: selectedCategory,
      categoryLabel: categoryOptions.find((item) => item.value === selectedCategory)?.label || selectedCategory,
      name: selectedItem.name,
      qty,
      satuan: selectedUnit || selectedItem.satuan || '-',
      price,
      subtotal: qty * price
    };

    setKebutuhan((prev) => [...prev, next]);
  };

  const handleSelesai = () => {
    saveSurveyDraft(id, {
      customerId: id,
      customerName: pelanggan?.name || 'Pelanggan',
      rab: pelanggan?.rab || '-',
      kebutuhan,
      total: subtotal,
      updatedAt: new Date().toISOString(),
    });

    navigate(`/survey/${id}/rekap-rab`);
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] flex flex-col relative w-full h-full pb-[80px]">
      <div className="flex items-center px-[22px] pt-[15px] pb-[18px] relative">
        <button
          onClick={() => navigate(-1)}
          className="p-1 z-10 text-[#1E1E1E] hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          aria-label="Kembali"
        >
          <ChevronLeft size={28} strokeWidth={3} />
        </button>
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none pt-[15px] pb-[18px]">
          <h1
            className="text-[#000000] font-bold text-[20px] leading-[150%] tracking-[-0.011em]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Entri Survey
          </h1>
        </div>
      </div>

      <div className="px-[18px]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-[58px] h-[58px] rounded-full bg-[#35C2FF] flex items-center justify-center shrink-0">
            <div className="w-[24px] h-[24px] rounded-full bg-[#015E9C]"></div>
          </div>
          <div>
            <p className="text-[#000000] font-bold text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              {pelanggan?.name || 'Pelanggan'}
            </p>
            <p className="text-[#000000] text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              No. RAB : {pelanggan?.rab || id || '-'}
            </p>
            <p className="text-[#000000] text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Alamat :
            </p>
            <p className="text-[#000000] text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Telp :
            </p>
          </div>
        </div>

        <p className="text-[#000000] text-[12px] mb-[6px]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Kebutuhan Rincian Biaya Penyambungan Baru
        </p>

        <div className="rounded-[8px] bg-[#53BDE8] px-[10px] py-[10px]">
          {loading && (
            <p className="text-[12px] text-[#003654] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
              Memuat data item...
            </p>
          )}

          {error && (
            <p className="text-[12px] text-[#8b0000] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
              {error}
            </p>
          )}

          {!loading && !error && (
            <>
              <div className="grid gap-[8px]">
                <FieldSelect
                  label="Kategori"
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={categoryOptions}
                />

                <FieldSelect
                  label="Nama Barang"
                  value={selectedItemId}
                  onChange={setSelectedItemId}
                  options={filteredItems.map((item) => ({
                    value: String(item._id),
                    label: item.name || '-'
                  }))}
                />

                <FieldSelect
                  label="Jumlah"
                  value={selectedQty}
                  onChange={setSelectedQty}
                  options={qtyOptions.map((qty) => ({ value: String(qty), label: String(qty) }))}
                />

                <FieldSelect
                  label="Satuan"
                  value={selectedUnit}
                  onChange={setSelectedUnit}
                  options={unitOptions.map((unit) => ({ value: unit, label: unit }))}
                />
              </div>

              <div className="mt-[8px] rounded-[6px] bg-[#9DD6EC] h-[28px] px-[10px] flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#003654]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  SUBTOTAL
                </span>
                <span className="text-[12px] font-bold text-[#003654]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <button
                type="button"
                onClick={addKebutuhan}
                className="mt-[10px] w-full h-[36px] rounded-[6px] font-bold text-[12px] text-[#003654] flex items-center justify-center gap-2"
                style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#80CCEB' }}
              >
                <PlusSquare size={16} />
                Tambah Kebutuhan
              </button>

              <button
                type="button"
                onClick={handleSelesai}
                className="mt-[8px] w-full h-[36px] rounded-[6px] font-bold text-[12px] text-[#003654]"
                style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#A5DCF0' }}
              >
                Selesai
              </button>
            </>
          )}
        </div>

        {kebutuhan.length > 0 && (
          <div className="mt-[12px] rounded-[8px] bg-white border border-[#015E9C] p-[10px] max-h-[210px] overflow-auto">
            <p className="text-[12px] font-bold text-[#003654] mb-[6px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Daftar Kebutuhan
            </p>
            <div className="space-y-[6px]">
              {kebutuhan.map((row) => (
                <div
                  key={row.rowId}
                  className="text-[11px] border border-[#D7ECF5] rounded-[6px] px-[8px] py-[6px] bg-[#F7FCFF]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <p className="font-semibold text-[#003654]">{row.name}</p>
                  <p className="text-[#1E1E1E]">
                    {row.qty} {row.satuan} x {formatCurrency(row.price)} = {formatCurrency(row.subtotal)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

const FieldSelect = ({ label, value, onChange, options }) => {
  return (
    <label className="block">
      <span className="text-[12px] text-[#003654] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
        {label}
      </span>
      <div className="relative mt-[2px]">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full h-[31px] rounded-[7px] bg-white border border-[#9ECFE4] px-[10px] pr-[28px] text-[12px] text-[#1E1E1E] appearance-none outline-none"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {options.length === 0 && <option value="">-</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-[8px] flex items-center pointer-events-none text-[#015E9C]">
          <ChevronDown size={14} strokeWidth={2} />
        </div>
      </div>
    </label>
  );
};

export default MulaiSurvey;
