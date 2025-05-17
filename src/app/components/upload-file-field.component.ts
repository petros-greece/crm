import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FileUploadModule, FileUploader, FileItem } from 'ng2-file-upload';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-upload-file-field',
  standalone: true,
  imports: [CommonModule, FileUploadModule, MatIconModule, MatButtonModule],
  template: `
    <div class="w-full space-y-4">
      <!-- Drop Zone -->
      <div 
        class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer
               transition-colors duration-200 hover:border-primary-500 hover:bg-primary-50"
        ng2FileDrop
        (fileOver)="onFileOver($event)"
        (click)="fileInput.click()"
        [ngClass]="{ 'bg-gray-200': isFileOver }"
        [uploader]="uploader"
      >
        <mat-icon class="text-4xl mb-2 text-gray-400">cloud_upload</mat-icon>
        <p class="text-gray-600 mb-1">{{ message }}</p>
        <p class="text-sm text-gray-500" *ngIf="acceptedTypes">
          Accepted formats: {{ acceptedTypes }}
        </p>
      </div>

      <!-- Hidden File Input -->
      <input
        type="file"
        #fileInput
        hidden
        ng2FileSelect
        [uploader]="uploader"
        [accept]="acceptedTypes"
        [multiple]="isMultiple"
      />

      <!-- Selected Files -->
      <div class="space-y-2" *ngIf="uploader?.queue?.length">
        <div 
          *ngFor="let item of uploader.queue"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center space-x-3">
            <mat-icon class="text-gray-400">
              {{ item.file.type?.startsWith('image/') ? 'image' : 'description' }}
            </mat-icon>
            <span class="text-gray-700">{{ item.file.name }}</span>
          </div>
          <button 
            mat-icon-button 
            class="text-red-500 hover:bg-red-50"
            (click)="removeFile(item)"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class UploadFileFieldComponent implements OnInit {
  @Input() isMultiple = false;
  @Input() acceptedTypes = '';
  @Input() message = 'Drag and drop files here or click to upload';
  @Output() filesUploaded = new EventEmitter<File[]>();
  @Output() uploadError = new EventEmitter<string>();

  uploader!: FileUploader;
  isFileOver = false;

commonMimeTypes: { [ext: string]: string[] } = {
  // Archives and compressed files
  '.zip':  ['application/zip', 'application/x-zip-compressed', 'application/octet-stream'], 
  '.7z':   ['application/x-7z-compressed'], 
  '.rar':  ['application/vnd.rar'], 
  '.tar':  ['application/x-tar'], 
  '.gz':   ['application/gzip', 'application/x-gzip'], 
  '.bz2':  ['application/x-bzip2'], 
  '.bz':   ['application/x-bzip'], 
  // Documents
  '.pdf':  ['application/pdf'], 
  '.doc':  ['application/msword'], 
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'], 
  '.xls':  ['application/vnd.ms-excel'], 
  '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'], 
  '.ppt':  ['application/vnd.ms-powerpoint'], 
  '.pptx': ['application/vnd.openxmlformats-officedocument.presentationml.presentation'], 
  '.txt':  ['text/plain'], 
  '.csv':  ['text/csv'], 
  '.html': ['text/html'], 
  '.htm':  ['text/html'], 
  '.css':  ['text/css'], 
  '.js':   ['text/javascript'], 
  '.json': ['application/json'], 
  '.xml':  ['application/xml', 'text/xml'],  // XML (RFC 7303 recommends application/xml):contentReference[oaicite:3]{index=3} 
  // Images
  '.jpg':  ['image/jpeg', 'image/pjpeg'],     // IE hack 'image/pjpeg' for JPEGs:contentReference[oaicite:4]{index=4} 
  '.jpeg': ['image/jpeg', 'image/pjpeg'], 
  '.png':  ['image/png', 'image/x-png'],     // IE used 'image/x-png':contentReference[oaicite:5]{index=5} 
  '.gif':  ['image/gif'], 
  '.bmp':  ['image/bmp', 'image/x-ms-bmp'],  // Windows BMP:contentReference[oaicite:6]{index=6} 
  '.ico':  ['image/vnd.microsoft.icon'], 
  '.svg':  ['image/svg+xml'], 
  '.webp': ['image/webp'], 
  '.tif':  ['image/tiff'], 
  '.tiff': ['image/tiff'], 
  // Audio/Video
  '.mp3':  ['audio/mpeg'], 
  '.wav':  ['audio/wav'], 
  '.oga':  ['audio/ogg'], 
  '.ogg':  ['audio/ogg'], 
  '.mp4':  ['video/mp4'], 
  '.avi':  ['video/x-msvideo'], 
  '.mov':  ['video/quicktime'],  // QuickTime:contentReference[oaicite:7]{index=7} 
  '.mpg':  ['video/mpeg'], 
  '.mpeg': ['video/mpeg'], 
  // Fallbacks / others
  '.bin':  ['application/octet-stream'],  // generic binary:contentReference[oaicite:8]{index=8} 
  // ...add other types as needed...
};

  ngOnInit() {
    this.initializeUploader();
  }



  private initializeUploader() {
    this.uploader = new FileUploader({
      url: 'www.test.com', // Add your upload endpoint if needed
      autoUpload: false,
      allowedMimeType: this.acceptedTypes
            ?.split(',')
            .map(ext => ext.trim().toLowerCase())
            .map(ext => ext.startsWith('.') ? ext : '.' + ext)
            .flatMap(ext => this.commonMimeTypes[ext] || [])
            .filter((type, i, arr) => arr.indexOf(type) === i), 
      maxFileSize: 5 * 1024 * 1024 // 5MB
    });

    this.uploader.onAfterAddingAll = (files: FileItem[]) => {
      this.filesUploaded.emit(files.map(f => f._file));
    };

    // this.uploader.onAfterAddingFile = (fileItem: FileItem) => {
    //   console.log('suc') 
    // };

    this.uploader.onWhenAddingFileFailed = (item, filter) => {
      let errorMessage = 'File upload failed: ';
      switch (filter.name) {
        case 'fileSize':
          errorMessage += 'File size exceeds limit';
          break;
        case 'mimeType':
          errorMessage += 'Invalid file type';
          break;
        default:
          errorMessage += 'Unknown error';
      }
      console.log('error', filter, item)
      this.uploadError.emit(errorMessage);
    };
  }

  onFileOver(isOver: boolean): void {
    this.isFileOver = isOver;
  }

  removeFile(item: FileItem): void {
    this.uploader.removeFromQueue(item);
    this.filesUploaded.emit(this.uploader.queue.map(f => f._file));
  }




}