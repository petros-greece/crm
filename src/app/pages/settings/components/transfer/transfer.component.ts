import { Component, inject } from '@angular/core';
import { TransferService } from '../../../../services/transfer.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { UploadFileFieldComponent } from '../../../../components/upload-file-field.component';

@Component({
  selector: 'app-transfer',
  imports: [MatButtonModule, MatIcon, UploadFileFieldComponent],
  providers: [TransferService],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.scss'
})
export class TransferComponent {
  transferService = inject(TransferService);

  addZipFile(files: File[]) {
    //console.log(files)

    this.transferService.uploadAndRestoreLocalStorage(files[0]).subscribe({
      next: (res) => console.log('Success:', res),
      error: (err) => console.error('Upload or restore failed:', err),
      complete: () => console.log('Upload and restore complete')
    });
  }

  downloadCrmData(){
    this.transferService.downloadLocalStorageAsZipFolder().subscribe()
  }

}
