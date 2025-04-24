import { Component } from '@angular/core';
import { TableBuilderComponent, TableConfig, ColumnTemplateDirective } from '../../table-builder/table-builder.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-employees',
  imports: [TableBuilderComponent, MatButtonModule, ColumnTemplateDirective],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {

  tableConfig: TableConfig = {
    columns: [
      { key: 'name', label: 'Name', type: 'text', sortable: true },
      { key: 'age', label: 'Age', type: 'number', format: '1.0-0' },
      { key: 'birthDate', label: 'Birth Date', type: 'date', format: 'MMM d, y' },
      { key: 'active', label: 'Active', type: 'boolean' },
      { key: 'actions', label: 'Actions', type: 'custom'  } // Custom type
    ],
    data: [
      { name: 'John Doe', age: 30, birthDate: new Date(1993, 0, 1), active: true },
      { name: 'Jane Smith', age: 25, birthDate: new Date(1998, 5, 15), active: false },
      { name: 'John Doe', age: 30, birthDate: new Date(1993, 0, 1), active: true },
      { name: 'Jane Smith', age: 25, birthDate: new Date(1998, 5, 15), active: false },
      { name: 'John Doe', age: 30, birthDate: new Date(1993, 0, 1), active: true },
      { name: 'Jane Smith', age: 25, birthDate: new Date(1998, 5, 15), active: false },
      { name: 'John Doe', age: 30, birthDate: new Date(1993, 0, 1), active: true },
      { name: 'Jane Smith', age: 25, birthDate: new Date(1998, 5, 15), active: false},
    ],
    pagination: true,
    pageSizeOptions: [5, 10]
  };

  editItem(row: any) {
    console.log('Editing:', row);
  }
}
