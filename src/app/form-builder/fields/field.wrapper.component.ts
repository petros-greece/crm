import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-field-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `<div [ngClass]="className"><ng-template #vc></ng-template></div>`
})
export class FieldWrapperComponent {
  @ViewChild('vc', { read: ViewContainerRef }) viewContainer!: ViewContainerRef;

  // 👇 Add this Input to control layout class
  @Input() className: string = '';
}
