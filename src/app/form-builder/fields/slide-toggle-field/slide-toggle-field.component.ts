import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BaseFieldComponent } from '../base-field/base-field.component';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-slide-toggle-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatInputModule,
    MatIcon
  ],
  template: `
<div class="flex flex-col items-center justify-center h-full w-full">
  <mat-slide-toggle
    [formControl]="control"
    [required]="config.required ?? false">
    <mat-icon *ngIf="config.icon">
          {{ config.icon }}
        </mat-icon>
    {{ config.label }}
  </mat-slide-toggle>

  <div class="h-[30px]">
    <mat-error *ngIf="control.invalid && (control.dirty || control.touched)" class="text-xs">
      {{ config.label }} is required
    </mat-error>
  </div>
</div>
  `
})
export class SlideToggleFieldComponent extends BaseFieldComponent<FormControl<boolean>> {
  // No need to override anything unless you want extra behavior
}
