import { Component, Input, OnInit, ViewChild, ContentChildren, QueryList, TemplateRef, AfterViewInit, Directive, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

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
    DatePipe
  ],
  template: `
    <table mat-table [dataSource]="dataSource" matSort>
      <!-- Column Definitions -->
      <ng-container *ngFor="let col of config.columns" [matColumnDef]="col.key">
        <th mat-header-cell *matHeaderCellDef 
            [mat-sort-header]="col.sortable ? col.key : ''"
            [style]="col.headerStyle">
          {{ col.label }}
        </th>
        <td mat-cell *matCellDef="let row" [style]="col.cellStyle">
          <ng-container [ngSwitch]="col.type">
            <!-- Text -->
            <span *ngSwitchCase="'text'">{{ row[col.key] }}</span>

            <!-- Number -->
            <span *ngSwitchCase="'number'">
              {{ col.format ? (row[col.key] | number:col.format) : row[col.key] }}
            </span>

            <!-- Date -->
            <span *ngSwitchCase="'date'">
              {{ row[col.key] | date:(col.format || 'shortDate') }}
            </span>

            <!-- Boolean -->
            <mat-icon *ngSwitchCase="'boolean'">
              {{ row[col.key] ? 'check_circle' : 'cancel' }}
            </mat-icon>

            <!-- Custom Content -->
            <ng-container *ngSwitchDefault>
              <ng-container *ngIf="getCustomTemplate(col.key) as template">
                <ng-container *ngTemplateOutlet="template; context: { $implicit: row }"></ng-container>
              </ng-container>
            </ng-container>
          </ng-container>
        </td>
      </ng-container>

      <!-- Header Row -->
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      
      <!-- Data Row -->
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>

    <mat-paginator *ngIf="config.pagination"
                   [pageSizeOptions]="config.pageSizeOptions || [5, 10, 25]"
                   showFirstLastButtons
                   aria-label="Select page">
    </mat-paginator>
  `,
  styles: [`
    table {
      width: 100%;
    }
    mat-paginator {
      margin-top: 1rem;
    }
    mat-icon {
      vertical-align: middle;
    }
  `]
})
export class TableBuilderComponent implements OnInit, AfterViewInit {
  @Input() config!: TableConfig;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ContentChildren(ColumnTemplateDirective) templates!: QueryList<ColumnTemplateDirective>;

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  templateMap = new Map<string, TemplateRef<any>>();

  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit() {
    this.displayedColumns = this.config.columns.map(c => c.key);
    this.dataSource.data = this.config.data;
  }

  ngAfterViewInit() {
    this.templates.forEach(template => {
      this.templateMap.set(template.key, template.template);
    });

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