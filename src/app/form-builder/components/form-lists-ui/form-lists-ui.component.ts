import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilderService } from '../../form-builder.service';
import { CommonModule } from '@angular/common';
import { FormBuilderComponent } from '../../form-builder.component';
import { FormConfig } from '../../form-builder.model';
import { DialogService } from '../../../services/dialog.service';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-form-lists-ui',
  imports: [
    CommonModule,
    FormBuilderComponent,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './form-lists-ui.component.html',
  styleUrl: './form-lists-ui.component.scss'
})
export class FormListsUiComponent {

  @ViewChild('listTmpl', { static: true }) listTmpl!: TemplateRef<any>;
  @ViewChild('importlistTmpl', { static: true }) importlistTmpl!: TemplateRef<any>;

  formBuilderService = inject(FormBuilderService);
  dialogService = inject(DialogService)

  lists: any;
  listFormConfig!: FormConfig;
  isNewList: boolean = false;

  importListFormConfig: FormConfig = {
    fields: [
      { type: 'text', name: 'key', label: 'Name', required: true },
      { type: 'textarea', name: 'items', label: 'Paste a list of items separated by commas(,)', required: true }
    ],
    submitText: 'Import List'
  }

  ngOnInit() {
    this.formBuilderService.getLists().subscribe((data) => {
      console.log('Lists:', data);
      this.lists = data;
    }, (error) => {
      console.error('Error fetching lists:', error);
    });
  }

  giveListFormConfig(listItem?: any, options: any[] = []): FormConfig {
    return {
      fields: [
        { type: listItem?.key ? 'hidden' : 'text', name: 'key', label: 'Name', required: true, defaultValue: listItem?.key || '' },
        { type: 'chips', name: 'items', label: 'Items', required: true, options: options, defaultValue: listItem?.value || [] },
      ],
      submitText: listItem ? 'Update List' : 'Add List'
    }
  }

  openListDialog(item: any) {
    this.isNewList = !item;
    const options = item ? item.value.map((item: any) => ({ label: item, value: item })) : [];
    this.listFormConfig = this.giveListFormConfig(item, options);

    this.dialogService.openTemplate({
      content: this.listTmpl,
      header: item ? `List: ${item.key}` : `Add List`,
    })
  }

  onSubmitList(formData: any) {
    console.log('onSubmitList', formData, this.isNewList);
    if (this.isNewList) {
      this.formBuilderService.addList(formData).subscribe((res) => {
        this.lists = res;
        this.dialogService.closeAll();
      })
    }
    else {
      this.formBuilderService.updateList(formData).subscribe((res) => {
        this.lists = res;
        this.dialogService.closeAll();
      })
    }

  }

  deleteList() {
    const listName = this.listFormConfig.fields[0].defaultValue;
    this.dialogService.openConfirm({
      cls: 'bg-red-500',
      header: 'Remove List?',
      content: `Are you sure you want to delete the list "${listName}"? All forms using this list will no longer display its options.`
    })
      .subscribe(confirmed => {
        if (confirmed === true) {
          this.formBuilderService.deleteList(listName).subscribe((res) => {
            this.lists = res;
            this.dialogService.closeAll();
          })
        }
      })
  }

  /** IMPORT *************************************************************** */

  openImportListDialog() {
    this.dialogService.openTemplate({
      content: this.importlistTmpl,
      header: `Import List`,
      panelClass: 'responsive-dialog'
    })
  }

  onImportList(formData: any) {
    const rawText = formData.items || '';

    const items = rawText
      .split(',')
      .map((item: string) => item.replace(/[\s\u200B-\u200D\uFEFF]/g, '').trim()) // removes whitespace & zero-width chars
      .filter((item: string) => item.length > 0);

    console.log(items);

    formData.items = items;

    // console.log(formData)
    // return;

    this.formBuilderService.addList(formData).subscribe((res) => {
      this.lists = res;
      this.dialogService.closeAll();
    })
  }
}
