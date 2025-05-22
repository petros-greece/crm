import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [MatIcon, NgIf],
  template: `
    <div class="flex flex-row items-center justify-between px-3 py-3 bg-violet-800 rounded-lg shadow-md mb-4">
      <h2 class="text-lg flex items-center gap-2 text-white">
        {{ header }}
        <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
      </h2>
      <ng-content></ng-content>
    </div>
  `,
})
export class PageHeaderComponent {
  @Input() header: string = '';
  @Input() icon?: string;
}
