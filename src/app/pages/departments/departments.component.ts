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
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { SnackbarService } from '../../services/snackbar.service';
import { EntityFieldsService } from '../../services/entity-fields.service';
import { Subject, takeUntil } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';


@Component({
  selector: 'app-departments',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIcon,
    FormBuilderComponent,
    MatTabsModule,
    MatMenuModule,
    PageHeaderComponent,
    MatExpansionModule
  ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent extends DepartmentsVars implements OnInit {

  private destroy$ = new Subject<void>();

  dialogService = inject(DialogService);
  dataService = inject(DataService);
  snackbarService = inject(SnackbarService);
  entityFieldsService = inject(EntityFieldsService);
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
  @ViewChild('departmentPreviewTmpl', { static: true }) departmentPreviewTmpl!: TemplateRef<any>;
  @ViewChild('departmentFormTmpl', { static: true }) departmentFormTmpl!: TemplateRef<any>;

  departmentFormConfig: FormConfig = {
    fields: this.departmentBaseFields,
  }

  formConfig: FormConfig = {
    fields: [
      { type: 'autocomplete', name: 'employee', label: 'Select employee', dynamicOptions: this.dataService.getEmployeeOptions(), columns: 1, defaultValue: ''}
    ],
    submitText: 'Add',
    resetOnSubmit: true
  }

  selectEmployeeFormConfig: FormConfig = {...this.formConfig};

  departmentFormValues: any = {};
  departmentRoles: any = [];
  isEditDepartment = false;

  extraForms: any = [];

  resetForm(){
    this.selectEmployeeFormConfig = {...this.formConfig};   
  }

  ngOnInit(): void {
    this.dataService.getDepartments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(d => this.departments = d);

    this.entityFieldsService.getEntityFields('department')
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: any) => {
        this.extraForms = resp;
      });

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addEmployeeToRole(event: any, role: string) {

    console.log(event.employee, this.departmentFormValues.label, role);
    this.dataService.updateEmployeeRole(event.employee, this.departmentFormValues.label, role).subscribe(e => {

      if(!e || !e.id){
        return;
      }

      let foundInAnotherDepartment = false;
      this.departmentRoles.forEach((rObj: any) => {

        if (!foundInAnotherDepartment) {
          for (let i = 0, len = rObj.employees.length; i < len; i += 1) {

            let empl = rObj.employees[i];
            if (empl.id === event.employee) {
              rObj.employees.splice(i, 1);
              foundInAnotherDepartment = true;
            }
          }
        }

        if (rObj.role === role) {
          rObj.employees.push(e);
        }
      });



    });

  }

  openAddDepartmentDialog() {
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

  openPreviewDepartmentDialog(index: number) {
    const department = this.departments[index];
    this.departmentFormValues = department;
    this.departmentFormConfig = {
      fields: this.departmentBaseFields,
      submitText: 'Update'
    };
    this.departmentRoles = [...this.departmentFormValues.roles];

    this.dataService.getEmployeesForDepartment(this.departments[index].label)
      .pipe(takeUntil(this.destroy$))
      .subscribe(employees => {
        this.departmentRoles.forEach((rObj: any) => {
          rObj.employees = employees.filter((e) => e.role === rObj.role);
        });
        this.dialogService.openTemplate({
          panelClass: 'responsive-dialog',
          header: `Department: ${department.label}`,
          icon: department.icon,
          content: this.departmentPreviewTmpl,
        })
      });

  }

  addOrUpdateDepartment(formData: any) {
    formData.value = this.toCamelCaseMachineName(formData.label);
    formData.id ? this.updateDepartment(formData) : this.addDepartment(formData);
  }

  private addDepartment(formData: any) {
    if (!formData.icon) formData.icon = 'store';
    formData.id = `${new Date().getTime()}`
    this.dataService.addDepartment(formData).subscribe((res) => {
      this.onAfterSubmit(res, `Department ${this.departmentFormValues.label} added succesfully`);
    })
  }

  private updateDepartment(formData: any) {
    this.dataService.updateDepartment(formData).subscribe((res) => {
      this.onAfterSubmit(res, `Department ${this.departmentFormValues.label} updated succesfully`);
    })
  }

  private get canDeleteDepartment(): boolean {
    return this.departmentRoles.every((role: any) => role.employees.length === 0);
  }

  openConfirmDeleteDepartmentDialog() {

    this.dialogService.openConfirm({
      cls: 'bg-red-500 !text-white',
      header: 'Remove Department?',
      content: `Are you sure you want to remove the department: "${this.departmentFormValues.label}"?`,
    })
      .subscribe(confirmed => {
        if (confirmed === true) {
          if (!this.canDeleteDepartment) {
            this.snackbarService.showSnackbar(`Department "${this.departmentFormValues.label}" cannot be deleted because it has employees.`);
            return;
          }

          this.dataService.deleteDepartment(this.departmentFormValues.id).subscribe((res) => {
            this.onAfterSubmit(res, `Department ${this.departmentFormValues.label} deleted succesfully`);
          })
        }
      });
  }

  updateDepartmentExtraFields(formData: any, title: string) {
    //console.log(formData, title);
    const id = this.departmentFormValues.id;
    this.dataService.updateDepartmentSection(id, title, formData).subscribe((res) => {
      this.onAfterSubmit(res, `Department section "${title}" updated successfully`);
    })
  }

  /** HELPERS ****************************************************************************** */

  private onAfterSubmit(res: any, message: string) {
    this.dialogService.closeAll();
    this.departments = res;
    this.snackbarService.showSnackbar(message);
  }

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
