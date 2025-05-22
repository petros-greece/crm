import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { FormFieldConfig, FieldComponent } from '../../form-builder.model';

@Component({
  template: ''
})
export abstract class BaseFieldComponent<T extends AbstractControl = FormControl>
  implements FieldComponent<T> {
  
  @Input() config!: FormFieldConfig;
  @Input() control!: T;

  ngOnInit() {
    if (!this.config || !this.control) {
      throw new Error('Field component requires config and control input');
    }
  }
}