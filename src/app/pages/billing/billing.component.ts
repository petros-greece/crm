import { Component, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { TableBuilderComponent, TableConfig } from '../../table-builder/table-builder.component';
import { EntityFieldsService } from '../../services/entity-fields.service';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { ChartComponentWrapper } from '../../components/chart/chart.component';
import { BillingVars } from './billing.vars';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-billing',
  imports: [ChartComponentWrapper, TableBuilderComponent, CommonModule],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})
export class BillingComponent extends BillingVars {

  private destroy$ = new Subject<void>();

  dataService = inject(DataService);
  entityFieldsService = inject(EntityFieldsService);

  dealsTableConfig: TableConfig = { columns: [], data: [] };


  ngOnInit() {
    forkJoin({
      deals: this.dataService.getDeals(),
      companies: this.dataService.getCompanyOptions()
    }).pipe(takeUntil(this.destroy$))
    .subscribe(({ deals, companies }) => {
      // Assert the expected shape of deals: Record<string, any[]>
      const typedDeals = deals as Record<string, any[]>;

      const tableData = Object.entries(typedDeals).flatMap(([companyId, dealList]) => {
        const companyName = companies.find(c => c.id === companyId)?.companyName ?? 'Unknown';

        return dealList.map(deal => ({
          ...deal,
          company: companyName
        }));
      });

      this.giveDealsTableConfig(tableData);

      this.giveTotalChart(tableData);
      this.giveTotalPerCompanyChart(tableData);
      this.giveTotalPerDealTypeChart(tableData)
    });
  }

    ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private giveDealsTableConfig(tableData: any) {
    console.log(tableData)
    const columns = this.entityFieldsService.buildEntityTableConfigColumns('deal');
    columns.splice(1, 1, { key: 'company', label: 'Company', type: 'text', sortable: true })
    this.dealsTableConfig = {
      columns: columns,
      data: tableData,
      pagination: true,
      pageSizeOptions: [5, 10],
      cacheOptionsProp: 'deal-table'
    };
  }



}
