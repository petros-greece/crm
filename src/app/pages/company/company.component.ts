import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { DealTypeI, EntityFieldsService } from '../../services/entity-fields.service';
import { DataService } from '../../services/data.service';
import { DialogService } from './../../components/dialog/dialog.service';
import { ColumnTemplateDirective, TableBuilderComponent, TableConfig } from '../../table-builder/table-builder.component';
import { FormBuilderComponent } from '../../form-builder/form-builder.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { FormConfig, FormFieldConfig } from '../../form-builder/form-builder.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '../../services/snackbar.service';
import { ChartComponentWrapper, ChartConfig, ChartData } from '../../components/chart/chart.component';
import { ApexAxisChartSeries, ApexXAxis, ApexChart } from 'ng-apexcharts';
import { ChartService } from '../../components/chart/chart.service';
import { FolderStructureComponent } from '../../components/folder-structure/folder-structure.component';
import { TreeNodeI } from '../../components/tree/tree.component';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { DealFormComponent } from '../../components/deal-form/deal-form.component';
import { Subject, takeUntil } from 'rxjs';

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
    PageHeaderComponent,
    DealFormComponent
  ],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent {

  private destroy$ = new Subject<void>();

  @ViewChild('previewCompanyTmpl', { static: true }) previewCompanyTmpl!: TemplateRef<any>;
  @ViewChild('dealTmpl', { static: true }) dealTmpl!: TemplateRef<any>;
  @ViewChild('updateDealTmpl', { static: true }) updateDealTmpl!: TemplateRef<any>;
  @ViewChild('newCompanyTmpl', { static: true }) newCompanyTmpl!: TemplateRef<any>;

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


  dealFormConfig: FormConfig = { fields: [] }
  dealFormValues: any;

  companyInfoFormConfig: FormConfig = { fields: this.entityFieldsService.companyFields }
  companyInfoValues: any;
  companyContactsFormConfig: FormConfig = { fields: this.entityFieldsService.companyTabFields['contacts'] }
  companyContactsValues: any;

  chartData: ChartData = { categories: [], series: [] };
  chartConfig: ChartConfig = {
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

  extraForms: any = [];

  ngOnInit() {
    this.dataService.getCompanies()
      .pipe(takeUntil(this.destroy$))
      .subscribe(companies => {
        this.giveCompaniesTableConfig(companies);
      });

    this.entityFieldsService.getEntityFields('company')
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: any) => {
        this.extraForms = resp;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private giveCompaniesTableConfig(companies: any) {
    this.companiesTableConfig = {
      columns: this.entityFieldsService.buildEntityTableConfigColumns('company'),
      data: companies,
      pagination: true,
      pageSizeOptions: [5, 10],
      cacheOptionsProp: 'company-table'
    };
  }

  /** DEAL *************************************************************** */

  openDealDialog(dealData: any) {
    this.dealFormValues = dealData;
    const header = dealData.id ? `Deal with ${this.companyInfoValues.companyName}` : `Add New Deal with ${this.companyInfoValues.companyName}`;
    this.dialogService.openTemplate({
      panelClass: 'big-dialog',
      header: header,
      content: this.dealTmpl,
      id: 'deal-dialog'
    })
  }

  onAfterSubmitDeal(response: any) {
    this.dealsTableConfig = {
      data: response,
      columns: this.entityFieldsService.buildEntityTableConfigColumns('deal')
    }
    this.dialogService.closeDialogById('deal-dialog');
  }

  deleteDeal(companyData: any, dealData: any) {

    this.dialogService.openConfirm({
      cls: 'bg-red-500 !text-white',
      header: `Delete deal?`,
      content: `Are you sure you want to delete the deal: "${dealData.dealName}" with the company ${companyData.companyName}?`,
    }).subscribe(confirmed => {
      if (confirmed === true) {
        console.log(companyData.id, dealData.id)
        this.dataService.deleteDeal(companyData.id, dealData.id).subscribe((data: any) => {
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

  openEditCompanyDialog(row: any) {
    this.selectedTabIndex = 0;
    this.dealsTableConfig = null;
    this.companyDeals = null;
    this.companyAssets = [];
    this.chartData = { categories: [], series: [] };

    this.companyInfoValues = row;
    this.companyContactsValues = { contacts: row.contacts };

    this.dialogService.openTemplate({
      panelClass: 'big-dialog',
      header: `Company: ${row.companyName}`,
      content: this.previewCompanyTmpl,
    })
  }

  openNewCompanyTmpl() {
    this.dialogService.openTemplate({
      panelClass: 'big-dialog',
      header: `Add New company`,
      content: this.newCompanyTmpl,
    })
  }

  addNewCompany(formData: any) {
    this.dataService.addCompany(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(companies => {
        this.giveCompaniesTableConfig(companies);
        this.dialogService.closeAll();
      });
  }

  updateCompany(formData: any) {
    this.dataService.updateCompany(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(companies => {
        this.giveCompaniesTableConfig(companies);
        this.snackbarService.showSnackbar('Company updated successfully');
      });
  }

  updateCompanyContacts(formData: any) {
    this.dataService.updateCompanyContacts(this.companyInfoValues.id, formData.contacts)
      .pipe(takeUntil(this.destroy$))
      .subscribe((companies) => {
        this.giveCompaniesTableConfig(companies);
        this.snackbarService.showSnackbar('Company contacts updated successfully');
      });
  }

  updateCompanyExtraFields(formData: any, title: string) {
    this.dataService.updateCompanySection(this.companyInfoValues.id, title, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((companies) => {
        this.giveCompaniesTableConfig(companies);
        this.snackbarService.showSnackbar(`Company section "${title}" updated successfully`);
      });
  }

  selectedTabChange(event: any) {
    if ((event.index === 3 || event.index === 4) && !this.companyDeals) {
      this.dataService.getDealsForCompany(this.companyInfoValues.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((deals) => {
          this.companyDeals = deals;
          this.dealsTableConfig = {
            data: deals,
            columns: this.entityFieldsService.buildEntityTableConfigColumns('deal')
          };
          this.chartData = this.chartService.dealsToChartData(deals);
        });
    } else if (event.index === 2 && !this.companyAssets.length) {
      this.dataService.getAssetsForCompany(this.companyInfoValues.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((assets) => {
          this.companyAssets = assets;
        });
    }
  }

  openConfirmDeleteCompany(companyData: any) {

    this.dialogService.openConfirm({
      cls: 'bg-red-500 !text-white',
      header: `Delete company?`,
      content: `Are you sure you want to delete the company ${companyData.companyName}?`,
    }).pipe(takeUntil(this.destroy$)).subscribe(confirmed => {
      if (confirmed) {
        this.dataService.deleteCompany(companyData.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((companies: any) => {
            this.giveCompaniesTableConfig(companies);
            this.dialogService.closeAll();
            this.snackbarService.showSnackbar(`Company ${companyData.companyName} was deleted successfully`);
          });
      }
    });
  }


  /***************************************************** */






}
