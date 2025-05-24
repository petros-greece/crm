import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilderComponent } from '../../../../form-builder/form-builder.component';
import { FormConfig } from '../../../../form-builder/form-builder.model';
import { DataService } from '../../../../services/data.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from '../../../../components/dialog/dialog.service';
import { MatIcon } from '@angular/material/icon';

type Perm = 'r' | 'c' | 'u' | 'd';

@Component({
  selector: 'app-roles-form',
  imports: [CommonModule, FormBuilderComponent, MatButtonModule, MatIcon],
  template: `
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
    @for (role of availableRoles; track role) {
      <button mat-stroked-button (click)="openRoleDialog(role)">{{role.roleName}}</button>
    } 
    <button mat-stroked-button (click)="openRoleDialog(null)">
      <mat-icon>add</mat-icon>
    </button>
  </div>

  <ng-template #roleTmpl>
    <app-form-builder 
      [config]="roleFormConfig" 
      [values]="roleFormVals" 
      (submitHandler)="submitRole($event)">
    </app-form-builder>

    <div class="mt-128 text-center">
      <button mat-raised-button class="!bg-red-500 !text-white" (click)="openConfirmDeleteRole()">Delete</button>
    </div>
  </ng-template>
  `
})
export class RolesFormComponent {

  @ViewChild('roleTmpl', {static:true}) roleTmpl!:TemplateRef<any>;

  dataService = inject(DataService);
  dialogService = inject(DialogService);

  roleFormConfig: FormConfig = this.giveRoleFormConfig();
  roleFormVals:any = {};
  availableRoles:any[] = [];

  ngOnInit(){
    this.dataService.getRoles().subscribe(roles=>this.availableRoles = roles);
  }

  private giveRoleFormConfig(): FormConfig {

    const roleOptions = [
      { label: 'Read', value: 'r' },
      { label: 'Create', value: 'c' },
      { label: 'Update', value: 'u' },
      { label: 'Delete', value: 'd' },
    ]

    const roleFormConfig: FormConfig = {
      fields: [
        { type: 'hidden', name: 'id', label: 'ID' },       
        { type: 'text', name: 'roleName', label: 'Role Name', required: true },
        { type: 'select', name: 'employees', label: 'Employees', multiple: true, options: roleOptions, columns: 3 },
        { type: 'select', name: 'companies', label: 'Companies', multiple: true, options: roleOptions, columns: 3 },
        { type: 'select', name: 'departments', label: 'Departments', multiple: true, options: roleOptions, columns: 3 },
        { type: 'select', name: 'tasks', label: 'Tasks', multiple: true, options: roleOptions, columns: 3 },
        { type: 'select', name: 'billing', label: 'Billing', multiple: true, options: roleOptions, columns: 3 },
        { type: 'select', name: 'assets', label: 'Assets', multiple: true, options: roleOptions, columns: 3 },
        { type: 'select', name: 'calendar', label: 'Calendar', multiple: true, options: roleOptions, columns: 3 },
        { type: 'select', name: 'settings', label: 'Settings', multiple: true, options: roleOptions, columns: 3 },
        //{type: 'select', name: 'deals', label: 'Deals', multiple: true, options: roleOptions, columns: 3 },  
      ],
    }

    return roleFormConfig;
  }

  submitRole(formData: any) {
    const cleanedFormData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== null)
    );

    this.dataService.addOrUpdateRole(cleanedFormData).subscribe(
      (roles) => {
        this.availableRoles = roles;
        this.dialogService.closeAll();
      }
    );
  }

  openRoleDialog(role:any){
    this.roleFormVals = role || {};
    this.dialogService.openTemplate({
      content: this.roleTmpl,
      header: role ? `Role: ${role.roleName}` : 'New Role',
      panelClass: 'big-dialog',
    })
  
  }

  openConfirmDeleteRole(){
    this.dialogService.openConfirm({
      cls: 'bg-red-500',
      header: 'Remove Role?',
      content: `Are you sure you want to remove the "${this.roleFormVals.roleName}" role? 
      This action may affect all users currently assigned to this role.`
    })
      .subscribe(confirmed => {
        if (confirmed === true) {
          this.dataService.deleteRole(this.roleFormVals.id).subscribe((roles)=>{
            this.availableRoles = roles;
            this.dialogService.closeAll();
          })
        }
      });

  }


}
