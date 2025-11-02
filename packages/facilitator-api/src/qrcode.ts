import QRCode from 'qrcode';

export class QRCodeService {
  /**
   * Generate Solana Pay QR code
   * Format: solana:<address>?amount=<amount>&spl-token=<mint>&label=<label>&message=<message>
   */
  async generatePaymentQR(params: {
    address: string;
    amount: number;
    token: string;
    label?: string;
    message?: string;
    reference?: string;
  }): Promise<string> {
    const { address, amount, token, label, message, reference } = params;
    
    // Build Solana Pay URL
    let url = `solana:${address}`;
    const queryParams: string[] = [];
    
    queryParams.push(`amount=${amount}`);
    queryParams.push(`spl-token=${token}`);
    
    if (label) queryParams.push(`label=${encodeURIComponent(label)}`);
    if (message) queryParams.push(`message=${encodeURIComponent(message)}`);
    if (reference) queryParams.push(`reference=${reference}`);
    
    url += `?${queryParams.join('&')}`;
    
    // Generate QR code as base64 data URL
    const qrCode = await QRCode.toDataURL(url, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return qrCode;
  }

  /**
   * Generate simple address QR code
   */
  async generateAddressQR(address: string): Promise<string> {
    return QRCode.toDataURL(address, {
      width: 512,
      margin: 2
    });
  }
}
