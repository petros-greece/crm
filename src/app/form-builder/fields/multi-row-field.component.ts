import { Component, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormArray,
  FormGroup,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InputFieldComponent } from './input-field.component';
import { SelectFieldComponent } from './select-field.component';

@Component({
  selector: 'app-multi-row-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    InputFieldComponent,
    SelectFieldComponent
  ],
  template: `
    <div class="multi-row-container">
      <div class="row-header">
        <h4>{{ config.label }}</h4>
        <button mat-stroked-button 
                type="button"
                color="primary" 
                (click)="addRow()"
                [disabled]="!canAdd">
          <mat-icon>add</mat-icon>
          Add Row
        </button>
      </div>
      <div>
        <div class="row-container " *ngFor="let row of rows.controls; index as i">
          <div class="fields-container">
            <div *ngFor="let field of config.fields" class="field-wrapper">
              <ng-container [ngSwitch]="field.type">
                <app-input-field *ngSwitchCase="'text'"
                  [config]="field"
                  [control]="getRowControl(i, field.name)">
                </app-input-field>

                <app-select-field *ngSwitchCase="'select'"
                  [config]="field"
                  [control]="getRowControl(i, field.name)">
                </app-select-field>
              </ng-container>
            </div>
          </div>

          <button mat-icon-button 
                  color="warn" 
                  (click)="removeRow(i)"
                  [disabled]="!canRemove">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .multi-row-container {
      margin: 24px 0;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 16px;
    }

    .row-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .row-container {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      margin-bottom: 16px;
      padding: 16px;
      border: 1px solid #eee;
      border-radius: 4px;
    }

    .fields-container {
      flex-grow: 1;
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }

    .field-wrapper {
      min-width: 200px;
    }
  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiRowFieldComponent),
    multi: true
  }]
})
export class MultiRowFieldComponent extends BaseFieldComponent<FormArray> implements OnInit {
  
  // override ngOnInit(): void {
  //   super.ngOnInit();

  //   // Ensure at least one row exists
  //   if (this.rows.length === 0) {
  //     this.addRow();
  //   }
  // }

  get rows(): FormArray {
    return this.control;
  }

  getRowControl(rowIndex: number, fieldName: string): FormControl {
    const group = this.rows.at(rowIndex);
    if (!(group instanceof FormGroup)) {
      throw new Error(`Expected FormGroup at index ${rowIndex}`);
    }
    const control = group.get(fieldName);
    if (!(control instanceof FormControl)) {
      throw new Error(`Expected FormControl for field ${fieldName}`);
    }
    return control;
  }

  addRow() {
    const group: { [key: string]: FormControl } = {};
    this.config.fields?.forEach(field => {
      group[field.name] = new FormControl(field.value || '');
    });
    this.rows.push(new FormGroup(group));
  }

  removeRow(index: number) {
    this.rows.removeAt(index);
  }

  get canAdd(): boolean {
    return true; // Add your own logic if needed
  }

  get canRemove(): boolean {
    return this.rows.length > 1;
  }
}
