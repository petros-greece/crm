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
        <p class="text-gray-600 mb-1">Drag and drop files here or click to upload</p>
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
  @Output() filesUploaded = new EventEmitter<File[]>();
  @Output() uploadError = new EventEmitter<string>();

  uploader!: FileUploader;
  isFileOver = false;

  commonMimeTypes: { [key: string]: string } = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.csv': 'text/csv',
    '.txt': 'text/plain',
    '.zip': 'application/zip'
  };

  ngOnInit() {
    this.initializeUploader();
  }



  private initializeUploader() {
    this.uploader = new FileUploader({
      url: 'www.test.com', // Add your upload endpoint if needed
      autoUpload: false,
      allowedMimeType: this.acceptedTypes?.split(',').map(t => this.commonMimeTypes[t.trim()]),
      maxFileSize: 5 * 1024 * 1024 // 5MB
    });

    this.uploader.onAfterAddingAll = (files: FileItem[]) => {
      console.log('yoyo')
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