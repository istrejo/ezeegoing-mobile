import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WalletService } from '../../services/wallet.service';
import { CapacitorPassToWallet } from 'capacitor-pass-to-wallet';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-wallet-button',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletButtonComponent {
  constructor(private walletService: WalletService) {}

  async downloadAndAddPass(): Promise<void> {
    const reservationId = 29765;
    try {
      const blob = await firstValueFrom(this.walletService.getPassFile(reservationId));
      if (!blob) throw new Error('No se recibió contenido del pase.');

      const base64 = await this.blobToBase64(blob);

      const result = await CapacitorPassToWallet.addToWallet({ base64 });
      console.log('Pase agregado correctamente:', result);
    } catch (err) {
      console.error('Error al descargar o agregar el pase:', err);
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Remover prefijo data si existe (e.g. "data:application/vnd.apple.pkpass;base64,")
        const commaIdx = result.indexOf(',');
        resolve(commaIdx >= 0 ? result.substring(commaIdx + 1) : result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
