import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ViewContainerRef, Type, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { FormConfig, FormFieldConfig } from './form-builder.model';
import { SelectFieldComponent } from './fields/select-field.component';
import { AutocompleteFieldComponent } from './fields/autocomplete-field.component';
import { DatepickerFieldComponent } from './fields/datepicker-field.component';
import { RadioGroupFieldComponent } from './fields/radio-group-field.component';
import { SliderFieldComponent } from './fields/slider-field.component';
import { InputFieldComponent } from './fields/input-field.component';
import { MultiRowFieldComponent } from './fields/multi-row-field.component';
import { SlideToggleFieldComponent } from './fields/slide-toggle-field.component';
import { DateRangeFieldComponent } from './fields/date-range-field.component';
import { SliderRangeFieldComponent } from './fields/slider-range-field.component';
import { AutocompleteChipFieldComponent } from './fields/autocomplete-chips-field.component';
import { FileUploadComponent } from './fields/file-upload-field.component';
import { ColorPickerFieldComponent } from './fields/colorpicker-field.component';
import { TextareaFieldComponent } from './fields/textarea-field.component';
import { IconPickerFieldComponent } from './fields/icon-picker-field.component';
import { FormBuilderService } from './form-builder.service';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatToolbar],
  template: `
  <form [formGroup]="formGroup" (ngSubmit)="onSubmit()" class="flex flex-wrap gap-4 p-2" (keydown.enter)="$event.preventDefault()" [ngClass]="config.className"> 
    <mat-toolbar class="flex flex-grow justify-center mt-3" *ngIf="config.title"> 
      <h2>{{ config.title }}</h2>    
    </mat-toolbar>  
    <ng-container #gridItem></ng-container>  
    <div class="flex flex-row justify-center w-full">
      <button mat-raised-button type="submit">{{ config.submitText || 'Submit' }}</button>
    </div>  
  </form>
  `
})
export class FormBuilderComponent implements AfterViewInit {
  /** emit form value on submit */
  @Output() submitHandler = new EventEmitter<any>();

  // inputs as writable signals
  private readonly _config = signal<FormConfig>({ fields: [] });
  @Input() set config(v: FormConfig) { this._config.set(v); }
  get config(): FormConfig { return this._config(); }

  private readonly _values = signal<Record<string, any>>({});
  @Input() set values(v: Record<string, any>) { this._values.set(v); }
  get values(): Record<string, any> { return this._values(); }

  formGroup = new FormGroup({});
  @ViewChild('gridItem', { read: ViewContainerRef }) gridItem!: ViewContainerRef;

  private formBuilderService = inject(FormBuilderService);

  constructor() {
    // reactively rebuild form when config or values change
    effect(() => {
      const cfg = this._config();
      const vals = this._values();
      const updated = this.applyValuesToFormConfig(cfg, vals);
      this.buildForm(updated);
      Promise.resolve().then(() => this.buildFields(updated));
    });
  }

  ngAfterViewInit() {}

  private applyValuesToFormConfig(
    config: FormConfig,
    values: Record<string, any>
  ): FormConfig {
    const updatedFields: FormFieldConfig[] = config.fields.map(field => {
      const clone: FormFieldConfig = { ...field };
      if (field.listName) {
        clone.dynamicOptions = this.formBuilderService.getListOptions(field.listName);
      }
      const fieldValue = values[field.name];
      if (fieldValue !== undefined) {
        if (field.type === 'multi-row' && Array.isArray(fieldValue)) {
          clone.value = fieldValue;
        } else if (
          (field.type === 'slider-range' || field.type === 'range-picker') &&
          typeof fieldValue === 'object'
        ) {
          clone.value = { start: fieldValue.start ?? null, end: fieldValue.end ?? null };
        } else {
          clone.value = fieldValue;
        }
      }
      return clone;
    });
    return { ...config, fields: updatedFields };
  }

  private buildForm(config: FormConfig) {
    const group: Record<string, any> = {};
    config.fields.forEach(field => {
      const val = field.value ?? null;
      if (field.type === 'multi-row') {
        const arr = new FormArray<any>([]);
        (Array.isArray(val) ? val : [undefined]).forEach(row => arr.push(this.createRowGroup(field, row)));
        group[field.name] = arr;
      } else if (field.type === 'range-picker' || field.type === 'slider-range') {
        group[field.name] = new FormGroup({ start: new FormControl(val?.start ?? null), end: new FormControl(val?.end ?? null) });
      } else {
        group[field.name] = new FormControl(val, this.getValidators(field));
      }
    });
    this.formGroup = new FormGroup(group);
  }

  private createRowGroup(field: FormFieldConfig, rowValues?: any) {
    const group: Record<string, FormControl> = {};
    field.fields?.forEach(sub => {
      group[sub.name] = new FormControl(rowValues?.[sub.name] ?? sub.value ?? '', this.getValidators(sub));
    });
    return new FormGroup(group);
  }

  private buildFields(config: FormConfig) {
    this.gridItem.clear();
    const gap = 1;
    config.fields.forEach(field => {
      const comp = this.resolveFieldComponent(field.type);
      const ctrl = this.formGroup.get(field.name)!;
      const ref = this.gridItem.createComponent(comp);
      ref.instance.config = field;
      ref.instance.control = ctrl;
      const cols = field.columns || 1;
      const basis = window.innerWidth < 700
        ? '100%'
        : `calc((100% - ${(cols - 1) * gap}rem) / ${cols})`;
      const el = ref.location.nativeElement as HTMLElement;
      el.style.flex = `0 0 ${basis}`;
      el.style.maxWidth = basis;
    });
  }

  private getValidators(field: FormFieldConfig) {
    const v: any[] = [];
    if (field.required) v.push(Validators.required);
    if (field.validators) {
      const f = field.validators;
      f.minLength && v.push(Validators.minLength(f.minLength));
      f.maxLength && v.push(Validators.maxLength(f.maxLength));
      f.pattern   && v.push(Validators.pattern(f.pattern));
      f.min       && v.push(Validators.min(f.min));
      f.max       && v.push(Validators.max(f.max));
    }
    return v;
  }

  private resolveFieldComponent(type: string): Type<any> {
    switch (type) {
      case 'select':       return SelectFieldComponent;
      case 'autocomplete': return AutocompleteFieldComponent;
      case 'date':         return DatepickerFieldComponent;
      case 'radio':        return RadioGroupFieldComponent;
      case 'slider':       return SliderFieldComponent;
      case 'multi-row':    return MultiRowFieldComponent;
      case 'slide-toggle': return SlideToggleFieldComponent;
      case 'range-picker': return DateRangeFieldComponent;
      case 'slider-range': return SliderRangeFieldComponent;
      case 'chips':        return AutocompleteChipFieldComponent;
      case 'file':         return FileUploadComponent;
      case 'color':        return ColorPickerFieldComponent;
      case 'textarea':     return TextareaFieldComponent;
      case 'icon':         return IconPickerFieldComponent;
      default:             return InputFieldComponent;
    }
  }

  onSubmit() {
  console.log(this.formGroup.valid);
    if (this.formGroup.valid) {
      this.submitHandler.emit(this.formGroup.value);
      this.formGroup.reset();
      this.formGroup.markAsUntouched();
      this.formGroup.markAsPristine();
    } 
    else {
      this.formGroup.markAllAsTouched();
    }
  }
}
