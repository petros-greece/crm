import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ViewContainerRef, Type, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { FieldType, FormConfig, FormFieldConfig, Option } from './form-builder.model';
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
import { MatIcon } from '@angular/material/icon';
import { GroupFieldComponent } from './fields/group-field.component';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, of, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { InputHiddenFieldComponent } from './fields/input-hidden-field.component';
import { TextEditorFieldComponent } from './fields/text-editor-field.component';
@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatToolbar, MatIcon],
  template: `
  <form [formGroup]="formGroup" (ngSubmit)="onSubmit()" class="flex flex-wrap gap-4" (keydown.enter)="$event.preventDefault()" [ngClass]="config.className"> 
    <mat-toolbar class="flex flex-grow justify-center mt-3" *ngIf="config.title"> 
      <h2>{{ config.title }}</h2>
      <mat-icon *ngIf="config.icon">{{ config.icon }}</mat-icon>   
    </mat-toolbar>  
    <ng-container #gridItem></ng-container>  
    <div class="flex flex-row justify-center w-full" *ngIf="config.hideSubmit === undefined">
      <button mat-raised-button type="submit" [disabled]="formGroup.pristine">{{ config.submitText || 'Submit' }}</button>
    </div>  
  </form>
  `
})
export class FormBuilderComponent implements AfterViewInit {
  /** emit form value on submit */
  @Output() submitHandler = new EventEmitter<any>();
  @Output() formValuesChange = new EventEmitter<Record<string, any> | null>();
  // inputs as writable signals
  private readonly _config = signal<FormConfig>({ fields: [] });
  @Input() set config(v: FormConfig) { this._config.set(v); }
  get config(): FormConfig { return this._config(); }

  private readonly _values = signal<Record<string, any>>({});
  @Input() set values(v: Record<string, any>) { this._values.set(v); }
  get values(): Record<string, any> { return this._values(); }

  formGroup = new FormGroup({});
  @ViewChild('gridItem', { read: ViewContainerRef }) gridItem!: ViewContainerRef;
  private destroy$ = new Subject<void>();
  private formBuilderService = inject(FormBuilderService);

  constructor(private cdr: ChangeDetectorRef) {
    // reactively rebuild form when config or values change
    effect(() => {
      const cfg = this._config();
      const vals = this._values();
      const updated = this.applyValuesToFormConfig(cfg, vals);
      this.buildForm(updated);
      Promise.resolve().then(() => this.buildFields(updated));
    });
  }

  ngAfterViewInit() {
    if (this.formValuesChange) {
      this.formGroup.valueChanges
        .pipe(debounceTime(200), distinctUntilChanged())
        .subscribe(vals => {
          //console.log('Form changed:', vals);
          this.formValuesChange.emit(vals);
        });
    }
  }

  public patchFormValues(vals: Record<string, any>) {
    if (this.formGroup) {
      this.formGroup.patchValue(vals);
    }
  }

  private applyValuesToFormConfig(
    config: FormConfig,
    values: Record<string, any>
  ): FormConfig {
    const updatedFields: FormFieldConfig[] = config.fields.map(field => {
      const clone: FormFieldConfig = { ...field };
      if (field.listName) {
        clone.dynamicOptions = this.formBuilderService.getListOptions(field.listName);
      }
      if (field.fields) {
        field.fields.forEach(f => {
          if (f.listName) {
            f.dynamicOptions = this.formBuilderService.getListOptions(f.listName);
          }
        });
      }


      const fieldValue = values[field.name] || field.defaultValue;
      if (fieldValue !== undefined) {
        if (field.type === 'multi-row' && Array.isArray(fieldValue)) {
          clone.value = fieldValue;
        }
        else if (
          (field.type === 'slider-range' || field.type === 'range-picker' || field.type === 'group') &&
          typeof fieldValue === 'object'
        ) {
          clone.value = { start: fieldValue.start ?? null, end: fieldValue.end ?? null };
        }
        else {
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
      }
      else if (field.type === 'group') {
        group[field.name] = this.createNestedGroup(field, val);
      }
      else if (field.type === 'range-picker' || field.type === 'slider-range') {
        group[field.name] = new FormGroup({ start: new FormControl(val?.start ?? null), end: new FormControl(val?.end ?? null) });
      }
      else {
        group[field.name] = new FormControl(val, this.getValidators(field));
      }
      if (field.dependsOn) {
        field.dynamicOptions = of([]);
      }

    });

    this.formGroup = new FormGroup(group);

    config.fields.forEach(field => {
      if (field.dependsOn?.updateOptions) {
        const parentControl = this.formGroup.get(field.dependsOn.fieldName);
        if (parentControl) {
          const optionsSubject = new BehaviorSubject<Option[]>(field.options || []);

          parentControl.valueChanges.pipe(
            takeUntil(this.destroy$),
            startWith(parentControl.value),
            distinctUntilChanged(),
            switchMap(value => {
              try {
                if (field.dependsOn && typeof field.dependsOn.updateOptions === 'function') {
                  const result = field.dependsOn.updateOptions(value);
                  return this.normalizeOptions(result);
                }
                return of([]);
              } catch {
                return of([]);
              }
            })
          ).subscribe({
            next: options => {
              optionsSubject.next(options);
              this.safeUpdateControlValue(field.name, options);
            },
            error: () => optionsSubject.next([])
          });

          field.dynamicOptions = optionsSubject.asObservable();
        }
      }
      if (field.dependsOn?.disableCondition || field.dependsOn?.disableConditionValue) {
        const parentControl = this.formGroup.get(field.dependsOn.fieldName);
        const dependentControl = this.formGroup.get(field.name);
        if (parentControl && dependentControl) {
          parentControl.valueChanges.pipe(
            takeUntil(this.destroy$),
            startWith(parentControl.value),
            distinctUntilChanged()
          ).subscribe(value => {
            const disableCondition = (value: any) =>
              field.dependsOn?.disableCondition
                ? field.dependsOn.disableCondition(value)
                : value !== field.dependsOn?.disableConditionValue;
            const shouldDisable = disableCondition(value);
            if (shouldDisable && !dependentControl.disabled) {
              dependentControl.disable({ emitEvent: false });
            } else if (!shouldDisable && dependentControl.disabled) {
              dependentControl.enable({ emitEvent: false });
            }
          });
        }
      }
    });
  }

  private normalizeOptions(result: any): Observable<Option[]> {
    if (Array.isArray(result)) return of(result);
    if (result instanceof Observable) return result;

    return of([]);
  }

  private safeUpdateControlValue(fieldName: string, options: Option[]) {
    const control = this.formGroup.get(fieldName);
    if (!control) return;

    const currentValue = control.value;
    const isValid = options.some(o => o.value === currentValue);

    if (!isValid) {
      control.reset(null, { emitEvent: false });
    }
  }

  private createRowGroup(field: FormFieldConfig, rowValues?: any) {
    const group: Record<string, FormControl> = {};
    field.fields?.forEach(sub => {
      group[sub.name] = new FormControl(rowValues?.[sub.name] ?? sub.value ?? '', this.getValidators(sub));
    });
    return new FormGroup(group);
  }

  private createNestedGroup(field: FormFieldConfig, initialValues: any): FormGroup {
    const fg: Record<string, FormControl> = {};
    field.fields?.forEach(sub => {
      const subVal = initialValues?.[sub.name] ?? sub.value ?? null;
      fg[sub.name] = new FormControl(subVal, this.getValidators(sub));
    });

    return new FormGroup(fg);
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

    const el = ref.location.nativeElement as HTMLElement;

    if (field.type === 'hidden') {
      // Ensure it's rendered but doesn't occupy space
      el.style.display = 'none';
    } else {
      const cols = field.columns || 1;
      const basis = window.innerWidth < 700
        ? '100%'
        : `calc((100% - ${(cols - 1) * gap}rem) / ${cols})`;

      el.style.flex = `0 0 ${basis}`;
      el.style.maxWidth = basis;
    }
  });
}


  private getValidators(field: FormFieldConfig) {
    const v: any[] = [];
    if (field.required) v.push(Validators.required);
    if (field.validators) {
      const f = field.validators;
      f.minLength && v.push(Validators.minLength(f.minLength));
      f.maxLength && v.push(Validators.maxLength(f.maxLength));
      f.pattern && v.push(Validators.pattern(f.pattern));
      f.min && v.push(Validators.min(f.min));
      f.max && v.push(Validators.max(f.max));
    }
    return v;
  }

  private resolveFieldComponent(type: FieldType): Type<any> {
    switch (type) {
      case 'select': return SelectFieldComponent;
      case 'autocomplete': return AutocompleteFieldComponent;
      case 'date': return DatepickerFieldComponent;
      case 'radio': return RadioGroupFieldComponent;
      case 'slider': return SliderFieldComponent;
      case 'multi-row': return MultiRowFieldComponent;
      case 'slide-toggle': return SlideToggleFieldComponent;
      case 'range-picker': return DateRangeFieldComponent;
      case 'slider-range': return SliderRangeFieldComponent;
      case 'chips': return AutocompleteChipFieldComponent;
      case 'file': return FileUploadComponent;
      case 'color': return ColorPickerFieldComponent;
      case 'textarea': return TextareaFieldComponent;
      case 'icon': return IconPickerFieldComponent;
      case 'group': return GroupFieldComponent;
      case 'hidden': return InputHiddenFieldComponent;
      case 'text-editor': return TextEditorFieldComponent;
      default: return InputFieldComponent;
    }
  }

  onSubmit() {
    console.log(this.formGroup);
    if (this.formGroup.valid) {
      this.submitHandler.emit(this.formGroup.value);
      if (this.config.resetOnSubmit) {
        this.formGroup.reset();
        this.formGroup.markAsUntouched();
        this.formGroup.markAsPristine();
      }
    }
    else {
      this.formGroup.markAllAsTouched();
    }
  }

}
