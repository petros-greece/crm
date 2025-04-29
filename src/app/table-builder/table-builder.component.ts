import { Component, Input, OnInit, ViewChild, ContentChildren, QueryList, TemplateRef, AfterViewInit, Directive, ChangeDetectorRef, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { XlsxService } from '../services/xlsx.service';

@Directive({
  selector: '[appColumnTemplate]',
  standalone: true
})
export class ColumnTemplateDirective {
  @Input('appColumnTemplate') key!: string;
  constructor(public template: TemplateRef<any>) {}
}

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'custom';
  format?: string;
  sortable?: boolean;
  headerStyle?: { [key: string]: string };
  cellStyle?: { [key: string]: string };
}

export interface TableConfig {
  columns: TableColumn[];
  data: any[];
  pagination?: boolean;
  pageSizeOptions?: number[];
  download?: boolean;
}

@Component({
  selector: 'app-table-builder',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    DatePipe,
    MatIcon
  ],
  template: `
    <div class="flex flex-row justify-end">
      <button (click)="xlsxService.exportTableToExcel(dataSource.data)">
        EXCEL
        <mat-icon>download</mat-icon>
      </button>
      <button (click)="xlsxService.exportTableToJson(dataSource.data)">
        JSON
        <mat-icon>download</mat-icon>
      </button>
    </div>
    <div class="overflow-x-scroll">
      <table mat-table [dataSource]="dataSource" matSort class="overflow-scroll">
        <!-- Column Definitions -->
        <ng-container *ngFor="let col of config.columns" [matColumnDef]="col.key">
          <th mat-header-cell *matHeaderCellDef 
              [mat-sort-header]="col.sortable ? col.key : ''"
              [style]="col.headerStyle">
            {{ col.label }}
          </th>
          <td mat-cell *matCellDef="let row" [style]="col.cellStyle">
            <ng-container [ngSwitch]="col.type">
              <span *ngSwitchCase="'text'">{{ row[col.key] }}</span>
              <span *ngSwitchCase="'number'">
                {{ col.format ? (row[col.key] | number:col.format) : row[col.key] }}
              </span>
              <span *ngSwitchCase="'date'">
                {{ row[col.key] | date:(col.format || 'shortDate') }}
              </span>
              <mat-icon *ngSwitchCase="'boolean'">
                {{ row[col.key] ? 'check_circle' : 'cancel' }}
              </mat-icon>
              <ng-container *ngSwitchDefault>
                <ng-container *ngIf="getCustomTemplate(col.key) as template">
                  <ng-container *ngTemplateOutlet="template; context: { $implicit: row }"></ng-container>
                </ng-container>
              </ng-container>
            </ng-container>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
    <mat-paginator *ngIf="config.pagination"
                   [pageSizeOptions]="config.pageSizeOptions || [5, 10, 25]"
                   showFirstLastButtons
                   aria-label="Select page">
    </mat-paginator>
  `,
  styles: [`
    table { width: 100%; }
    mat-paginator { margin-top: 1rem; }
    mat-icon { vertical-align: middle; }
  `]
})
export class TableBuilderComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() config!: TableConfig;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ContentChildren(ColumnTemplateDirective) templates!: QueryList<ColumnTemplateDirective>;

  xlsxService = inject(XlsxService);

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  templateMap = new Map<string, TemplateRef<any>>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // initialize columns and data on first load
    this.displayedColumns = this.config.columns.map(c => c.key);
    this.dataSource.data = this.config.data;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] && this.config) {
      // update columns if changed
      this.displayedColumns = this.config.columns.map(c => c.key);
      // update data
      this.dataSource.data = this.config.data;
      // re-assign paginator and sort after view init
      if (this.paginator) this.dataSource.paginator = this.paginator;
      if (this.sort) this.dataSource.sort = this.sort;
      this.cdr.markForCheck();
    }
  }

  ngAfterViewInit() {
    // set up custom templates
    this.templates.forEach(template => {
      this.templateMap.set(template.key, template.template);
    });
    // hook up pagination and sort
    if (this.config.pagination) {
      this.dataSource.paginator = this.paginator;
    }
    this.dataSource.sort = this.sort;
    this.cdr.detectChanges();
  }

  getCustomTemplate(key: string): TemplateRef<any> | undefined {
    return this.templateMap.get(key);
  }
}
