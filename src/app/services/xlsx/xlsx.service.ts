import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class XlsxService {

  constructor() {}

  exportTableToExcel(tableData: any[], fileName: string = 'export.xlsx') {
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], {type: 'application/octet-stream'});

    saveAs(data, fileName);
  }


  exportTableToJson(tableData: any[], fileName: string = 'export.json'): void {
    if (!Array.isArray(tableData)) {
      console.warn('exportTableToJson: tableData must be an array');
      return;
    }
    const json = JSON.stringify(tableData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, fileName);
  }




}
