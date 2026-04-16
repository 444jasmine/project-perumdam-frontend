export const DEFAULT_PELANGGAN = [
  { id: '1', name: 'RIZKY PRASETYA', rab: '1234567', alamat: 'Alamat Pelanggan', telepon: '081234567890', status: 'Belum disurvei' },
  { id: '2', name: 'AYUNDA SHERLY', rab: '1234567', alamat: 'Alamat Pelanggan', telepon: '081234567891', status: 'Draft' },
  { id: '3', name: 'KHAYANA WIJAYA', rab: '1234567', alamat: 'Alamat Pelanggan', telepon: '081234567892', status: 'Selesai' },
  { id: '4', name: 'FARIDA YENI ASIH', rab: '1234567', alamat: 'Alamat Pelanggan', telepon: '081234567893', status: 'Selesai' },
];

export function getPelangganById(id) {
  return DEFAULT_PELANGGAN.find((item) => String(item.id) === String(id)) || null;
}
