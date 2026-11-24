import { supabase } from "@/lib/supabase";
import { CoffeeBatch } from "@/types/coffee";

interface SupabaseBatchRow {
  id: string;
  batch_code: string;
  coffee_name: string;
  variety: string;
  origin: string;
  altitude: string;
  farmer: string;
  process_method: string;
  roast_level: string;
  roast_date: string;
  flavor_notes: string[];
  certification_number: string;
  status: string;
  qr_image_url: string;
}

const mapRowToBatch = (row: SupabaseBatchRow): CoffeeBatch => ({
  id: row.id,
  batchCode: row.batch_code,
  coffeeName: row.coffee_name,
  variety: row.variety,
  origin: row.origin,
  altitude: row.altitude,
  farmer: row.farmer,
  processMethod: row.process_method,
  roastLevel: row.roast_level,
  roastDate: row.roast_date,
  flavorNotes: row.flavor_notes,
  certificationNumber: row.certification_number,
  status: row.status as CoffeeBatch["status"],
  qrImageUrl: row.qr_image_url,
});

export const verifyBatchCode = async (
  scannedCode: string
): Promise<CoffeeBatch> => {
  const cleanCode = scannedCode.trim().toUpperCase();
  const { data, error } = await supabase
    .from("coffee_batches")
    .select("*")
    .ilike("batch_code", cleanCode)
    .single();

  if (error || !data) {
    throw new Error(
      `Kode barcode "${scannedCode}" tidak terdaftar di database Jejak Kopi. Waspada produk kopi tiruan!`
    );
  }

  return mapRowToBatch(data as SupabaseBatchRow);
};

export const fetchAllBatches = async (): Promise<CoffeeBatch[]> => {
  const { data, error } = await supabase
    .from("coffee_batches")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Gagal memuat data batch kopi dari server.");
  }

  return (data as SupabaseBatchRow[]).map(mapRowToBatch);
};

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
      onError(error.message || "Gagal memverifikasi batch");
    });
};
