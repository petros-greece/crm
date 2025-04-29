import { ChangeDetectorRef, Component, effect, inject, signal, Signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
import { FieldFormConfig, FieldType, FormConfig, FormFieldConfig } from '../form-builder.model';
import { FormBuilderComponent } from '../form-builder.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { FormBuilderUIVars } from './form-builder-ui.vars';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  moveItemInArray,
  CdkDragHandle,
  CdkDragPlaceholder,
} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-form-builder-ui',
  imports: [
    FormBuilderComponent,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    DialogComponent,
    MatIcon,
    MatGridListModule,
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    CdkDragPlaceholder
  ],
  templateUrl: './form-builder-ui.component.html'
})
export class FormBuilderUiComponent extends FormBuilderUIVars {

  private dialog = inject(MatDialog);
  @ViewChild('addFieldToOutputTmpl', { static: true }) addFieldToOutputTmpl!: TemplateRef<any>;
  @ViewChild('createFormGroupTmpl', { static: true }) createFormGroupTmpl!: TemplateRef<any>;
  @ViewChild('fieldSelect') fieldSelect!: MatSelect;

  readonly selectedConfig: WritableSignal<FieldFormConfig> = signal(this.fieldComponents[0]);
  readonly outputConfig: WritableSignal<FormConfig> = signal(this.outputFormConfig);
  groupConfig!:FormConfig;
  editingIndex = -1;

  /******************************************************************************** */

  constructor(private cdr: ChangeDetectorRef) {
    super();
    // Prepend baseFields to textformConfig.fields
    this.textformConfig.fields = [...this.baseFields, ...this.textformConfig.fields,];
    this.selectFormConfig.fields = [...this.baseFields, ...this.selectFormConfig.fields];
    this.autocompleteFormConfig.fields = [...this.baseFields, ...this.autocompleteFormConfig.fields];
    this.datepickerFormConfig.fields = [...this.baseFields, ...this.datepickerFormConfig.fields];
    this.radioGroupFormConfig.fields = [...this.baseFields, ...this.radioGroupFormConfig.fields];
    this.sliderFormConfig.fields = [...this.baseFields, ...this.sliderFormConfig.fields];

    effect(() => {
      console.log('Selected field type is now →', this.selectedConfig());
    });

  }

  /**  GROUP AREA ***************************************************************************/

  openGroupDialog(){
    //let fields:FormFieldConfig[] = []
      const opts = this.outputConfig().fields.map(f=>{
        return {
          label: f.label, 
          value: this.toCamelCaseMachineName(f.label)
        }
      })
      
      const fields:FormFieldConfig[] = [
        {
          type: 'text',
          name: 'groupName',
          label: 'Group Name',
        },
        {
          type: 'select', 
          name: 'group-fields', 
          label: 'Select The fields To Add In The Group', 
          options: opts,
          multiple: true,
          required: true
        },
        {
          type: 'slide-toggle',
          name: 'isMultiplayable',
          label: 'Is Multiplayable?',
          columns: 2
        },
        {
          type: 'text',
          name: 'addRow',
          label: 'Add Row Button Text', 
          columns: 2       
        }
      ]
    
      this.groupConfig = {
        title: '',
        fields: fields
      }

    this.dialog.open(DialogComponent, {
      data: {
        content: this.createFormGroupTmpl,
        header: 'Group',
        cls: ''
      },
      minWidth: '80vw',
      maxWidth: '769px',
    });
  }

  /** SELECT ****************************************************************************** */

  focusSelect() {
    this.fieldSelect.focus();
    this.fieldSelect.open(); // Optional: to open dropdown immediately
  }

  onSelectionChange(FieldFormConfig: FieldFormConfig) {
    this.editingIndex = -1;
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

  /** DND AREA ****************************************************************************** */

  removeField(index: number): void {
    this.outputConfig.update(cfg => ({
      ...cfg,
      fields: cfg.fields.filter((_, i) => i !== index)
    }));
  }

  editField(field: FormFieldConfig, index: number) {

    this.editingIndex = index;
    const type = field.type === 'number' || field.type === 'password' || field.type === 'email' ? 'text' : field.type;
    const fieldComponent: FieldFormConfig | undefined = this.fieldComponents.find(fc => fc.field === type)
    if (!fieldComponent) return;
    let clone = JSON.parse(JSON.stringify(fieldComponent));
    clone.config.title = '';
    clone.config.submitText = 'Update Field';

    clone.config.fields.forEach((cloneField: FormFieldConfig) => {
      let fieldPropName = this.getConfigToFormProp(cloneField.name);
      cloneField.value = this.getConfigToFormVal(fieldPropName, field);
    })

    //SET THE SELECTED CONFIG!!!
    this.selectedConfig.set(clone);

    this.dialog.open(DialogComponent, {
      data: {
        content: this.addFieldToOutputTmpl,
        header: fieldComponent.config.title,
        cls: ''
      },
      minWidth: '80vw',
      maxWidth: '769px',
    });

  }

  duplicateField(field: FormFieldConfig, index: number) {
    this.outputConfig.update(cfg => ({
      ...cfg,
      fields: [...cfg.fields, field]
    }));
  }

  drop(event: CdkDragDrop<any[]>) {
    const currentConfig = this.outputConfig();
    const updatedFields = [...currentConfig.fields];
    moveItemInArray(updatedFields, event.previousIndex, event.currentIndex);

    this.outputConfig.update(config => ({
      ...config,
      fields: updatedFields
    }));
  }

  /** FORM AREA ****************************************************************************** */

  private getConfigToFormProp(fieldPropName: string): string {
    if (fieldPropName === 'list') {
      return 'listName';
    }
    else if (fieldPropName === 'isMulti') {
      return 'multiple';
    }
    else if (fieldPropName === 'machineName') {
      return 'name';
    }
    return fieldPropName;
  }

  private getConfigToFormVal(fieldPropName: string, field: FormFieldConfig) {
    if (fieldPropName === 'min' || fieldPropName === 'max' || fieldPropName === 'minLength' || fieldPropName === 'maxLength') {
      if (field.validators && fieldPropName === 'min') {
        return field.validators.minLength || field.validators.min || undefined;
      }
      if (field.validators && fieldPropName === 'max') {
        return field.validators.maxLength || field.validators.max || undefined;
      }
    }
    else if (fieldPropName === 'acceptedTypes') {
      return field[fieldPropName as keyof FormFieldConfig].split(', ');
    }
    else {
      return field[fieldPropName as keyof FormFieldConfig];
    }
  }

  addFieldToOutput(data: any) {

    const selected = this.selectedConfig();

    //console.log('selected', selected, data);

    let fieldConfig: FormFieldConfig = {
      type: selected.field as FieldType,
      name: this.toCamelCaseMachineName(data.label),
      label: data.label,
      required: data.required,
      columns: data.columns || 1,
      validators: {}
    };


    if (selected.field === 'text' || selected.field === 'textarea') {
      fieldConfig.type = selected.field === 'textarea' ? 'textarea' : data.type;
      if (fieldConfig.validators) {
        if (data.min) {
          data.type === 'number' ? fieldConfig.validators.min = data.min : fieldConfig.validators.minLength = data.min;
        }
        if (data.max) {
          data.type === 'number' ? fieldConfig.validators.max = data.max : fieldConfig.validators.maxLength = data.max;
        }
      }
    }
    else if (selected.field === 'select') {
      fieldConfig.multiple = data.isMulti;
      data.list ? fieldConfig.listName = data.list : null;
    }
    else if (selected.field === 'autocomplete' || selected.field === 'chips' || selected.field === 'radio') {
      data.list ? fieldConfig.listName = data.list : null;
    }
    else if (selected.field === 'date' || selected.field === 'range-picker') {
      fieldConfig.type = selected.field;
      if (fieldConfig.validators) {
        if (data.minDate) {
          fieldConfig.minDate = data.minDate;
        }
        if (data.maxDate) {
          fieldConfig.maxDate = data.maxDate;
        }
      }
    }
    else if (selected.field === 'slider' || selected.field === 'slider-range') {
      if (fieldConfig.validators) {
        if (data.min) {
          fieldConfig.validators.min = data.min;
        }
        if (data.max) {
          fieldConfig.validators.max = data.max;
        }
      }
    }
    else if (selected.field === 'file') {
      fieldConfig.acceptedTypes = data.acceptedTypes.join(', ');
    }



    if (this.editingIndex > -1) {
      const currentConfig = this.outputConfig();
      currentConfig.fields[this.editingIndex] = fieldConfig;
      //moveItemInArray(updatedFields, event.previousIndex, event.currentIndex);

      this.outputConfig.update(config => ({
        ...config,
        fields: currentConfig.fields
      }))



    }
    else {
      this.outputConfig.update(cfg => ({
        ...cfg,
        fields: [...cfg.fields, fieldConfig]
      }));
    }

    //console.log('new outputConfig:', this.outputConfig());

    this.dialog.closeAll();
  }

  /** HELPERS ****************************************************************************** */


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


