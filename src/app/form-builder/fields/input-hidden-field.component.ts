import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFieldComponent } from './base-field/base-field.component';


@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [

    ReactiveFormsModule,


  ],
  template: `    
      <input
        [formControl]="control"
        type="hidden"
      >


 
  `
})
export class InputHiddenFieldComponent extends BaseFieldComponent {}