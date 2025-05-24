import { ChangeDetectorRef, Component, effect, EventEmitter, inject, Input, Output, signal, TemplateRef, ViewChild, WritableSignal } from '@angular/core';
import { FieldFormConfig, FieldType, FormConfig, FormFieldConfig } from '../../form-builder.model';
import { FormBuilderComponent } from '../../form-builder.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { FormBuilderUIVars } from './form-builder-ui.vars';
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
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from '../../../components/dialog/dialog.service';


@Component({
  selector: 'app-form-builder-ui',
  imports: [
    FormBuilderComponent,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
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

  @Input() outputFormConfig: FormConfig = { fields: [], submitText: "Test Form" };
  @Input() submitText: string = 'Append Form To Entity';
  @Output() onSubmitConfig = new EventEmitter<any>();

  private dialogService = inject(DialogService);

  private cdr = inject(ChangeDetectorRef)
  @ViewChild('fieldFormToOutputTmpl', { static: true }) fieldFormToOutputTmpl!: TemplateRef<any>;
  @ViewChild('groupFormToOutputTmpl', { static: true }) groupFormToOutputTmpl!: TemplateRef<any>;
  @ViewChild('testFormTmpl', { static: true }) testFormTmpl!: TemplateRef<any>;
  @ViewChild('fieldSelect') fieldSelect!: MatSelect;

  readonly selectedConfig: WritableSignal<FieldFormConfig> = signal(this.fieldComponents[0]);
  readonly outputConfig: WritableSignal<FormConfig> = signal(this.outputFormConfig);
  groupConfig!: FormConfig;
  editingIndex = -1;
  groupFieldEdititngIndex = -1;

  testFormData: any = {};

  /******************************************************************************** */

  constructor() {
    super();
    // Prepend baseFields to textformConfig.fields
    this.textformConfig.fields = [...this.baseFields, ...this.textformConfig.fields,];
    this.selectFormConfig.fields = [...this.baseFields, ...this.selectFormConfig.fields];
    this.autocompleteFormConfig.fields = [...this.baseFields, ...this.autocompleteFormConfig.fields];
    this.datepickerFormConfig.fields = [...this.baseFields, ...this.datepickerFormConfig.fields];
    this.radioGroupFormConfig.fields = [...this.baseFields, ...this.radioGroupFormConfig.fields];
    this.sliderFormConfig.fields = [...this.baseFields, ...this.sliderFormConfig.fields];

    effect(() => {
      //console.log('Selected field type is now →', this.selectedConfig());
    });

  }

  ngOnInit() {
    this.outputConfig.set(this.outputFormConfig)
  }

  submitConfig() {
    this.onSubmitConfig.emit(this.outputConfig());
  }

  /**  GROUP AREA ***************************************************************************/

  giveGroupFields(): FormFieldConfig[] {
    const opts = this.outputConfig().fields
      .filter(f => f.type !== 'group' && f.type !== 'multi-row')
      .map(f => ({
        label: f.label,
        value: f.name
      }));
    return [
      {
        type: 'text',
        name: 'groupName',
        label: 'Group Name',
      },
      {
        type: 'select',
        name: 'fields',
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
        name: 'addRowText',
        label: 'Add Row Button Text',
        columns: 2,
        dependsOn: {
          fieldName: 'isMultiplayable',
          disableCondition: (value) => value !== true
        }
      }
    ]

  }

  private openGroupDialog() {
    this.dialogService.openTemplate({
      content: this.groupFormToOutputTmpl,
      header: 'Group',
      panelClass: 'responsive-dialog',
      id: 'group-fields-dialog'
    })
  }

  openNewGroupDialog() {
    this.editingIndex = -1;
    this.groupConfig = { title: '', fields: this.giveGroupFields() }
    this.openGroupDialog();
  }

  openEditGroupDialog(field: FormFieldConfig, type: string) {
    const groupFields = this.giveGroupFields();
    groupFields[0].value = field.label;
    groupFields[1].value = field.fields ? field.fields.map(f => f.name) : [];
    groupFields[2].value = type === 'group' ? false : true;
    groupFields[2].value = type === 'multi-row' ? field.addRow : '';
    this.groupConfig = { fields: groupFields }

    this.openGroupDialog();
  }

  addOrUpdateGroupToOutput(groupFormData: any) {

    const currentFields = [...this.outputConfig().fields];
    const existingFields = this.editingIndex > -1 ? currentFields[this.editingIndex].fields : [];
    const addedFieldNames = new Set(groupFormData['fields']);
    const groupedFields: FormFieldConfig[] = JSON.parse(JSON.stringify(existingFields));
    const remainingFields: FormFieldConfig[] = [];

    currentFields.forEach((field, index) => {

      if (index !== this.editingIndex) {
        if (addedFieldNames.has(field.name)) {
          groupedFields.push(field);
        } else {
          remainingFields.push(field);
        }
      }
    });

    const groupConfig: FormFieldConfig = {
      type: groupFormData.isMultiplayable ? 'multi-row' : 'group',
      name: groupFormData.groupName ?? `group-${Date.now()}`,
      label: groupFormData.groupName ?? 'New Group',
      fields: groupedFields,
      addRow: groupFormData.isMultiplayable ? groupFormData.addRowText : undefined
    };

    const updatesFormFields = [...remainingFields, groupConfig];

    //debugger
    this.outputConfig.update(cfg => ({ ...cfg, fields: updatesFormFields }));
    this.cdr.detectChanges();
    this.dialogService.closeDialogById('group-fields-dialog');

  }

  dropGroupField(event: CdkDragDrop<any[]>) {
    const currentGroup = this.outputConfig().fields[this.editingIndex];

    if (currentGroup?.fields) {
      const updatedFields = [...currentGroup.fields];
      moveItemInArray(updatedFields, event.previousIndex, event.currentIndex);

      // Update outputConfig signal
      this.outputConfig.update(cfg => {
        const updated = [...cfg.fields];
        updated[this.editingIndex] = {
          ...currentGroup,
          fields: updatedFields
        };
        return { ...cfg, fields: updated };
      });
    }
  }

  removeFieldFromGroup(fieldIndex: number) {
    const currentGroup = this.outputConfig().fields[this.editingIndex];

    if (currentGroup?.fields) {
      const updatedFields = currentGroup.fields.filter((_, index) => index !== fieldIndex);

      // Update outputConfig signal
      this.outputConfig.update(cfg => {
        const updated = [...cfg.fields];
        updated[this.editingIndex] = {
          ...currentGroup,
          fields: updatedFields
        };
        return { ...cfg, fields: updated };
      });
    }
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

    this.dialogService.openTemplate({
      content: this.fieldFormToOutputTmpl,
      header: FieldFormConfig.config.title || '',
      panelClass: 'responsive-dialog',
      id: 'form-builder-field-dialog'
    })
  }

  /** DND AREA ****************************************************************************** */

  removeField(index: number): void {
    this.outputConfig.update(cfg => ({
      ...cfg,
      fields: cfg.fields.filter((_, i) => i !== index)
    }));
  }

  editField(field: FormFieldConfig, index: number, groupFieldIndex: number = -1) {

    this.editingIndex = index;
    this.groupFieldEdititngIndex = groupFieldIndex;
    const type = field.type === 'number' || field.type === 'password' || field.type === 'email' ? 'text' : field.type;
    if ((type === 'group' || type === 'multi-row')) {
      this.openEditGroupDialog(field, type);
      return;
    }

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

    this.dialogService.openTemplate({
      content: this.fieldFormToOutputTmpl,
      header: fieldComponent.config.title || '',
      panelClass: 'responsive-dialog',
      id: 'form-builder-field-dialog'
    })

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

    if (this.groupFieldEdititngIndex > -1) {
      const currentConfig = this.outputConfig();
      if (currentConfig.fields[this.editingIndex].fields) {
        currentConfig.fields[this.editingIndex].fields![this.groupFieldEdititngIndex] = fieldConfig;
      }
      this.outputConfig.update(config => ({
        ...config,
        fields: currentConfig.fields
      }))
    }
    else if (this.editingIndex > -1) {
      const currentConfig = this.outputConfig();
      currentConfig.fields[this.editingIndex] = fieldConfig;
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

    this.dialogService.closeDialogById('form-builder-field-dialog');
  }

  testForm(formData: any) {
    this.testFormData = formData;
    this.dialogService.openTemplate({
      content: this.testFormTmpl,
      header: 'Form Data'
    })
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


