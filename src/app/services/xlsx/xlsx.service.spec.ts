import { TestBed } from '@angular/core/testing';
import { XlsxService } from './xlsx.service';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

describe('XlsxService', () => {
  let service: XlsxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XlsxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('exportTableToExcel', () => {
    beforeEach(() => {
      spyOn(XLSX.utils, 'json_to_sheet').and.returnValue({} as any);
      spyOn(XLSX.utils, 'book_new').and.returnValue({ Sheets: {}, SheetNames: [] } as any);
      spyOn(XLSX.utils, 'book_append_sheet');
      spyOn(XLSX, 'write').and.returnValue(new ArrayBuffer(8));
      spyOn(FileSaver, 'saveAs');
    });

    it('should call XLSX utils and saveAs with correct parameters', () => {
      const tableData = [{ name: 'John', age: 20 }];
      const fileName = 'test.xlsx';

      service.exportTableToExcel(tableData, fileName);

      expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith(tableData);
      expect(XLSX.utils.book_new).toHaveBeenCalled();
      expect(XLSX.utils.book_append_sheet).toHaveBeenCalled();
      expect(XLSX.write).toHaveBeenCalled();
      expect(FileSaver.saveAs).toHaveBeenCalledWith(jasmine.any(Blob), fileName);
    });
  });

  describe('exportTableToJson', () => {
    beforeEach(() => {
      spyOn(FileSaver, 'saveAs');
    });

    it('should export valid JSON and trigger file download', () => {
      const data = [{ id: 1, label: 'A' }];
      const fileName = 'output.json';

      service.exportTableToJson(data, fileName);

      expect(FileSaver.saveAs).toHaveBeenCalled();
      const blobArg = ((FileSaver.saveAs as unknown) as jasmine.Spy).calls.mostRecent().args[0];
      expect(blobArg instanceof Blob).toBeTrue();
      expect(((FileSaver.saveAs as unknown) as jasmine.Spy).calls.mostRecent().args[1]).toBe(fileName);
    });

    it('should warn and not save file if input is not an array', () => {
      spyOn(console, 'warn');
      service.exportTableToJson('not-an-array' as any, 'bad.json');

      expect(console.warn).toHaveBeenCalledWith('exportTableToJson: tableData must be an array');
      expect(FileSaver.saveAs).not.toHaveBeenCalled();
    });
  });
});
