import { Component, inject } from '@angular/core';
import { TableBuilderComponent, TableConfig, ColumnTemplateDirective } from '../../table-builder/table-builder.component';
import { MatButtonModule } from '@angular/material/button';
import { EntityFieldsService } from '../../services/entity-fields.service';

@Component({
  selector: 'app-employees',
  imports: [TableBuilderComponent, MatButtonModule, ColumnTemplateDirective],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {

  entityFieldsService = inject(EntityFieldsService);

  tableConfig: TableConfig = {
    columns: this.entityFieldsService.buildEntityTableConfigColumns(),
    data: [
        {
          "fullName": "Alice Johnson",
          "email": "alice.johnson@example.com",
          "phoneNumber": "+12345678901",
          "birthDate": "1990-04-12",
          "address": "123 Elm Street",
          "city": "Springfield",
          "zipCode": "62704",
          "hireDate": "2022-06-01",
          "role": "Software Engineer",
          "department": "Engineering",
          "isActive": true
        },
        {
          "fullName": "Michael Thompson",
          "email": "michael.t@example.com",
          "phoneNumber": "+19876543210",
          "birthDate": "1985-11-23",
          "address": "456 Maple Avenue",
          "city": "Rivertown",
          "zipCode": "10001",
          "hireDate": "2021-09-15",
          "role": "Project Manager",
          "department": "Product",
          "isActive": true
        },
        {
          "fullName": "Sarah Lee",
          "email": "sarah.lee@example.net",
          "phoneNumber": "+15145551234",
          "birthDate": "1992-08-30",
          "address": "789 Oak Blvd",
          "city": "Lakeside",
          "zipCode": "94107",
          "hireDate": "2023-01-20",
          "role": "UX Designer",
          "department": "Design",
          "isActive": false
        },
        {
          "fullName": "David Kim",
          "email": "david.kim@example.org",
          "phoneNumber": "+14161231234",
          "birthDate": "1988-03-05",
          "address": "321 Pine Road",
          "city": "Hillview",
          "zipCode": "90210-1234",
          "hireDate": "2020-10-10",
          "role": "DevOps Engineer",
          "department": "IT",
          "isActive": true
        },
        {
          "fullName": "Jessica Brown",
          "email": "j.brown@example.com",
          "phoneNumber": "+16045557890",
          "birthDate": "1995-06-18",
          "address": "654 Cedar Lane",
          "city": "Woodland",
          "zipCode": "30303",
          "hireDate": "2022-03-05",
          "role": "HR Manager",
          "department": "Human Resources",
          "isActive": true
        }  
    ],
    pagination: true,
    pageSizeOptions: [5, 10]
  };

  editItem(row: any) {
    console.log('Editing:', row);
  }
}
