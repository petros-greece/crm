import { Component, Input, OnInit, AfterViewInit, ViewChild, ViewContainerRef, Type, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FormConfig, FormFieldConfig } from './form-builder.model';
import { SelectFieldComponent } from './fields/select-field.component';
import { AutocompleteFieldComponent } from './fields/autocomplete-field.component';
import { AutocompleteChipFieldComponent } from './fields/autocomplete-chips-field.component';
import { DatepickerFieldComponent } from './fields/datepicker-field.component';
import { RadioGroupFieldComponent } from './fields/radio-group-field.component';
import { SliderFieldComponent } from './fields/slider-field.component';
import { InputFieldComponent } from './fields/input-field.component';
import { MultiRowFieldComponent } from './fields/multi-row-field.component';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
      <ng-container #fieldContainer></ng-container>
      <button mat-raised-button type="submit">{{ config.submitText || 'Submit' }}</button>
    </form>
  `
})
export class FormBuilderComponent implements OnInit, AfterViewInit {
  @Input() config: FormConfig = { fields: [] };
  formGroup = new FormGroup({});

  @ViewChild('fieldContainer', { read: ViewContainerRef }) fieldContainer!: ViewContainerRef;

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    // Initialize form controls without rendering the fields yet
    this.buildForm();
  }

  ngAfterViewInit() {
    // Dynamically render the form fields after the view is initialized
    this.buildFields();
  }

  buildForm() {
    const formGroup: { [key: string]: any } = {};
  
    this.config.fields.forEach(field => {
      if (field.type === 'multi-row') {
        // Create FormArray for multiple rows
        const rowArray = new FormArray<any>([],  { updateOn: 'change' }); 
        formGroup[field.name] = rowArray;
      } else {
        // Regular field handling
        const validators = this.getValidators(field);
        formGroup[field.name] = new FormControl(
          field.value || '', 
          validators
        );
      }
    });
  
    this.formGroup = new FormGroup(formGroup);
  }

  buildFields() {
    this.config.fields.forEach(field => {
      const componentType = this.resolveFieldComponent(field.type);
      const control = this.formGroup.get(field.name);
  
      if (componentType && control) {
        const componentRef = this.fieldContainer.createComponent(componentType);
        
        // Set inputs directly on the component instance
        componentRef.instance.config = field;
        componentRef.instance.control = control;
        
        // Manually trigger change detection
        componentRef.changeDetectorRef.detectChanges();
      }
    });
  }

  private getValidators(field: FormFieldConfig) {
    const validators = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.validators) {
      if (field.validators.minLength !== undefined) {
        validators.push(Validators.minLength(field.validators.minLength));
      }
      if (field.validators.maxLength !== undefined) {
        validators.push(Validators.maxLength(field.validators.maxLength));
      }
      if (field.validators.pattern) {
        validators.push(Validators.pattern(field.validators.pattern));
      }
      if (field.validators.min !== undefined) {
        validators.push(Validators.min(field.validators.min));
      }
      if (field.validators.max !== undefined) {
        validators.push(Validators.max(field.validators.max));
      }
    }

    return validators;
  }

  resolveFieldComponent(type: string): Type<any> {
    switch (type) {
      // Uncomment and add components as needed
      // case 'text': return TextFieldComponent;
      case 'select': return SelectFieldComponent;
      case 'autocomplete': return AutocompleteFieldComponent;
      case 'chips': return AutocompleteChipFieldComponent; // Assuming you have a ChipsFieldComponent
      case 'date': return DatepickerFieldComponent; // Replace with your DateFieldComponent
      case 'radio': return RadioGroupFieldComponent;
      case 'slider': return SliderFieldComponent; // Assuming you have a SliderFieldComponent
      case 'number': case 'text': case 'password': return InputFieldComponent; // Replace with your NumberFieldComponent
      case 'multi-row': return MultiRowFieldComponent; // Assuming you have a MultiRowFieldComponent
      default: throw new Error(`Unsupported field type: ${type}`);
    }
  }

  onSubmit() {
    console.log( this.formGroup.value);

    if (this.formGroup.valid) {
      console.log('Form Submitted:', this.formGroup.value);
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}
