import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { FormConfig, FormFieldConfig } from './form-builder/form-builder.model';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormBuilderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  formConfig: FormConfig = {
    title: 'User Registration',
    fields: [
      {
        type: 'select',
        name: 'country',
        label: 'Country',
        required: true,
        options: [
          { label: 'USA', value: 'US' },
          { label: 'Canada', value: 'CA' }
        ]
      }
    ] 
  }
}
