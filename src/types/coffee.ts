export interface CoffeeBatch {
  id: string;
  batchCode: string;
  coffeeName: string;
  variety: string;
  origin: string;
  altitude: string;
  farmer: string;
  processMethod: string;
  roastLevel: string;
  roastDate: string;
  flavorNotes: string[];
  certificationNumber: string;
  status: 'AUTHENTIC' | 'REVOKED';
  qrImageUrl: string;
}

export interface VerificationResult {
  success: boolean;
  message: string;
  data?: CoffeeBatch;
  verifiedAt: string;
  scannedCode: string;
}

