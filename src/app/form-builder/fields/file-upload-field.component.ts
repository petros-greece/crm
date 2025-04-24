import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FileUploadModule, FileUploader, FileItem } from 'ng2-file-upload';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploadModule,
    MatFormFieldModule,
  ],
  template: `
    <div class="w-full">
      <!-- Dropzone -->
      <div
        ng2FileDrop
        [ngClass]="{ 'bg-gray-200': hasBaseDropZoneOver }"
        (fileOver)="fileOverBase($event)"
        [uploader]="uploader"
        class="flex items-center justify-center h-32 border-2 border-dashed border-gray-400 rounded
               cursor-pointer transition-all duration-150
               hover:bg-blue-50 hover:border-blue-500"
        (click)="fileInput.click()"
      >
        Click or Drop to Upload {{ config.label }}
      </div>

      <!-- Hidden input file -->
      <input
        type="file"
        ng2FileSelect
        [uploader]="uploader"
        [accept]="acceptTypes"
        multiple
        #fileInput
        hidden
      />

      <!-- Selected file names -->
      <div *ngIf="uploader.queue?.length" class="mt-2 text-sm text-gray-600">
        <div *ngFor="let item of uploader.queue">
          {{ item.file.name }}
          <button (click)="removeFile(item)" class="ml-2 text-red-500">×</button>
        </div>
      </div>
    </div>
  `
})
export class FileUploadComponent implements OnInit {
  @Input() control!: FormControl;
  @Input() config: any = {};
  @Input() uploadEndpoint = '';

  uploader!: FileUploader;
  hasBaseDropZoneOver = false;
  
  allowedMimeType: string[] =  ['image/png', 'image/jpeg'];
  acceptTypes: string = 'image/png, image/jpeg';  // Default accept types

  ngOnInit() {
    this.initializeUploader();
  }

  private initializeUploader() {
    // Update allowedMimeType from config.accept if available
    const allowedTypes = this.config.accept 
      ? this.config.accept.split(',').map((type: string): string => type.trim()) 
      : this.allowedMimeType;

    this.acceptTypes = allowedTypes.join(', ');  // Set the `accept` for the input file element
    this.uploader = new FileUploader({
      url: this.uploadEndpoint,
      autoUpload: false,
      allowedMimeType: allowedTypes
    });

    // Handle successful file additions
    this.uploader.onAfterAddingFile = (fileItem: FileItem) => {
      this.updateControlValue();
      this.control.updateValueAndValidity(); 
    };

    // Handle when adding file fails
    this.uploader.onWhenAddingFileFailed = (item: any, filter: any, options: any) => {
      console.log('Failed to add file:', item, filter, options);
      this.control.setErrors({ invalidFile: true }); 
      this.control.updateValueAndValidity(); 
    };

    // Initialize with existing files if any
    if (this.control.value?.length) {
      this.control.value.forEach((file: File) => {
        this.uploader.addToQueue([file]);
      });
    }
  }

  fileOverBase(e: boolean): void {
    this.hasBaseDropZoneOver = e;
  }

  removeFile(item: FileItem): void {
    this.uploader.removeFromQueue(item);
    this.updateControlValue();
  }

  private updateControlValue(): void {
    const files = this.uploader.queue.map(item => item._file);
    this.control.setValue(files);
    this.control.markAsDirty();
  }
}
