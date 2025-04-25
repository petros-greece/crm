import { Component, inject } from '@angular/core';
import { FormConfig } from '../../form-builder/form-builder.model';
import { FormBuilderComponent } from '../../form-builder/form-builder.component';
import { FormBuilderUiComponent } from '../../form-builder/form-builder-ui/form-builder-ui.component';
import { FormBuilderService } from '../../form-builder/form-builder.service';

@Component({
  selector: 'app-settings',
  imports: [FormBuilderComponent, FormBuilderUiComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {


  formBuilderService = inject(FormBuilderService);

  formConfig: FormConfig = {
    title: 'User Registration',
    fields: [

      {
        type: 'select',
        name: 'test',
        label: 'test',
        required: true,
        multiple: false,
        listName: 'Education Degree',
        columns: 2,
  
      },
      {
        type: 'text',
        name: 'fullName',
        label: 'Full Name',
        required: true,
        validators: {
          minLength: 3,
          maxLength: 40,
        },
        columns: 2,
      },
      {
        type: 'email',
        name: 'email',
        label: 'Email Address',
        required: true,
        validators: {
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        columns: 2,
      },
      {
        type: 'password',
        name: 'password',
        label: 'Password',
        required: true,
        validators: {
          pattern: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$'
        },
        columns: 2,
      },
      {
        type: 'number',
        name: 'age',
        label: 'Age',
        required: true,
        step: 1,
        validators: {
          min: 0,
          max: 120
        },
        columns: 2,
      },
      {
        type: 'date',
        name: 'birthDate',
        label: 'Date of Birth',
        appearance: 'fill',
        required: true,
        columns: 2,
      },
      {
        type: 'select',
        name: 'country',
        label: 'Country',
        required: true,
        multiple: false,
        options: [
          { label: 'United States', value: 'US' },
          { label: 'Canada', value: 'CA' },
          { label: 'Germany', value: 'DE' },
          { label: 'India', value: 'IN' }
        ],
        columns: 2,
      },
      {
        type: 'autocomplete',
        name: 'skills',
        label: 'Skills (Autocomplete)',
        options: [
          { label: 'Angular', value: 'angular' },
          { label: 'React', value: 'react' },
          { label: 'Vue', value: 'vue' },
          { label: 'Node.js', value: 'node' },
          { label: 'Python', value: 'python' }
        ],
        required: true,
        columns: 2,
      },
      {
        type: 'chips',
        name: 'interests',
        label: 'Interests',
        options: [
          { label: 'Tech', value: 'tech' },
          { label: 'Art', value: 'art' },
          { label: 'Music', value: 'music' },
          { label: 'Travel', value: 'travel' }
        ],
        appearance: 'fill',
        required: true,
        columns: 2,
      },

      {
        type: 'radio',
        name: 'paymentMethod',
        label: 'Preferred Payment Method',
        appearance: 'outline',
        className: 'flex flex-row gap-4',
        options: [
          { label: 'Credit Card', value: 'cc' },
          { label: 'PayPal', value: 'paypal' },
          { label: 'Bank Transfer', value: 'bank' }
        ],
        required: true,
        columns: 1,
      },
      {
        type: 'slider',
        name: 'satisfaction',
        label: 'Satisfaction Level',
        step: 1,
        value: 50,
        required: true,
        validators: {
          min: 0,
          max: 100
        },
        columns: 2,
      },
      {
        type: 'slider-range',
        name: 'experienceRange',
        label: 'Experience Range (Years)',
        columns: 2,
      },
      {
        type: 'slide-toggle',
        name: 'terms',
        label: 'I agree to the terms and conditions',
        required: true,
      },
      {
        type: 'multi-row',
        name: 'contacts',
        label: 'Emergency Contacts',
        minRows: 1,
        maxRows: 3,
        fields: [
          {
            type: 'text',
            name: 'contactName',
            label: 'Contact Name',
            required: true,
          },
          {
            type: 'text',
            name: 'contactEmail',
            label: 'Contact Email',
          },
          {
            type: 'select',
            name: 'contactType',
            label: 'Contact Type',
            options: [
              { label: 'Personal', value: 'personal' },
              { label: 'Work', value: 'work' }
            ]
          }
        ]
      },
      {
        type: 'file',
        name: 'file',
        label: 'Profile Picture',
        required: true,
      },
      {
        type: 'color',
        name: 'color',
        label: 'Color',
        
      },  
      {
        type: 'textarea',
        name: 'bio',
        label: 'Bio',
        icon: 'info',
      },  
      {
        type: 'icon',
        name: 'icon',
        label: 'icon',
        icon: 'info',
      },   
    ]
  };

  values = {
    "fullName": "Petros",
    "email": "petrostsatsaris@hotmail.com",
    "password": "`12`12",
    "age": "42",
    "birthDate": "2016-02-02T22:00:00.000Z",
    "country": "CA",
    "skills": "node",
    "interests": [
        "tech",
        "guitar",
        "music"
    ],
    "paymentMethod": "paypal",
    "satisfaction": 76,
    "experienceRange": {
        "start": 24,
        "end": 86
    },
    "terms": true,
    "contacts": [
        {
            "contactName": "Mother",
            "contactEmail": "mohter@gmail.com",
            "contactType": "work"
        },
        {
            "contactName": "father",
            "contactEmail": "father@gmail.com",
            "contactType": "work"
        }
    ]
  }
}
