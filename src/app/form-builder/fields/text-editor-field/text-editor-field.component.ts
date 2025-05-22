import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
  selector: 'app-text-editor-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QuillModule
  ],
  template: `
    <div class="w-full">
      <label class="block text-sm font-medium mb-2">
        {{ config.label }}
      </label>
        <!-- [readOnly]="config.readOnly || false"
         [style]="{height: config.height || '200px'}" -->
      <quill-editor
        [formControl]="control"
        [placeholder]="config.placeholder || 'Enter content...'"   
        [modules]="modules"
        class="w-full {{config.className}}"
      ></quill-editor>

      <div class="text-sm text-red-600 mt-1" *ngIf="control.invalid && (control.dirty || control.touched)">
        @if (control.hasError('required')) {
          <span>{{ config.label }} is required</span>
        }
        @if (control.hasError('minlength')) {
          <span>Minimum length is {{ control.getError('minlength').requiredLength }}</span>
        }
        @if (control.hasError('maxlength')) {
          <span>Maximum length is {{ control.getError('maxlength').requiredLength }}</span>
        }
      </div>
    </div>
  `
})
export class TextEditorFieldComponent extends BaseFieldComponent {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };
}
