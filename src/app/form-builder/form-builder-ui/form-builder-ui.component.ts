import { ChangeDetectorRef, Component, effect, inject, signal, Signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
import { FieldFormConfig, FieldType, FormConfig, FormFieldConfig } from '../form-builder.model';
import { FormBuilderComponent } from '../form-builder.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { FormBuilderUIVars } from './form-builder-ui.vars';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-form-builder-ui',
  imports: [
    FormBuilderComponent, 
    CommonModule, 
    MatFormFieldModule, 
    MatSelectModule,
    DialogComponent,
    MatIcon
  ],
  templateUrl: './form-builder-ui.component.html'
})
export class FormBuilderUiComponent extends FormBuilderUIVars{

  private dialog = inject(MatDialog);
  @ViewChild('addFieldToOutputTmpl', { static: true }) addFieldToOutputTmpl!: TemplateRef<any>;


  //formBuilderService = inject(FormBuilderService);

  outputFormConfig: FormConfig = {
    title: 'Form Builder UI',
    className: 'bg-gray-300 p-4 rounded-lg shadow-md',
    fields: [],
    submitText: 'Test Form',
  };


  readonly selectedConfig:  WritableSignal<FieldFormConfig> = signal(this.fieldComponents[0]);
  readonly outputConfig:  WritableSignal<FormConfig> = signal(this.outputFormConfig);
  
  /******************************************************************************** */

  constructor(private cdr: ChangeDetectorRef) {
    super();
    // Prepend baseFields to textformConfig.fields
    this.textformConfig.fields = [  ...this.baseFields, ...this.textformConfig.fields, ];
    this.selectFormConfig.fields = [ ...this.baseFields, ...this.selectFormConfig.fields];
    this.autocompleteFormConfig.fields = [ ...this.baseFields, ...this.autocompleteFormConfig.fields];
    this.datepickerFormConfig.fields = [ ...this.baseFields, ...this.datepickerFormConfig.fields];
    this.radioGroupFormConfig.fields = [ ...this.baseFields, ...this.radioGroupFormConfig.fields];
    this.sliderFormConfig.fields =  [ ...this.baseFields, ...this.sliderFormConfig.fields];
    
    effect(() => {
      console.log('Selected field type is now →', this.selectedConfig());
    });

  }

  onSelectionChange(FieldFormConfig: FieldFormConfig) {
    let clone = JSON.parse(JSON.stringify(FieldFormConfig));
    clone.config.title = '';
    clone.config.submitText = 'Add Field';
    this.selectedConfig.set(clone);

    this.dialog.open(DialogComponent, {
      data: {
        content: this.addFieldToOutputTmpl,
        header: FieldFormConfig.config.title,
        cls: ''
      },
      minWidth: '80vw',
      maxWidth: '769px',
    });
  }

  addFieldToOutput(data: any) {

    const selected = this.selectedConfig();

    console.log('selected', selected, data);

    let fieldConfig: FormFieldConfig = {
      type: selected.field as FieldType,
      name: this.toCamelCaseMachineName(data.label),
      label: data.label,
      required: data.isRequired,
      columns: data.size || 1,
      validators: {}
    };

    if (selected.field === 'text' || selected.field === 'textarea') {
      fieldConfig.type = selected.field === 'textarea' ? 'textarea' : data.fieldType;
      if(fieldConfig.validators){
        if(data.min){
          data.fieldType === 'number' ? fieldConfig.validators.min = data.min : fieldConfig.validators.minLength = data.min;
        }
        if(data.max){
          data.fieldType === 'number' ? fieldConfig.validators.max = data.max : fieldConfig.validators.maxLength = data.max;
        }
      }
    }
    else if(selected.field === 'select'){
      data.list ? fieldConfig.listName = data.list : null;
    }
    else if(selected.field === 'autocomplete'){
      data.list ? fieldConfig.listName = data.list : null;
    }
    else if(selected.field === 'chips'){
      data.list ? fieldConfig.listName = data.list : null;
    }
    else if(selected.field === 'radio'){
      data.list ? fieldConfig.listName = data.list : null;
    }
    else if(selected.field === 'date' || selected.field === 'range-picker'){
      fieldConfig.type = selected.field;
      if(fieldConfig.validators){
        if(data.minDate){
          fieldConfig.minDate = data.minDate;
        }
        if(data.maxDate){
          fieldConfig.maxDate = data.maxDate;
        }
      }
    }
    else if(selected.field === 'slider' || selected.field === 'slider-range'){
      if(fieldConfig.validators){
        if(data.min){
          fieldConfig.validators.min = data.min;
        }
        if(data.max){
          fieldConfig.validators.max = data.max;
        }
      }
    }
    else if(selected.field === 'file'){
      console.log('cotten into')
      fieldConfig.acceptedTypes = data.acceptedTypes.join(', ');
    }
    // immutably update the array so that the signal fires:
    this.outputConfig.update(cfg => ({
      ...cfg,
      fields: [...cfg.fields, fieldConfig]
    }));

    //console.log('new outputConfig:', this.outputConfig());

  }


 
 private toCamelCaseMachineName(input: string): string {
   if (!input) return this.generateRandomName();
 
   const machineName = input
     .toLowerCase()
     .replace(/[^a-z0-9\u00C0-\u017F]/gi, ' ')
     .trim()
     .split(/\s+/)
     .map((word, index) => 
       index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
     )
     .join('');
 
   return machineName || this.generateRandomName();
 }
 
 /**
  * Generates a random camelCase name with prefix
  */
 private generateRandomName(): string {
   const prefix = 'random';
   const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
   let randomPart = '';
   
   for (let i = 0; i < 8; i++) {
     randomPart += chars[Math.floor(Math.random() * chars.length)];
   }
   
   return prefix + randomPart;
 }

}


