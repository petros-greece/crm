import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { XLSXTableComponent } from './xlsx-table.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AssetResponseType, AssetsService } from '../pages/assets/assets.service';

@Component({
  selector: 'app-preview-asset',
  standalone: true,
  imports: [CommonModule, XLSXTableComponent, NgxJsonViewerModule],
  template: `
  <ng-container [ngSwitch]="previewType">
    <xlsx-table *ngSwitchCase="'arraybuffer'" [buffer]="previewData"></xlsx-table>
    <img *ngSwitchCase="'blob'" [src]="previewData" style="max-width: 100%; max-height: 500px;"/> 
    <iframe *ngSwitchCase="'pdfBlob'" [src]="previewData" width="100%" height="800px" style="border: none;"></iframe>
    <pre *ngSwitchCase="'text'">{{ previewData }}</pre>
    <ngx-json-viewer *ngIf="previewType === 'json'" [json]="previewData"></ngx-json-viewer>
  </ng-container>
  `
})
export class PreviewAssetComponent implements OnChanges{
  @Input() assetPath: string = '';

  private sanitizer = inject(DomSanitizer)
  private assetsService = inject(AssetsService)

  previewData: any;
  previewType!:AssetResponseType;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['assetPath'] && this.assetPath) {
      this.previewAsset(this.assetPath);
    }
  }
  previewAsset(src:string) {
    
    this.assetsService.getFile(src)
      .subscribe({
        next: data => {
          this.previewType = data.type;
      
          if (data.type === 'arraybuffer') {
            this.previewData = data.data;
          }
          else if(data.type === 'blob' || data.type === 'pdfBlob'){ 
            const url = URL.createObjectURL(data.data)
            this.previewData = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          }
          else if(data.type === 'text'){
            
          }
          else if(data.type === 'json'){
            this.previewData = data.data;
          }
          
        },
        error: err => console.error('HTTP/Asset error', err)
      });
  }

}
