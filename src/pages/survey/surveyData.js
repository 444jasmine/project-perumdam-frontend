export const DEFAULT_PELANGGAN = [
  { id: '1', name: 'RIZKY PRASETYA', rab: '1234567', alamat: 'Alamat Pelanggan', status: 'Belum disurvei' },
  { id: '2', name: 'AYUNDA SHERLY', rab: '1234567', alamat: 'Alamat Pelanggan', status: 'Draft' },
  { id: '3', name: 'KHAYANA WIJAYA', rab: '1234567', alamat: 'Alamat Pelanggan', status: 'Selesai' },
  { id: '4', name: 'FARIDA YENI ASIH', rab: '1234567', alamat: 'Alamat Pelanggan', status: 'Selesai' },
];

export function getPelangganById(id) {
  return DEFAULT_PELANGGAN.find((item) => String(item.id) === String(id)) || null;
}
