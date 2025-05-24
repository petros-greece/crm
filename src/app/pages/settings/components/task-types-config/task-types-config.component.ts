import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EntityFieldsService } from '../../../../services/entity-fields.service';
import { FormConfig } from '../../../../form-builder/form-builder.model';
import { ColumnTemplateDirective, TableBuilderComponent, TableConfig } from '../../../../table-builder/table-builder.component';
import { DialogService } from '../../../../components/dialog/dialog.service';
import { FormBuilderComponent } from '../../../../form-builder/form-builder.component';
import { SnackbarService } from '../../../../services/snackbar.service';
import { FormBuilderUiComponent } from '../../../../form-builder/components/form-builder-ui/form-builder-ui.component';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-task-types-config',
  imports: [
    CommonModule,
    TableBuilderComponent,
    MatIcon,
    MatButtonModule,
    MatTabsModule,
    ColumnTemplateDirective,
    FormBuilderComponent,
    FormBuilderUiComponent
  ],
  templateUrl: './task-types-config.component.html',
  styleUrl: './task-types-config.component.scss'
})
export class TaskTypesConfigComponent {
  @ViewChild('taskTmpl', { static: true }) taskTmpl!: TemplateRef<any>;

  entityFieldsService = inject(EntityFieldsService);
  dialogService = inject(DialogService);
  snackbarService = inject(SnackbarService);

  taskFormConfig: FormConfig = {
    fields: [
      { type: 'hidden', label: 'value', name: 'value' },
      { type: 'text', label: 'Label', name: 'label', columns: 2 },
      { type: 'icon', label: 'Icon', name: 'icon', columns: 2 },
    ]
  }
  taskFormValues: any = {};

  taskTableConfig: TableConfig = { data: [], columns: [] };
  taskFormFieldsConfig: FormConfig = { fields: [] };

  ngOnInit() {
    this.entityFieldsService.getTaskTypeOptions().subscribe((taskTypes) => {
      this.giveTaskTypesTableConfig(taskTypes)
    })
  }

  onSubmitTaskFieldConfig(data: any) {
    this.entityFieldsService.addOrUpdateFieldsForTaskType(this.taskFormValues.value, data.fields).subscribe((res) => {
      this.snackbarService.showSnackbar(`Task Fields for type "${this.taskFormValues.label}" updated succesfully!`);
      this.dialogService.closeAll();
    });

  }

  private giveTaskTypesTableConfig(data: any) {
    const columns: any = this.taskFormConfig.fields
      .filter(field => field.type !== 'hidden')
      .map(field => ({
        key: field.name,
        label: field.label,
        type: field.type === 'icon' ? 'custom' : 'text'
      }));

    this.taskTableConfig = {
      data: data,
      columns: [...columns, { key: 'actions', label: 'Actions', type: 'custom' }],
      hideButtons: true
    };
  }


  openTaskTypeDialog(data: any) {

    this.entityFieldsService.getTaskFieldsForType(data.value, false).subscribe(fields => {
      this.taskFormFieldsConfig = { fields: fields }

      this.taskFormValues = data;
      this.dialogService.openTemplate({
        content: this.taskTmpl,
        header: data ? `Edit Task Type: ${data.label}` : `Add New Task type`,
        panelClass: 'big-dialog'
      })
    })

  }

  onSubmitTaskType(formData: any) {
    this.entityFieldsService.addOrUpdateTaskType(formData).subscribe((res: any) => {
      this.giveTaskTypesTableConfig(res);
      this.dialogService.closeAll();
    })
  }

  openConfirmDeleteTaskTypeDialog(rowData: any) {
    this.dialogService.openConfirm({
      content: `Are you sure you want to delete the task type "${rowData.label}"? 
      Any tasks assigned by this label will be left without a type!`,
      header: 'Delete Task Type?',
      cls: 'bg-red-500 !text-white'
    }).subscribe(confirmed => {
      if (confirmed === true) {
        this.entityFieldsService.deleteTaskType(rowData.value).subscribe((res: any) => {
          this.giveTaskTypesTableConfig(res);
          this.dialogService.closeAll();
        })
      }
    });

  }


}
