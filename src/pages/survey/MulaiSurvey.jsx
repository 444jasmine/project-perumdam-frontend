import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronDown, PlusSquare } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNavigation from '../../components/layout/BottomNavigation';
import { getCustomerById, getItems } from '../../api';
import { getPelangganById } from './surveyData';
import { getSurveyDraft, saveSurveyDraft } from './surveyStorage';

const formatCurrency = (value) => Number(value || 0).toLocaleString('id-ID');

const getDisplayItemName = (item) => {
  const raw = String(item?.name || '').trim();

  if (!raw) {
    return '-';
  }

  let cleaned = raw;

  // Beberapa data berisi gabungan tuple SQL (contoh: "...,NULL),(219,2,...")
  // sehingga kita hanya ambil bagian nama pertama yang valid.
  cleaned = cleaned.replace(/'\s*,\s*NULL\)\s*,\s*\(.*/i, '');
  cleaned = cleaned.replace(/'\s*,\s*\d+\s*\)\s*,\s*\(.*/i, '');
  cleaned = cleaned.replace(/\)\s*,\s*\(\d+\s*,\s*\d+\s*,\s*'.*$/i, '');
  cleaned = cleaned.replace(/'\s*,\s*\d+\s*,\s*\d+\s*,\s*'.*$/i, '');
  cleaned = cleaned.replace(/[',\s]+$/, '').trim();

  return cleaned || '-';
};

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
  if (key === '1') {
    return 'Paket';
  }

  if (key === '2') {
    return 'Aksesoris';
  }

  if (key === '3') {
    return 'Jasa';
  }

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

const MulaiSurvey = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const normalizedCustomerId = decodeURIComponent(String(id || '')).trim();
  const [apiCustomer, setApiCustomer] = useState(null);
  const pelanggan = apiCustomer || getPelangganById(normalizedCustomerId);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const [selectedQty, setSelectedQty] = useState('1');
  const [kebutuhan, setKebutuhan] = useState([]);
  const [isDraftHydrated, setIsDraftHydrated] = useState(false);
  const hasMigratedDraftPricesRef = useRef(false);

  useEffect(() => {
    const draft = getSurveyDraft(normalizedCustomerId);

    if (!draft) {
      setIsDraftHydrated(true);
      return;
    }

    if (Array.isArray(draft.kebutuhan)) {
      setKebutuhan(draft.kebutuhan);
    }

    if (draft.selectedCategory) {
      setSelectedCategory(String(draft.selectedCategory));
    }

    if (draft.selectedItemId) {
      setSelectedItemId(String(draft.selectedItemId));
    }

    if (draft.itemSearch !== undefined) {
      setItemSearch(String(draft.itemSearch));
    }

    if (draft.selectedQty !== undefined) {
      setSelectedQty(String(draft.selectedQty));
    }

    setIsDraftHydrated(true);
  }, [normalizedCustomerId]);

  useEffect(() => {
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
          setSelectedCategory((current) => current || firstCategory);
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

  const filteredItems = useMemo(() => {
    const keyword = itemSearch.trim().toLowerCase();

    return items.filter((item) => {
      const inCategory = getCategoryKey(item) === selectedCategory;
      if (!inCategory) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      return getDisplayItemName(item).toLowerCase().includes(keyword);
    });
  }, [items, selectedCategory, itemSearch]);

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

  const selectedUnit = String(selectedItem?.satuan || '-');

  useEffect(() => {
    if (hasMigratedDraftPricesRef.current) {
      return;
    }

    if (items.length === 0 || kebutuhan.length === 0) {
      return;
    }

    const itemPriceMap = new Map(
      items.map((item) => [String(item?._id || ''), Number(item?.price || 0)])
    );

    let hasChanges = false;
    const migrated = kebutuhan.map((row) => {
      const currentPrice = Number(row?.price || 0);
      const currentSubtotal = Number(row?.subtotal || 0);
      const qty = Number(row?.qty || 0);
      const fallbackPrice = itemPriceMap.get(String(row?.itemId || '')) || 0;

      if (currentPrice > 0 && currentSubtotal > 0) {
        return row;
      }

      if (fallbackPrice <= 0 || qty <= 0) {
        return row;
      }

      hasChanges = true;
      return {
        ...row,
        price: fallbackPrice,
        subtotal: qty * fallbackPrice,
      };
    });

    hasMigratedDraftPricesRef.current = true;

    if (hasChanges) {
      setKebutuhan(migrated);
    }
  }, [items, kebutuhan]);

  const subtotal = useMemo(() => {
    return kebutuhan.reduce((sum, row) => sum + Number(row.subtotal || 0), 0);
  }, [kebutuhan]);

  const addKebutuhan = () => {
    if (!selectedItem) {
      return;
    }

    const qty = Number(selectedQty || 1);
    if (!Number.isFinite(qty) || qty <= 0) {
      return;
    }

    const price = Number(selectedItem.price || 0);
    const next = {
      rowId: `${selectedItem._id}-${Date.now()}`,
      itemId: selectedItem._id,
      categoryKey: selectedCategory,
      categoryLabel: categoryOptions.find((item) => item.value === selectedCategory)?.label || selectedCategory,
      name: getDisplayItemName(selectedItem),
      qty,
      satuan: selectedUnit,
      price,
      subtotal: qty * price
    };

    setKebutuhan((prev) => [...prev, next]);
  };

  useEffect(() => {
    if (!normalizedCustomerId || !isDraftHydrated) {
      return;
    }

    saveSurveyDraft(normalizedCustomerId, {
      customerId: normalizedCustomerId,
      customerName: pelanggan?.name || 'Pelanggan',
      rab: pelanggan?.rab || '-',
      kebutuhan,
      total: subtotal,
      selectedCategory,
      selectedItemId,
      itemSearch,
      selectedQty,
      updatedAt: new Date().toISOString(),
    });
  }, [normalizedCustomerId, pelanggan?.name, pelanggan?.rab, kebutuhan, subtotal, selectedCategory, selectedItemId, itemSearch, selectedQty, isDraftHydrated]);

  const handleSelesai = () => {
    saveSurveyDraft(normalizedCustomerId, {
      customerId: normalizedCustomerId,
      customerName: pelanggan?.name || 'Pelanggan',
      rab: pelanggan?.rab || '-',
      kebutuhan,
      total: subtotal,
      selectedCategory,
      selectedItemId,
      itemSearch,
      selectedQty,
      updatedAt: new Date().toISOString(),
    });

    navigate(`/survey/${encodeURIComponent(normalizedCustomerId)}/rekap-rab`);
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
              Alamat : {pelanggan?.alamat || '-'}
            </p>
            <p className="text-[#000000] text-[11px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Telp : {pelanggan?.telepon || pelanggan?.cTelp || pelanggan?.chp || '-'}
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
                  searchValue={itemSearch}
                  onSearchChange={setItemSearch}
                  options={filteredItems.map((item) => ({
                    value: String(item._id),
                    label: getDisplayItemName(item)
                  }))}
                />

                <FieldInputNumber
                  label="Jumlah"
                  value={selectedQty}
                  onChange={setSelectedQty}
                />

                <FieldReadOnly
                  label="Satuan"
                  value={selectedUnit}
                />
              </div>

              <div className="mt-[7px] rounded-[4px] bg-[#9DD6EC] h-[28px] px-[10px] flex items-center justify-between">
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
            <p className="text-[13px] font-extrabold text-[#003654] mb-[8px] text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              Daftar Kebutuhan
            </p>
            <div className="text-[10px] font-bold text-[#003654] bg-[#E7F4FB] rounded-t-[6px] border-l border-r border-t border-b border-[#C2E2F3] overflow-hidden">
              <div className="grid grid-cols-[minmax(0,1fr)_88px_56px_110px] gap-0 px-[8px] py-[6px]">
                <span className="tracking-[0.2px] text-center block border-r border-[#C2E2F3] pr-[8px]">Produk Dipesan</span>
                <span className="tracking-[0.2px] flex justify-center w-full border-r border-[#C2E2F3]">Harga Satuan</span>
                <span className="tracking-[0.2px] flex justify-center w-full border-r border-[#C2E2F3]">Jumlah</span>
                <span className="tracking-[0.2px] flex justify-center w-full">Subtotal Produk</span>
              </div>
            </div>
            <div className="border-l border-r border-[#C2E2F3]">
              {kebutuhan.map((row, idx) => (
                <div
                  key={row.rowId}
                  className={`text-[11px] bg-[#F7FCFF] grid grid-cols-[minmax(0,1fr)_88px_56px_110px] gap-0 items-center px-[8px] py-[6px] ${
                    idx === kebutuhan.length - 1
                      ? 'border-b border-[#C2E2F3] rounded-b-[6px]'
                      : 'border-b border-[#C2E2F3]'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <p className="font-semibold text-[#003654] truncate text-center border-r border-[#C2E2F3] pr-[8px]" title={getDisplayItemName({ name: row.name })}>
                    {getDisplayItemName({ name: row.name })}
                  </p>
                  <span className="text-[#1E1E1E] flex justify-center w-full border-r border-[#C2E2F3]">{formatCurrency(row.price)}</span>
                  <span className="text-[#1E1E1E] flex justify-center w-full border-r border-[#C2E2F3]">{row.qty}</span>
                  <span className="font-semibold text-[#003654] flex justify-center w-full">{formatCurrency(row.subtotal)}</span>
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

const FieldSelect = ({ label, value, onChange, options, searchValue = '', onSearchChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <label className="block">
      <span className="text-[12px] text-[#003654] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
        {label}
      </span>
      {typeof onSearchChange === 'function' && (
        <input
          type="text"
          value={searchValue}
          onChange={(event) => {
            onSearchChange(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Cari nama barang"
          className="w-full h-[31px] rounded-[7px] bg-white border border-[#9ECFE4] px-[10px] text-[12px] text-[#1E1E1E] outline-none mt-[2px]"
          style={{ fontFamily: 'Inter, sans-serif' }}
        />
      )}
      {typeof onSearchChange === 'function' ? (
        <div className="relative mt-[2px]" ref={wrapperRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-full h-[31px] rounded-[7px] bg-white border border-[#9ECFE4] px-[10px] pr-[28px] text-[12px] text-[#1E1E1E] text-left outline-none"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {selectedOption?.label || '-'}
          </button>
          <div className="absolute inset-y-0 right-0 pr-[8px] flex items-center pointer-events-none text-[#015E9C]">
            <ChevronDown size={14} strokeWidth={2} className={isOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
          </div>

          {isOpen && (
            <div className="absolute z-30 mt-[3px] w-full rounded-[7px] border border-[#9ECFE4] bg-white shadow-md max-h-[260px] overflow-auto">
              {options.length === 0 && (
                <p className="px-[10px] py-[8px] text-[12px] text-[#6b7280]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Barang tidak ditemukan
                </p>
              )}

              {options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      onSearchChange(option.label);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-[10px] py-[8px] text-[12px] border-b border-[#eef6fb] last:border-b-0 ${
                      isSelected ? 'bg-[#E9F6FD] text-[#003654] font-semibold' : 'text-[#1E1E1E] hover:bg-[#F5FBFF]'
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
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
      )}
    </label>
  );
};

const FieldInputNumber = ({ label, value, onChange }) => {
  return (
    <label className="block">
      <span className="text-[12px] text-[#003654] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
        {label}
      </span>
      <input
        type="number"
        min="1"
        step="1"
        inputMode="numeric"
        value={value}
        onChange={(event) => {
          const nextValue = event.target.value;
          if (nextValue === '') {
            onChange('');
            return;
          }

          if (/^\d+$/.test(nextValue)) {
            onChange(String(Math.max(1, Number(nextValue))));
          }
        }}
        className="w-full h-[31px] rounded-[7px] bg-white border border-[#9ECFE4] px-[10px] text-[12px] text-[#1E1E1E] outline-none mt-[2px]"
        style={{ fontFamily: 'Inter, sans-serif' }}
      />
    </label>
  );
};

const FieldReadOnly = ({ label, value }) => {
  return (
    <label className="block">
      <span className="text-[12px] text-[#003654] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
        {label}
      </span>
      <div
        className="w-full h-[31px] rounded-[7px] bg-[#E9F6FD] border border-[#9ECFE4] px-[10px] text-[12px] text-[#1E1E1E] mt-[2px] flex items-center"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {value || '-'}
      </div>
    </label>
  );
};

export default MulaiSurvey;
