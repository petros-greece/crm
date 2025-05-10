import { Component, Input, OnInit, ViewChild, ContentChildren, QueryList, TemplateRef, AfterViewInit, Directive, ChangeDetectorRef, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { XlsxService } from '../services/xlsx.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { OptionsService } from '../services/options.service';
@Directive({
  selector: '[appColumnTemplate]',
  standalone: true
})
export class ColumnTemplateDirective {
  @Input('appColumnTemplate') key!: string;
  constructor(public template: TemplateRef<any>) { }
}

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'custom';
  format?: string;
  sortable?: boolean;
  headerStyle?: { [key: string]: string };
  cellStyle?: { [key: string]: string };
  visible?: boolean;
}

export interface TableConfig {
  columns: TableColumn[];
  data: any[];
  pagination?: boolean;
  pageSizeOptions?: number[];
  download?: boolean;
  cacheOptionsProp?:string;
}

@Component({
  selector: 'app-table-builder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    DatePipe,
    MatIcon,
    MatButtonModule,
    MatMenuModule,
    MatCheckboxModule
  ],
  template: `
    <div *ngIf="config.data.length > 0">
      <div class="flex flex-row justify-end">

        <button mat-button (click)="xlsxService.exportTableToExcel(dataSource.data)">
          EXCEL
          <mat-icon>download</mat-icon>
        </button>
        <button mat-button (click)="xlsxService.exportTableToJson(dataSource.data)">
          JSON
          <mat-icon>download</mat-icon>
        </button>

        <button mat-button [matMenuTriggerFor]="columnsMenu" #menuTrigger="matMenuTrigger">
          <mat-icon class="m-auto">filter_list</mat-icon>
        </button>
        <mat-menu #columnsMenu="matMenu" class="column-menu">
          <div class="p-2 flex flex-col gap-2" (click)="$event.stopPropagation()">
            <div *ngFor="let col of config.columns" class="menu-item">
              <mat-checkbox 
                [checked]="columnVisibility[col.key]"
                (change)="columnVisibility[col.key] = $event.checked; toggleColumn(col.key)"
                color="primary">
                {{ col.label }}
              </mat-checkbox>
            </div>
            <button mat-stroked-button 
                    class="mt-2 self-end"
                    (click)="menuTrigger.closeMenu()">
              Close
            </button>
          </div>
        </mat-menu>
      </div>
      <div class="overflow-x-auto">
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
    </div> 
  `,
  styles: [`
    table { width: 100%; }
    mat-paginator { margin-top: 1rem; }
    table mat-icon { vertical-align: middle; }
  `]
})
export class TableBuilderComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() config!: TableConfig;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ContentChildren(ColumnTemplateDirective) templates!: QueryList<ColumnTemplateDirective>;

  xlsxService = inject(XlsxService);
  optionsService = inject(OptionsService);

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  templateMap = new Map<string, TemplateRef<any>>();
  columnVisibility: { [key: string]: boolean } = {};
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.checkColumns();
    this.dataSource.data = this.config.data;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] && this.config) {
      this.checkColumns();
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

  private checkColumns(){
    let cachedVisibility;
    if(this.config.cacheOptionsProp){
      cachedVisibility = this.optionsService.getOption(this.config.cacheOptionsProp)
    }
    if(cachedVisibility){
      this.columnVisibility = cachedVisibility;
    }
    else{
      this.initializeColumnVisibility();
    }
    this.updateDisplayedColumns();
  }

  getCustomTemplate(key: string): TemplateRef<any> | undefined {
    return this.templateMap.get(key);
  }

  initializeColumnVisibility() {
    this.columnVisibility = this.config.columns.reduce((acc, col) => {
      acc[col.key] = col.visible !== false; // Default to true if undefined
      return acc;
    }, {} as { [key: string]: boolean });
  }

  toggleColumn(columnKey: string) {
    // No need to toggle here since we're using the event value
    this.updateDisplayedColumns();
    if(this.config.cacheOptionsProp){
      this.optionsService.updateOption(this.config.cacheOptionsProp, this.columnVisibility)
    }
  }

  updateDisplayedColumns(initial = false) {
    // Create new array reference to trigger change detection
    this.displayedColumns = this.config.columns
      .filter(col => this.columnVisibility[col.key])
      .map(col => col.key);

      // Force table to update
      if (!initial) {
        this.dataSource.data = [...this.dataSource.data];
        this.cdr.detectChanges();
      }
  }


}
