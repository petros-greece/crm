import { inject } from "@angular/core";
import { FieldFormConfig, FormConfig, FormFieldConfig } from "../form-builder.model";
import { FormBuilderService } from "../form-builder.service";



export class FormBuilderUIVars {
    formBuilderService = inject(FormBuilderService);

    baseFields: FormFieldConfig[] = [
      {
        type: 'text',
        name: 'label',
        label: 'Label',
        required: true,
        validators: {
          minLength: 3,
          maxLength: 50
        },
        columns: 2,
        icon: 'label',
      },
      {
        type: 'text',
        name: 'machineName',
        label: 'Machine Name',
        required: false,
        validators: {
          minLength: 3,
          maxLength: 50,
          pattern: '^[a-zA-Z0-9_]+$'
        },
        columns: 2,
        icon: 'smart_toy', // Updated to official Material icon
      },
      {
        type: 'select',
        name: 'columns',
        label: 'Width',
        required: false,
        multiple: false,
        value: 1,
        options: [
          { label: '20%', value: 5 },
          { label: '25%', value: 4 },
          { label: '33%', value: 3 },
          { label: '50%', value: 2 },
          { label: '100%', value: 1 },
        ],
        columns: 2,
        icon: 'settings'
      },
      {
        type: 'slide-toggle',
        name: 'required',
        label: 'Is Required',
        columns: 2,
        value: false,
      },
    ];
    
    textformConfig: FormConfig = {
      title: 'Simple Field',
      submitText: 'Add Field',
      fields: [
        {
          type: 'select',
          name: 'type',
          label: 'Field Type',
          required: true,
          multiple: false,
          options: [
            { label: 'text', value: 'text' },
            { label: 'number', value: 'number' },
            { label: 'password', value: 'password' },
            { label: 'email', value: 'password' },
          ],
          columns: 1,
          icon: 'category'
        },
        {
          type: 'number',
          name: 'min',
          label: 'Min Value (characters or number)',
          columns: 2,
          icon: 'arrow_downward'
        }, 
        {
          type: 'number',
          name: 'max',
          label: 'Max Value (characters or number)',
          columns: 2,
          icon: 'arrow_upward'
        },  
      ]
    };
    
    selectFormConfig: FormConfig  = {
      title: 'Select Field',
      fields: [
        {
          type: 'select',
          name: 'list',
          label: 'Select Options From List',
          multiple: false,
          listName: 'lists list',
          columns: 2,
          icon: 'list'
        },
        {
          type: 'slide-toggle',
          name: 'isMulti',
          label: 'Multiple answers?',
          columns: 2,
        },
        {
          type: 'multi-row',
          name: 'options',
          label: 'Custom Select Options',
          minRows: 1,
          maxRows: 3,
          columns: 1,
          icon: 'add_box',
          fields: [
            {
              type: 'text',
              name: 'value',
              label: 'Value',
              icon: 'text_fields'
            },
            {
              type: 'text',
              name: 'key',
              label: 'Key',
              icon: 'vpn_key'
            },
          ]
        },    
      ]
    };
    
    autocompleteFormConfig: FormConfig  = {
      title: 'Autocomplete Field',
      fields: [
        {
          type: 'select',
          name: 'list',
          label: 'Select Options From List',
          multiple: false,
          listName: 'lists list',
          columns: 2,
          icon: 'playlist_add_check'
        },
        {
          type: 'multi-row',
          name: 'options',
          label: 'Custom Select Options',
          minRows: 1,
          maxRows: 3,
          columns: 1,
          icon: 'format_list_bulleted',
          fields: [
            {
              type: 'text',
              name: 'value',
              label: 'Value',
              icon: 'short_text'
            },
            {
              type: 'text',
              name: 'key',
              label: 'Key',
              icon: 'key'
            },
          ]
        },    
      ]
    };
    
    datepickerFormConfig: FormConfig  = {
      title: 'Date Picker Field',
      fields: [
        {
          type: 'date',
          name: 'minDate',
          label: 'Min Date',
          columns: 2,
          icon: 'event_available'
        }, 
        {
          type: 'date',
          name: 'maxDate',
          label: 'Max Date',
          columns: 2,
          icon: 'event_busy'
        },   
      ]
    };
    
    radioGroupFormConfig: FormConfig  = {
      title: 'Radio Group Field',
      fields: [
        {
          type: 'select',
          name: 'list',
          label: 'Select Options From List',
          multiple: false,
          listName: 'lists list',
          columns: 2,
          icon: 'radio_button_checked'
        },
        {
          type: 'multi-row',
          name: 'options',
          label: 'Custom Select Options',
          minRows: 1,
          maxRows: 3,
          columns: 1,
          icon: 'group_work',
          fields: [
            {
              type: 'text',
              name: 'value',
              label: 'Value',
              icon: 'text_format'
            },
            {
              type: 'text',
              name: 'key',
              label: 'Key',
              icon: 'password'
            },
          ]
        },    
      ]
    };
    
    sliderFormConfig: FormConfig  = {
      title: 'Slider Field',
      fields: [
        {
          type: 'number',
          name: 'min',
          label: 'Min Value',
          columns: 2,
          icon: 'vertical_align_bottom'
        }, 
        {
          type: 'number',
          name: 'max',
          label: 'Max Value',
          columns: 2,
          icon: 'vertical_align_top'
        },   
      ]
    };
  
    
    slideToggleFormConfig: FormConfig  = {
      title: 'Slide Toggle Field',
      fields: [...this.baseFields]
    };
  
    chipsFormConfig: FormConfig  = {
      title: 'Slide Toggle Field',
      fields: []
    };
  
    fileFormConfig: FormConfig  = {
      title: 'File Upload Field',
      fields: [
        ...this.baseFields,
        {
          type: 'select',
          name: 'acceptedTypes',
          label: 'Select Accepted Mime Types',
          multiple: true,
          listName: 'Mime Type',
          columns: 2,
          icon: 'mime'
        }
      ]
    };
  
    colorFormConfig: FormConfig  = {
      title: 'Colorpicker Field',
      fields: [...this.baseFields]
    };
  
    textareaFormConfig: FormConfig  = {
      title: 'Textarea Field',
      fields: [ ...this.baseFields,
        {
          type: 'number',
          name: 'min',
          label: 'Min Length Charecters',
          columns: 2,
          icon: 'arrow_downward'
        }, 
        {
          type: 'number',
          name: 'max',
          label: 'Max Length Characters',
          columns: 2,
          icon: 'arrow_upward'
        }, 
      ]
    };

    /******************************************************************************** */

    // They All can be required, icon, label, machineName, value ?? 
    fieldComponents:FieldFormConfig[] = [
      { field: 'text', text: 'Simple Field', config: this.textformConfig},   //minlength, maxLength, pattern
      { field: 'select', text: 'Select Field', config: this.selectFormConfig }, //can be multi
      { field: 'autocomplete', text: 'Autocomplete Field', config: this.autocompleteFormConfig }, //can be multi
      { field: 'chips', text: 'Autocomplete Chips', config: this.autocompleteFormConfig  },
      { field: 'date', text: 'Date Picker', config: this.datepickerFormConfig },    //minDate, maxDate
      { field: 'range-picker', text: 'Date Picker Range', config: this.datepickerFormConfig  }, //minDate, maxDate
      { field: 'radio', text: 'Radio Group', config: this.radioGroupFormConfig  },   //class
      { field: 'slider', text: 'Slider Field', config: this.sliderFormConfig }, //min, max, step, formatLabel
      { field: 'slider-range', text: 'Slider Range Field', config: this.sliderFormConfig }, //min, max, step, formatLabel
    // { field: 'multi-row', text: 'Multi Row Field', config: this.baseFields  },  //@todo
      { field: 'slide-toggle', text: 'Slide Toggle', config: this.slideToggleFormConfig },
      { field: 'file', text: 'File Upload', config: this.fileFormConfig  }, //accepted types
      { field: 'color', text: 'Color Picker Field', config: this.colorFormConfig },
      { field: 'textarea', text: 'Textarea Field', config: this.textareaFormConfig  } //minlength, maxLength, pattern
    ];


    outputFormConfig: FormConfig = {
      title: 'Form Builder Preview',
      className: 'bg-gray-300 text-gray-100 p-4 rounded-lg shadow-md',
      fields: [],
      submitText: 'Test Form',
    };
  
  
}