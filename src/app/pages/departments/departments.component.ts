import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { DepartmentsVars } from './departments.vars';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../services/dialog.service';
import { FormBuilderComponent } from '../../form-builder/form-builder.component';
import { FormConfig } from '../../form-builder/form-builder.model';
@Component({
  selector: 'app-departments',
  imports: [CommonModule, MatButtonModule, MatIcon, FormBuilderComponent],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent extends DepartmentsVars{

  dialogService = inject(DialogService)
  @ViewChild('departementFormTmpl', { static: true }) departementFormTmpl!: TemplateRef<any>;
  isEdit:boolean = false;

  departmentFormConfig: FormConfig = {
    fields: this.departmentBaseFields,
  }
  departmentFormValues:any = {};


  openDepartmentDialog(index:number = 0){
    if (index > -1) {
      this.departmentFormValues = this.departments[index];
    }
    
    this.departmentFormConfig = {
      fields: this.departmentBaseFields,
    };
    
    this.dialogService.openTemplate({
      panelClass: 'responsive-dialog',
      header: index > -1 ? `Edit Department` : 'Add Department',
      content: this.departementFormTmpl,
      cls: 'bg-purple-500',
    })
  }

}
