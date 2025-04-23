import { Component, Input, OnInit, AfterViewInit, ViewChild, ViewContainerRef, Type, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FormConfig, FormFieldConfig } from './form-builder.model';
import { SelectFieldComponent } from './fields/select-field.component';

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
    // Create form controls for each field
    this.config.fields.forEach(field => {
      const validators = this.getValidators(field);
      const control = new FormControl(field.value || '', validators);
      this.formGroup.addControl(field.name, control);
    });
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
      default: throw new Error(`Unsupported field type: ${type}`);
    }
  }

  onSubmit() {
    if (this.formGroup.valid) {
      console.log('Form Submitted:', this.formGroup.value);
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}
