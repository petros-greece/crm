import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { EntityFieldsService } from '../../services/entity-fields.service';
import { DataService } from '../../services/data.service';
import { DialogService } from '../../services/dialog.service';
import { ColumnTemplateDirective, TableBuilderComponent, TableConfig } from '../../table-builder/table-builder.component';
import { FormBuilderComponent } from '../../form-builder/form-builder.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { EntityService } from '../../services/entity.service';
import { FormConfig } from '../../form-builder/form-builder.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-customers',
  imports: [
    CommonModule, 
    FormBuilderComponent, 
    MatTabsModule, 
    MatIcon, 
    MatButtonModule,
    FormsModule, 
    MatSelectModule, 
    TableBuilderComponent, 
    ColumnTemplateDirective
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent {
  @ViewChild('previewCustomerTmpl', { static: true }) previewCustomerTmpl!: TemplateRef<any>;
  @ViewChild('dealTmpl', { static: true }) dealTmpl!: TemplateRef<any>;

  entityService = inject(EntityService)
  entityFieldsService = inject(EntityFieldsService);
  dataService = inject(DataService);
  dialogService = inject(DialogService);

  customersTableConfig: TableConfig | null = null;  
  dealsTableConfig: TableConfig | null = null; 

  dealTypes = this.entityService.customerDealTypes;
  selectedDealType = '';
  dealFormConfig:FormConfig = { fields: [] }
  customerInfoFormConfig:FormConfig = { fields: this.entityFieldsService.customerFields }
  customerInfoValues:any;
  customerContactsFormConfig:FormConfig = { fields: this.entityFieldsService.customerTabFields['contacts'] }
  customerContactsValues:any;

  ngOnInit(){

    this.dataService.getCustomers().subscribe(customers=>{
      this.customersTableConfig = {
        columns: this.entityFieldsService.buildEntityTableConfigColumns('customer'),
        data: customers,
        pagination: true,
        pageSizeOptions: [5, 10],
        cacheOptionsProp: 'company-table'
      };
    })    
  }


  onSelectDealType(dealId:string){
    const deal:any = this.entityService.getCustomerDealFields(dealId);
    this.dealFormConfig = {
      title: deal.label || '',
      icon: deal.icon || '',
      fields: this.entityFieldsService.getDealCustomerTypeFields(dealId)
    }
  }

  openEditCustomerDialog(row:any){
    this.dealsTableConfig = null;
    this.customerInfoValues = row;
    this.customerContactsValues = {contacts: row.contacts};
    console.log(this.customerContactsValues);
    this.dialogService.openTemplate({
      panelClass: 'big-dialog',
      header: `Company: ${row.companyName}`,
      content: this.previewCustomerTmpl,
      cls: '!bg-violet-800 !text-white',
    })
  }

  openNewDealDialog(){
    this.selectedDealType = '';
    this.dialogService.openTemplate({
      panelClass: 'responsive-dialog',
      header: 'Add New Deal',
      content: this.dealTmpl,
      cls: '!bg-violet-800 !text-white',
      id: 'deal-dialog'
    })   
  }

  submitDeal(formData:any){
    formData.dealType = this.selectedDealType;
    //console.log(formData, this.customerInfoValues.id);
    this.dataService.addDeal(this.customerInfoValues.id, formData).subscribe((response)=>{
      //console.log(response)
      this.dealsTableConfig = {
        data: response,
        columns: this.entityFieldsService.buildEntityTableConfigColumns('deal')
      }
      this.selectedDealType = '';
      this.dialogService.closeDialogById('deal-dialog');
    })
  }

  selectedTabChange(event:any){
    if(event.index === 3 && !this.dealsTableConfig){
      console.log(this.customerInfoValues.id)
      this.dataService.getDealsForCompany(this.customerInfoValues.id).subscribe((deals)=>{
        this.dealsTableConfig = {
          data: deals,
          columns: this.entityFieldsService.buildEntityTableConfigColumns('deal')
        }
      })
    }
  }

}
