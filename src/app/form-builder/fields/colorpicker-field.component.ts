import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component'; // Ensure this is correctly imported
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ColorPickerModule } from '@iplab/ngx-color-picker';

@Component({
  selector: 'app-color-picker-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    ColorPickerModule
  ],
  template: `
   <div class="flex flex-col items-center justify-center h-full w-full">

     <!-- Label Button -->
     <button *ngIf="config.label"
             mat-button
             [matMenuTriggerFor]="menu"
             [style.backgroundColor]="control.value || '#ffffff'"
             [style.color]="getTextColor(control.value)">
       {{ config.label || 'Select Color' }}
     </button>
     <!-- Color Picker Menu -->
     <mat-menu #menu="matMenu" class="z-[9999]">
       <div (click)="$event.stopPropagation()" class="p-2">
         <chrome-picker
           [color]="control.value || '#ffffff'"
           (colorChange)="onColorChange($event)">
         </chrome-picker>
       </div>
     </mat-menu>
   </div>

  

  `,
})
export class ColorPickerFieldComponent extends BaseFieldComponent<FormControl> {
  onColorChange(color: string) {
    this.control.setValue(color);
    this.control.markAsTouched();
    this.control.markAsDirty();
  }

  getTextColor(bg: string | null): string {
    if (!bg) return '#000';
    try {
      const ctx = document.createElement('canvas').getContext('2d');
      if (!ctx) return '#000';
      ctx.fillStyle = bg;
      const [r, g, b] = ctx.fillStyle.match(/\d+/g)?.map(Number) || [255, 255, 255];
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? '#000' : '#fff';
    } catch {
      return '#000';
    }
  }
}
