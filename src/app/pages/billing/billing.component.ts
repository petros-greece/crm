import { Component, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { TableBuilderComponent, TableConfig } from '../../table-builder/table-builder.component';
import { EntityFieldsService } from '../../services/entity-fields.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-billing',
  imports: [TableBuilderComponent],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})
export class BillingComponent {

  dataService = inject(DataService);
  entityFieldsService = inject(EntityFieldsService);

  dealsTableConfig: TableConfig = { columns: [], data: [] };

ngOnInit() {
  forkJoin({
    deals: this.dataService.getDeals(),                 // <- returns Observable<unknown>
    companies: this.dataService.getCompanyOptions()
  }).subscribe(({ deals, companies }) => {
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
  });
}





  private flattenObjectValues(obj: { [key: string]: any[] }): any[] {
    return Object.values(obj).flat();
  }

  private giveDealsTableConfig(data: any) {
    const columns = this.entityFieldsService.buildEntityTableConfigColumns('deal');
    columns.splice(1,1,{key:'company', label: 'Company', type: 'text', sortable: true})
    this.dealsTableConfig = {
      columns: columns,
      data: data,
      pagination: true,
      pageSizeOptions: [5, 10],
      cacheOptionsProp: 'deal-table'
    };
  }


}
