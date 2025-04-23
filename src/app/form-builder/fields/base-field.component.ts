import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormFieldConfig, FieldComponent } from './../form-builder.model';

@Component({
  template: ''
})
export abstract class BaseFieldComponent implements FieldComponent {
  @Input() config!: FormFieldConfig;
  @Input() control!: FormControl;

  ngOnInit() {
    if (!this.config) {
      throw new Error('Field component requires config input');
    }
    if (!this.control) {
      throw new Error('Field component requires control input');
    }
  }
}