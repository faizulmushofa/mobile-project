import { COFFEE_BATCHES } from '@/dummy-data/coffee-batches';
import { CoffeeBatch } from '@/types/coffee';
import { delay } from '@/utils/delay';

/**
 * Service API Lokal untuk verifikasi Batch Kopi
 * Menerapkan materi Modul 3:
 * - Promise constructor: new Promise((resolve, reject) => { ... })
 * - resolve() saat data batch ditemukan dan valid
 * - reject() saat kode batch tidak ditemukan atau palsu
 * - delay() untuk mensimulasikan jeda waktu komunikasi API/database
 */
export const verifyBatchCode = (scannedCode: string): Promise<CoffeeBatch> => {
  return new Promise<CoffeeBatch>((resolve, reject) => {
    // Simulasi latensi jaringan selama 1000ms
    delay(1000).then(() => {
      const cleanCode = scannedCode.trim().toUpperCase();
      const foundBatch = COFFEE_BATCHES.find(
        (item) => item.batchCode.toUpperCase() === cleanCode
      );

      if (foundBatch) {
        // Berhasil verifikasi: jalankan resolve dengan data batch kopi
        resolve(foundBatch);
      } else {
        // Gagal verifikasi: jalankan reject dengan pesan error
        reject(
          new Error(
            `Kode barcode "${scannedCode}" tidak terdaftar di database Jejak Kopi. Waspada produk kopi tiruan!`
          )
        );
      }
    });
  });
};

/**
 * Mengambil seluruh daftar batch kopi lokal
 * Menggunakan async function custom
 */
export const fetchAllBatches = async (): Promise<CoffeeBatch[]> => {
  await delay(600);
  return COFFEE_BATCHES;
};

/**
 * Helper verifikasi yang menggunakan pola .then() dan .catch()
 * sesuai materi Bab 1.4 Modul 3
 */
export const verifyBatchWithThen = (
  scannedCode: string,
  onSuccess: (batch: CoffeeBatch) => void,
  onError: (errorMessage: string) => void
): void => {
  verifyBatchCode(scannedCode)
    .then((batch) => {
      onSuccess(batch);
    })
    .catch((error: Error) => {
      onError(error.message || 'Gagal memverifikasi batch');
    });
};
