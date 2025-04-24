import { Component } from '@angular/core';
import { FormConfig, FormFieldConfig } from '../form-builder.model';
import { FormBuilderComponent } from '../form-builder.component';

@Component({
  selector: 'app-form-builder-ui',
  imports: [FormBuilderComponent],
  templateUrl: './form-builder-ui.component.html'
})
export class FormBuilderUiComponent {

  // They All can be required, icon, label, machineName, value ?? 
  fieldComponents = [
    { field: 'text', text: 'Simple Field' },   //minlength, maxLength, pattern
    { field: 'select', text: 'Select Field' }, //can be multi
    { field: 'autocomplete', text: 'Autocomplete Field' },
    { field: 'date', text: 'Date Picker' },    //minDate, maxDate
    { field: 'radio', text: 'Radio Group' },   //class
    { field: 'slider', text: 'Slider Field' }, //min, max, step, formatLabel
    { field: 'slider-range', text: 'Slider Range Field' }, //min, max, step, formatLabel
    { field: 'multi-row', text: 'Multi Row Field' },  //@todo
    { field: 'slide-toggle', text: 'Slide Toggle' },
    { field: 'range-picker', text: 'Range Picker' }, //minDate, maxDate
    { field: 'chips', text: 'Autocomplete Chips' },
    { field: 'file', text: 'File Upload' }, //accepted types
    { field: 'color', text: 'Color Picker Field' },
    { field: 'textarea', text: 'Textarea Field' } //minlength, maxLength, pattern
  ];

  /******************************************************************************** */

  baseFields: FormFieldConfig[] = [
    {
      type: 'slide-toggle',
      name: 'isRequired',
      label: 'Is Required'
    },
    {
      type: 'text',
      name: 'label',
      label: 'Label',
      required: true,
      validators: {
        minLength: 3,
        maxLength: 50
      },
      placeholder: 'Enter label here...'
    },
    {
      type: 'text',
      name: 'machineName',
      label: 'Machine Name',
      required: true,
      validators: {
        minLength: 3,
        maxLength: 50,
        pattern: '^[a-zA-Z0-9_]+$'
      },
      placeholder: 'Enter machine name here...'
    },
    {
      type: 'text',
      name: 'value',
      label: 'Default Value',
      required: false,
      validators: {
        minLength: 3,
        maxLength: 50
      },
      placeholder: 'Enter default value here...'
    }
  ];

  textformConfig: FormConfig = {
    title: 'Text Field',
    fields: [
      {
        type: 'text',
        name: 'textField',
        label: 'Text Field',
        required: true,
        validators: {
          minLength: 3,
          maxLength: 50,
          pattern: '^[a-zA-Z0-9]+$'
        },
        placeholder: 'Enter text here...'
      }
    ]
  };

  constructor() {
    // Prepend baseFields to textformConfig.fields
    this.textformConfig.fields = [...this.baseFields, ...this.textformConfig.fields];
  }
}
