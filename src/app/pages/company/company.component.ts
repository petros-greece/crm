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
import { SnackbarService } from '../../services/snackbar.service';
import { ChartComponentWrapper, ChartConfig, ChartData } from '../../components/chart/chart.component';
import { ApexAxisChartSeries, ApexXAxis, ApexChart } from 'ng-apexcharts';
import { ChartService } from '../../components/chart/chart.service';
import { FolderStructureComponent } from '../../components/folder-structure/folder-structure.component';
import { TreeNodeI } from '../../components/tree/tree.component';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';

@Component({
  selector: 'app-company',
  imports: [
    CommonModule, 
    FormBuilderComponent, 
    MatTabsModule, 
    MatIcon, 
    MatButtonModule,
    FormsModule, 
    MatSelectModule, 
    TableBuilderComponent, 
    ColumnTemplateDirective,
    ChartComponentWrapper,
    FolderStructureComponent,
    PageHeaderComponent
  ],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent {
  @ViewChild('previewCompanyTmpl', { static: true }) previewCompanyTmpl!: TemplateRef<any>;
  @ViewChild('newDealTmpl', { static: true }) newDealTmpl!: TemplateRef<any>;
  @ViewChild('updateDealTmpl', { static: true }) updateDealTmpl!: TemplateRef<any>;
  @ViewChild('newCompanyTmpl', { static: true }) newCompanyTmpl!: TemplateRef<any>;

  entityService = inject(EntityService)
  entityFieldsService = inject(EntityFieldsService);
  dataService = inject(DataService);
  dialogService = inject(DialogService);
  snackbarService = inject(SnackbarService)
  chartService = inject(ChartService)

  selectedTabIndex = 0;

  companiesTableConfig: TableConfig | null = null;  
  dealsTableConfig: TableConfig | null = null; 
  companyDeals: any = null;
  companyAssets: TreeNodeI[] = [];

  dealTypes = this.entityService.dealTypes;
  selectedDealType = '';
  dealFormConfig:FormConfig = { fields: [] }
  dealFormValues:any;
  companyInfoFormConfig:FormConfig = { fields: this.entityFieldsService.companyFields }
  companyInfoValues:any;
  companyContactsFormConfig:FormConfig = { fields: this.entityFieldsService.companyTabFields['contacts'] }
  companyContactsValues:any;

  chartData: ChartData = { categories: [], series: [] };
  chartConfig:ChartConfig = {
    chart: {
      type: 'area' as ApexChart['type'],
      height: 300
    },
    title: {
      text: 'Deals'
    },
    xaxis: {
      type: 'datetime' as ApexXAxis['type']
    }
  };


  ngOnInit(){

    this.dataService.getCompanies().subscribe(companies=>{
      this.giveCompaniesTableConfig(companies);
    })    
  }

  giveCompaniesTableConfig(companies:any){
    this.companiesTableConfig = {
      columns: this.entityFieldsService.buildEntityTableConfigColumns('company'),
      data: companies,
      pagination: true,
      pageSizeOptions: [5, 10],
      cacheOptionsProp: 'company-table'
    };
  }

  /** DEAL *************************************************************** */

  onSelectDealType(dealTypeId:string){
    const deal:any = this.entityService.getDealFields(dealTypeId);
    this.dealFormConfig = {
      title: deal.label || '',
      icon: deal.icon || '',
      fields: this.entityFieldsService.getDealTypeFields(dealTypeId),
      submitText: 'Add Deal'
    }
  }

  openNewDealDialog(){
    this.selectedDealType = '';
    this.dealFormValues = {};
    this.dialogService.openTemplate({
      panelClass: 'big-dialog',
      header: `Add New Deal with ${this.companyInfoValues.companyName}`,
      content: this.newDealTmpl,
      cls: '!bg-violet-800 !text-white',
      id: 'deal-dialog'
    })   
  }

  openEditDealDialog(dealData:any){
    this.selectedDealType = dealData.dealType;
    this.dealFormValues = dealData;
    const dealType = this.entityService.getDealFields(dealData.dealType);
    this.dealFormConfig = {
     // title: deal.label || '',
     // icon: deal.icon || '',
      fields: this.entityFieldsService.getDealTypeFields( this.selectedDealType)
    }
    this.dialogService.openTemplate({
      panelClass: 'big-dialog',
      header: `Deal with ${this.companyInfoValues.companyName}`,
      content: this.updateDealTmpl,
      cls: '!bg-violet-800 !text-white',
      id: 'deal-dialog',
      icon: dealType.icon
    })  
  }

  addNewDeal(formData:any){
    formData.dealType = this.selectedDealType;
    formData.dealTypeName = (this.dealTypes.find(dt => dt.id === formData.dealType))?.label;
    formData.notes = [];
    //console.log(formData, this.companyInfoValues.id);
    this.dataService.addDeal(this.companyInfoValues.id, formData).subscribe((response)=>{
      //console.log(response)
      this.dealsTableConfig = {
        data: response,
        columns: this.entityFieldsService.buildEntityTableConfigColumns('deal')
      }
      this.selectedDealType = '';
      this.dialogService.closeDialogById('deal-dialog');
    })
  }

  updateDeal(formData:any){
 
    //console.log(formData, this.companyInfoValues.id);
    this.dataService.updateDeal(this.companyInfoValues.id, formData).subscribe((response)=>{
      //console.log(response)
      this.dealsTableConfig = {
        data: response,
        columns: this.entityFieldsService.buildEntityTableConfigColumns('deal')
      }
      this.selectedDealType = '';
      this.dialogService.closeDialogById('deal-dialog');
    })
  }

  deleteDeal(companyId:string, dealId:string){

    this.dialogService.openConfirm({
      cls: 'bg-red-500 !text-white',
      header: `Delete deal?`,
      content: 'Are you sure you want to delete the current deal?',
    })
      .subscribe(confirmed => {
        if (confirmed === true) {
          console.log(companyId, dealId)
          this.dataService.deleteDeal(companyId, dealId).subscribe((data:any)=>{
            this.dealsTableConfig = {
              data: data,
              columns: this.entityFieldsService.buildEntityTableConfigColumns('deal')
            }
            this.dialogService.closeDialogById('deal-dialog');
          })
        }
      });

  }

  /** COMPANY *************************************************************** */

  openEditCompanyDialog(row:any){
    this.selectedTabIndex = 0;
    this.dealsTableConfig = null;
    this.companyDeals = null;
    this.companyAssets = [];
    this.chartData = { categories: [], series: [] };

    this.companyInfoValues = row;
    this.companyContactsValues = {contacts: row.contacts};
    this.dealTypes = this.entityService.dealTypes.filter(dealType => 
      dealType.relations.some(relation => row.relations.includes(relation))
    );
    this.dialogService.openTemplate({
      panelClass: 'big-dialog',
      header: `Company: ${row.companyName}`,
      content: this.previewCompanyTmpl,
      cls: '!bg-violet-800 !text-white',
    })
  }

  openNewCompanyTmpl(){
    this.dialogService.openTemplate({
      panelClass: 'big-dialog',
      header: `Add New company`,
      content: this.newCompanyTmpl,
      cls: '!bg-violet-800 !text-white',
    })    
  }

  addNewCompany(formData:any){
    console.log('formData', formData);
    this.dataService.addCompany(formData).subscribe(companies=>{
      this.giveCompaniesTableConfig(companies);
      this.dialogService.closeAll();
    })
  }

  updateCompany(formData:any){
    this.dataService.updateCompany(formData).subscribe(companies=>{
      this.giveCompaniesTableConfig(companies);
      //this.dialogService.closeAll();
      this.snackbarService.showSnackbar('Company updated succesfully');
    })
  }

  updateCompanyContacts(formData:any){
    this.dataService.updateCompanyContacts(this.companyInfoValues.id, formData.contacts).subscribe(companies=>{  
      //this.dialogService.closeAll();
      this.snackbarService.showSnackbar('Company contacts updated succesfully');
    })
  }


  //CHECK IF IS THE DEALS TAB TO GET THE DEALS
  selectedTabChange(event:any){
    //this.selectedTabIndex = event.index;
    if( (event.index === 3 || event.index === 4) && !this.companyDeals){
      this.dataService.getDealsForCompany(this.companyInfoValues.id).subscribe((deals)=>{
        console.log('gotten into dels', deals)
        this.companyDeals = deals;
        this.dealsTableConfig = {
          data: deals,
          columns: this.entityFieldsService.buildEntityTableConfigColumns('deal')
        }
        this.chartData = this.chartService.dealsToChartData(deals);    
      })
    }
    else if( event.index === 2 && !this.companyAssets.length ){
      this.dataService.getAssetsForCompany(this.companyInfoValues.id).subscribe((assets)=>{
        console.log('gotten into assets', assets)
        this.companyAssets = assets;
      })

    }
  }

  deleteCompany(){

    this.dialogService.openConfirm({
      cls: 'bg-red-500 !text-white',
      header: `Delete company?`,
      content: `Are you sure you want to delete the company ${this.companyInfoValues.companyName}?`,
    })
    .subscribe(confirmed => {
      if (confirmed === true) {
        this.dataService.deleteCompany(this.companyInfoValues.id).subscribe((companies:any)=>{
          this.giveCompaniesTableConfig(companies);
          this.dialogService.closeAll();
          this.snackbarService.showSnackbar(`Company ${this.companyInfoValues.companyName} was deleted succesfully`);
        })
      }
    });

  }


  /***************************************************** */






}
