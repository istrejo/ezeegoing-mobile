import { Component, OnInit, inject, signal } from '@angular/core';
import { Server } from 'src/app/core/models/server.interface';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ModalService } from 'src/app/core/services/modal/modal.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-server-modal',
  templateUrl: './server-modal.component.html',
  styleUrls: ['./server-modal.component.scss'],
})
export class ServerModalComponent implements OnInit {
  private authService = inject(AuthService);
  private modalSvc = inject(ModalService);
  private toastService = inject(ToastService);

  public servers = signal<Server[]>([]);
  public selectedServerId = signal<number | null>(null);
  public isLoading = signal(false);

  ngOnInit(): void {
    this.loadServers();
  }

  loadServers(): void {
    this.isLoading.set(true);
    this.authService.getServers().subscribe({
      next: (servers) => {
        this.servers.set(servers);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toastService.error('No se pudieron cargar los servidores');
      },
    });
  }

  selectServer(server: Server): void {
    this.selectedServerId.set(server.id);
    this.modalSvc.dismissModal(server, 'select');
  }

  close(): void {
    this.modalSvc.dismissModal(null, 'cancel');
  }
}
