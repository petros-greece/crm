import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EntityFieldsService } from '../../../../services/entity-fields.service';
import { FormConfig } from '../../../../form-builder/form-builder.model';
import { ColumnTemplateDirective, TableBuilderComponent, TableConfig } from '../../../../table-builder/table-builder.component';
import { DialogService } from '../../../../services/dialog.service';
import { FormBuilderComponent } from '../../../../form-builder/form-builder.component';
import { SnackbarService } from '../../../../services/snackbar.service';

@Component({
  selector: 'app-deal-types-config',
  imports: [CommonModule, TableBuilderComponent, MatIcon, MatButtonModule, ColumnTemplateDirective, FormBuilderComponent],
  templateUrl: './deal-types-config.component.html',
  styleUrl: './deal-types-config.component.scss'
})
export class DealTypesConfigComponent {

  @ViewChild('dealTmpl', { static: true }) dealTmpl!: TemplateRef<any>;

  entityFieldsService = inject(EntityFieldsService);
  dialogService = inject(DialogService);
  snackbarService = inject(SnackbarService);

  dealFormConfig: FormConfig = {
    fields: [
      { type: 'hidden', label: 'ID', name: 'id' },
      { type: 'text', label: 'Label', name: 'label' },
      { type: 'icon', label: 'Icon', name: 'icon' },
      { type: 'select', label: 'Relations', name: 'relations', listName: 'Company Relations', multiple: true },
    ]
  }
  dealFormValues: any = {};

  dealsTableConfig: TableConfig = { data: [], columns: [] };

  ngOnInit() {
    this.entityFieldsService.getDealTypeOptions().subscribe((dealTypes) => {
      this.giveDealsTableConfig(dealTypes)
    })
  }

  private giveDealsTableConfig(data: any) {
    const columns: any = this.dealFormConfig.fields
      .filter(field => field.type !== 'hidden')
      .map(field => ({
        key: field.name,
        label: field.label,
        type: field.type === 'icon' ? 'custom' : 'text'
      }));

    this.dealsTableConfig = {
      data: data,
      columns: [...columns, { key: 'actions', label: 'Actions', type: 'custom' }],
      hideButtons: true
    };
  }

  openDealDialog(data: any) {
    this.dealFormValues = data;
    this.dialogService.openTemplate({
      content: this.dealTmpl,
      header: data ? `Edit Deal Type` : `Add New Deal type`,
    })
  }

  onSubmitDeal(formData: any) {
    this.entityFieldsService.addOrUpdateDealType(formData).subscribe((res: any) => {
      this.giveDealsTableConfig(res);
      this.dialogService.closeAll();
    })

  }

  openConfirmDeleteDealTypeDialog(rowData: any) {
    console.log(rowData)

    this.dialogService.openConfirm({
      content: `Are you sure you want to delete the deal type "${rowData.label}"? Any deals currently using this type will be left without a type.`,
      header: 'Delete Deal Type?',
      cls: 'bg-red-500 !text-white'
    }).subscribe(confirmed => {
      if (confirmed === true) {
        this.entityFieldsService.deleteDealType(rowData.id).subscribe((res: any) => {
          this.giveDealsTableConfig(res);
          this.dialogService.closeAll();
        })
      }
    });

  }



}
