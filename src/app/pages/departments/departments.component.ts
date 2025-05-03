import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DepartmentsVars } from './departments.vars';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../services/dialog.service';
import { FormBuilderComponent } from '../../form-builder/form-builder.component';
import { FormConfig } from '../../form-builder/form-builder.model';
import { DataService } from '../../services/data.service';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-departments',
  imports: [CommonModule, MatButtonModule, MatIcon, FormBuilderComponent, MatTabsModule],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent extends DepartmentsVars implements OnInit{

  dialogService = inject(DialogService)
  dataService = inject(DataService);
  @ViewChild('departmentPreviewTmpl', { static: true }) departmentPreviewTmpl!: TemplateRef<any>;
  @ViewChild('departmentFormTmpl', { static: true }) departmentFormTmpl!: TemplateRef<any>;

  departmentFormConfig: FormConfig = {
    fields: this.departmentBaseFields,
  }

  selectEmployeeFormConfig: FormConfig = {
    hideSubmit: false,
    fields: [{ type: 'autocomplete', name: 'employee', label: 'Add Employee', dynamicOptions: this.dataService.getEmployeeOptions(),columns: 1, }],  
  }

  departmentFormValues:any = {};
  departmentRoles:any = [];
  isEditDepartment = false;
  showForm: { [role: string]: boolean } = {};

  toggleForm(role: string): void {
    this.showForm[role] = !this.showForm[role];
    Object.keys(this.showForm).forEach(key => {
      if (key !== role) this.showForm[key] = false;
    });
  }

  ngOnInit(): void {
    this.dataService.getDepartments().subscribe(d=>this.departments=d);
  }

  addEmployeeToRole(event:any, role:string){
    console.log(event.employee, this.departmentFormValues.id, role);
    this.dataService.updateEmployeeRole(event.employee, this.departmentFormValues.id, role).subscribe(e=>{

      Object.keys(this.showForm).forEach(key => {
        this.showForm[key] = false;
      });

      let foundInAnotherDepartment = false;
      this.departmentRoles.forEach((rObj:any) => {

        if(!foundInAnotherDepartment){
          for(let i=0, len = rObj.employees.length; i < len; i+=1){
            let empl = rObj.employees[i];
            if(empl.id === event.employee){
              rObj.employees.splice(i, 1);
              foundInAnotherDepartment = true;
            }
          }
        }

        if( rObj.role === role){
          rObj.employees.push(e);
        }
      });


    });

  }

  openAddDepartmentDialog(){
    this.departmentFormValues = {};  
    this.departmentFormConfig = {
      fields: this.departmentBaseFields,
      submitText: 'Add'
    };

    this.dialogService.openTemplate({
      panelClass: 'responsive-dialog',
      header: 'Add Department',
      content: this.departmentFormTmpl,
      cls: '!bg-violet-800 !text-white',
    })
  }

  openPreviewDepartmentDialog(index:number){
    const department = this.departments[index]; 
    this.departmentFormValues = department;  
    this.departmentFormConfig = {
      fields: this.departmentBaseFields,
      submitText: 'Update'
    };
    this.departmentRoles = [...this.departmentFormValues.roles];

    this.dataService.getEmployeesForDepartment(this.departments[index].id).subscribe(employees=>{
      this.departmentRoles.forEach((rObj:any) => {
        rObj.employees = employees.filter((e)=> e.role === rObj.role);
      });
      this.dialogService.openTemplate({
        panelClass: 'responsive-dialog',
        header: `<em>Department</em>: ${department.label}`,
        icon:  department.icon,
        content: this.departmentPreviewTmpl,
        cls: 'bg-violet-800 !text-white',
      })
    });

  }

  addOrUpdateDepartment(formData:any){
    console.log('addOrUpdateDepartment', formData);
    formData.value = this.toCamelCaseMachineName(formData.label);
    formData.id ? this.updateDepartment(formData) : this.addDepartment(formData);
  }

  addDepartment(formData:any){
    if(!formData.icon) formData.icon = 'store';
    formData.id = `${new Date().getTime()}`
    this.dataService.addDepartment(formData).subscribe((res)=>{
      this.departments = res;
    })
  }

  updateDepartment(formData:any){
    this.dataService.updateDepartment(formData).subscribe((res)=>{
      this.departments = res;
    })
  }

  deleteDepartment(formData:any){
    this.dataService.updateDepartment(formData.id).subscribe((res)=>{
      this.departments = res;
    })
  }

  openConfirmDeleteDepartmentDialog(){
    this.dialogService.openConfirm({
      cls: 'bg-red-500',
      header: 'Remove Department?',
      content: `Are you sure you want to remove the department: ${this.departmentFormValues.name}?`,
    })
      .subscribe(confirmed => {
        if (confirmed === true) {
          this.dataService.deleteDepartment(this.departmentFormValues.id).subscribe((res)=>{
            this.departments = res;
            this.dialogService.closeAll();
          })
        }
      });
  }


  /** HELPERS ****************************************************************************** */


  private toCamelCaseMachineName(input: string): string {
    if (!input) return this.generateRandomName();

    const machineName = input
      .toLowerCase()
      .replace(/[^a-z0-9\u00C0-\u017F]/gi, ' ')
      .trim()
      .split(/\s+/)
      .map((word, index) =>
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join('');

    return machineName || this.generateRandomName();
  }

  private generateRandomName(): string {
    const prefix = 'random';
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomPart = '';

    for (let i = 0; i < 8; i++) {
      randomPart += chars[Math.floor(Math.random() * chars.length)];
    }

    return prefix + randomPart;
  }

}
