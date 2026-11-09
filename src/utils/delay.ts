/**
 * Utility untuk mensimulasikan jeda waktu asynchronous (latency)
 * Sesuai materi Modul 3 Praktik (halaman 20)
 */
export function delay(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

