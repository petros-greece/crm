import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilderUiComponent } from '../../../../form-builder/components/form-builder-ui/form-builder-ui.component';
import { DialogService } from '../../../../components/dialog/dialog.service';
import { ColumnTemplateDirective, TableBuilderComponent, TableConfig } from '../../../../table-builder/table-builder.component';
import { EntityFieldsService } from '../../../../services/entity-fields.service';
import { MatIcon } from '@angular/material/icon';
import { SnackbarService } from '../../../../services/snackbar.service';
import { FieldFormConfig, FormConfig } from '../../../../form-builder/form-builder.model';
import { FormBuilderComponent } from '../../../../form-builder/form-builder.component';

@Component({
  selector: 'app-entity-forms',
  imports: [
    CommonModule,
    MatButtonModule,
    FormBuilderUiComponent,
    TableBuilderComponent,
    ColumnTemplateDirective,
    MatIcon,
    FormBuilderComponent
  ],
  templateUrl: './entity-forms.component.html',
  styleUrl: './entity-forms.component.scss'
})
export class EntityFormsComponent {
  
  @ViewChild('entityFormFieldsTmpl', { static: true }) entityFormFieldsTmpl!: TemplateRef<any>;
  @ViewChild('entityFormConfigTmpl', { static: true }) entityFormConfigTmpl!: TemplateRef<any>;

  dialogService = inject(DialogService);
  entityFieldsService = inject(EntityFieldsService);
  snackbarService = inject(SnackbarService);

  tableConfig:TableConfig = {data:[], columns: []};

  outputFormConfig: FormConfig = { fields: [], submitText: "Test Form" };

  entityFormConfig: FormConfig = {
    enabledOnPristine: true,
    fields: [
      {type: 'text', name: 'title', label: 'Form Title', required: true, 'columns': 1 },
      {type: 'select', name: 'entity', label: 'Select Entity', options: [
        {label: 'Employee', value:'employee'},
        {label: 'Company', value:'company'},
        {label: 'Department', value:'department'}],
        required: true
      },
      {type: 'text', name: 'submitText', label: 'Submit Text', required: false, 'columns': 2 },
      {type: 'icon', name: 'icon', label: 'Icon', required: true, 'columns': 2, defaultValue: 'info' },
    ]
  }
  entityFormConfigValues:any;
  originalEntityType:string = '';

  currentFields:FieldFormConfig[] = [];

  ngOnInit(){
    this.giveTable();


  }

  private giveTableConfig(data:any):TableConfig{
    return {
      data: data,
      columns: [
        { key: 'entity', label: 'Entity', type: 'text'},
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'icon', label: 'Icon', type: 'custom'},
        { key: 'actions', label: 'Actions', type: 'custom'},
      ],
      hideButtons: true
    }
  }

  private giveTable(){
    this.entityFieldsService.getAllEntityFormConfigs().subscribe((formConfigs:any[])=>{
      this.tableConfig = this.giveTableConfig(formConfigs)
    })
  }

  /** TABLE ACTIONS ***********************************************************************************/

  openEntityFormDialog(data:any){
    this.originalEntityType = data.entity || '';
    this.entityFormConfigValues = data || {};
    this.outputFormConfig = {fields: data.fields || []};
    this.dialogService.openTemplate({
      header: data ? 'Update Form' : 'Add Form To Entity',
      content: this.entityFormFieldsTmpl,
      panelClass: 'big-dialog'
    })
  }

  openConfirmDeleteFormDialog(formData:any){
    this.dialogService.openConfirm({
      content: `Do you wanna delete form ${formData.title} from ${formData.entity}?`,
      header: `Delete Form`,
      cls: 'bg-red-800 !text-white',
    }).subscribe(confirmed=>{
      if(confirmed){
        this.entityFieldsService.deleteEntityFields(formData.entity, formData.index).subscribe(()=>{
          this.giveTable();
          this.snackbarService.showSnackbar(`Form ${formData.title} deleted succesfully.`);
        })
      }
    })

  }

  /** DIALOG ACTIONS ********************************************************************************/

  onSubmitFieldsConfig(formData:any){
    console.log(formData)
     this.currentFields = formData.fields;
     this.dialogService.openTemplate({
      header: 'Add Form To Entity',
      content: this.entityFormConfigTmpl
    })   
  }
  
  addOrUpdateEntityFields(data: any) {

    const formData = {
      fields: [...this.currentFields],
      icon: data.icon,
      title: data.title,
      submitText: data.submitText
    }
    const entityType = data.entity;
    const formIndex = this.entityFormConfigValues.index;

    if(formIndex !== undefined && this.originalEntityType === entityType){
      this.entityFieldsService.updateEntityFields(entityType, formIndex, formData).subscribe((resp:any)=>{
        this.giveTable();
        this.dialogService.closeAll()
        this.snackbarService.showSnackbar(`Form updated succesfully for entity`);
      })
    }
    else{
      this.entityFieldsService.createEntityFields(entityType, formData).subscribe((resp:any)=>{
        this.giveTable();
        this.dialogService.closeAll()
        this.snackbarService.showSnackbar(`Form added succesfully to entity`);
      })
    }
    
  }


}
