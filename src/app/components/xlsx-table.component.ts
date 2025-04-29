import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import { TableBuilderComponent, TableColumn, TableConfig } from '../table-builder/table-builder.component';


@Component({
  selector: 'xlsx-table',
  standalone: true,
  imports: [CommonModule, TableBuilderComponent],
  template: `
    <ng-container *ngIf="tableConfig">
      <app-table-builder [config]="tableConfig"></app-table-builder>
    </ng-container>
  `
})
export class XLSXTableComponent implements OnChanges {
  /**
   * ArrayBuffer of an Excel file (.xlsx) to render.
   */
  @Input() buffer!: ArrayBuffer;

  tableConfig?: TableConfig;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['buffer'] && this.buffer) {
      this.renderBuffer(this.buffer);
    }
  }

  private renderBuffer(buffer: ArrayBuffer) {
    // Convert buffer to Uint8Array for SheetJS
    const data = new Uint8Array(buffer);
    let workbook: XLSX.WorkBook;

    try {
      workbook = XLSX.read(data, { type: 'array' });
    } catch (error) {
      console.error('XLSX parse error:', error);
      this.tableConfig = undefined;
      return;
    }

    // Use first worksheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    if (jsonData.length === 0) {
      this.tableConfig = { columns: [], data: [] };
      return;
    }

    // Derive columns from keys of first row
    const columns: TableColumn[] = Object.keys(jsonData[0]).map(key => ({
      key,
      label: this.humanize(key),
      type: this.guessType(jsonData[0][key]),
      sortable: true
    }));

    // Build table config
    this.tableConfig = {
      columns,
      data: jsonData,
      pagination: true,
      pageSizeOptions: [5, 10, 25],
      download: true
    };
  }

  private humanize(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')      // Add space before capitals
      .replace(/[_\-]+/g, ' ')        // Replace underscores/hyphens
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .trim();
  }

  private guessType(value: any): 'text' | 'number' | 'date' | 'boolean' {
    if (typeof value === 'number') return 'number';
    if (value instanceof Date) return 'date';
    if (value === true || value === false) return 'boolean';
    return 'text';
  }
}
