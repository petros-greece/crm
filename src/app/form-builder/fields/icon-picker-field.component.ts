import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { FormBuilderService } from '../form-builder.service';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

interface IconCategory {
  name: string;
  key: string;
  icons: string[];
}

@Component({
  selector: 'app-icon-picker-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    MatExpansionModule
  ],
  template: `
    <div class="flex flex-col items-center justify-center h-full w-full">
      <button mat-stroked-button (click)="openSelectIconDialog()">
        {{ config.label || 'Select Icon' }}
        <mat-icon *ngIf="control.value">
          {{ control.value }}
        </mat-icon> 
      </button>
    </div>

    <ng-template #selectIconTmpl>
      <mat-accordion>
        <mat-expansion-panel *ngFor="let category of icons">
          <mat-expansion-panel-header>
            <mat-panel-title>
            {{ category.name | titlecase }}
            </mat-panel-title>
          </mat-expansion-panel-header>

          <div class="icon-list">
            <!-- <button mat-mini-fab *ngFor="let icon of category.icons" (click)="selectIcon(icon)">
              <mat-icon class="icon-item">
                {{ icon }}
              </mat-icon> 
            </button> -->
            <mat-icon 
              class="m-2 transition-transform transform hover:scale-125 duration-200 ease-in-out cursor-pointer"
              *ngFor="let icon of category.icons"
              (click)="selectIcon(icon)">
              {{ icon }}
            </mat-icon>
          </div>
        </mat-expansion-panel>
      </mat-accordion>
    </ng-template>


  `
})
export class IconPickerFieldComponent extends BaseFieldComponent {
  
  @ViewChild('selectIconTmpl', { static: true }) selectIconTmpl!: TemplateRef<any>;
  icons: IconCategory[]  = [];
  constructor(
    public dialog: MatDialog,
    private builderService: FormBuilderService,
  ) { super(); }
  private selectIconDialogRef!: MatDialogRef<DialogComponent>; 

  openSelectIconDialog(): void {

    this.builderService.getIcons().subscribe((icons) => {
      
      this.icons = icons.categories;
      this.selectIconDialogRef =  this.dialog.open(DialogComponent, {
        data: {
          content: this.selectIconTmpl,
          header: 'Select Icon',
          cls: ''
        },
        minWidth: '80vw',
        maxWidth: '769px',
      });

    })

  }

  selectIcon(icon: string): void {
    this.control.setValue(icon);
    if (this.selectIconDialogRef) {
      this.selectIconDialogRef.close(); // <-- Close only this dialog
    }
  }


}