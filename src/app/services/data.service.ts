import { Injectable } from '@angular/core';
import { Observable, of, from, throwError, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import { Option } from '../form-builder/form-builder.model';
import { TreeNodeI } from '../components/folder-structure/folder-structure.component';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly employeesStorageKey = 'crm-employees';
  private readonly employeesJsonFile = 'assets/data/employees.json';

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<any[]> {
    // Try to get from localStorage first
    const storedEmployees = localStorage.getItem(this.employeesStorageKey);

    if (storedEmployees) {
      // Parse and return as observable
      try {
        const employees = JSON.parse(storedEmployees);
        return of(employees);
      } catch (error) {
        console.error('Error parsing stored employees', error);
        // If parsing fails, proceed to get from file
        return this.getEmployeesFromFile();
      }
    } else {
      // Not found in localStorage, get from file
      return this.getEmployeesFromFile();
    }
  }

  private getEmployeesFromFile(): Observable<any[]> {
    return this.http.get<any[]>(this.employeesJsonFile).pipe(
      catchError(error => {
        console.error('Error loading employees file', error);
        // Return empty array if file not found or other error
        return of([]);
      }),
      switchMap(employees => {
        // Save to localStorage for next time
        if (employees && employees.length > 0) {
          localStorage.setItem(this.employeesStorageKey, JSON.stringify(employees));
        }
        return of(employees);
      })
    );
  }

  getEmployeeOptions(): Observable<Option[]> {
    return this.getEmployees().pipe(
      map(employees =>
        employees.map(employee => ({
          label: employee.fullName,
          value: employee.id
        }))
      )
    );
  }

  updateEmployeeTasks(id: string, taskId: string): Observable<any> {
    return this.getEmployees().pipe(
      switchMap(employees => {
        const employeeIndex = employees.findIndex(emp => emp.id === id);
        //console.log('employeeIndex', employeeIndex)
        if (employeeIndex !== -1) {
          employees[employeeIndex].tasks.push(taskId);
          localStorage.setItem(this.employeesStorageKey, JSON.stringify(employees));
          return of(employees[employeeIndex]);
        }
        return of(null);
      }),
      catchError(error => {
        console.error('Error updating employee tasks', error);
        return of(null);
      })
    );
  }

  updateEmployeeRole(id: string, departmentId: string, role: string): Observable<any> {
    return this.getEmployees().pipe(
      switchMap(employees => {
        const employeeIndex = employees.findIndex(emp => emp.id === id);
        //console.log('employeeIndex', employeeIndex)
        if (employeeIndex !== -1) {
          employees[employeeIndex].department = departmentId;
          employees[employeeIndex].role = role;
          localStorage.setItem(this.employeesStorageKey, JSON.stringify(employees));
          return of(employees[employeeIndex]);
        }
        return of(null);
      }),
      catchError(error => {
        console.error('Error updating employee tasks', error);
        return of(null);
      })
    );
  }

  addEmployee(newEmployee: any): Observable<any[]> {
    return this.getEmployees().pipe(
      take(1),
      map(employees => {
        const updatedEmployees = [...employees, newEmployee];
        localStorage.setItem(this.employeesStorageKey, JSON.stringify(updatedEmployees));
        return updatedEmployees;
      }),
      catchError(error => {
        console.error('Error adding employee', error);
        return of([]);
      })
    );
  }

  updateEmployee(updatedEmployee: any): Observable<any[]> {
    return this.getEmployees().pipe(
      take(1),
      map(employees => {
        const index = employees.findIndex(e => e.id === updatedEmployee.id);
        if (index === -1) {
          console.warn('Employee not found for update:', updatedEmployee.id);
          return employees;
        }
        const updatedEmployees = [...employees];
        updatedEmployees[index] = updatedEmployee;
        localStorage.setItem(this.employeesStorageKey, JSON.stringify(updatedEmployees));
        return updatedEmployees;
      }),
      catchError(error => {
        console.error('Error updating employee', error);
        return of([]);
      })
    );
  }

  deleteEmployee(employeeId: string): Observable<any[]> {
    return this.getEmployees().pipe(
      take(1),
      map(employees => {
        const filteredEmployees = employees.filter(e => e.id !== employeeId);
        localStorage.setItem(this.employeesStorageKey, JSON.stringify(filteredEmployees));
        return filteredEmployees;
      }),
      catchError(error => {
        console.error('Error deleting employee', error);
        return of([]);
      })
    );
  }


  /** TASKS ********************************************************************************************** */

  private readonly tasksStorageKey = 'crm-tasks';
  private readonly tasksJsonFile = 'assets/data/tasks.json';

  getTasks(): Observable<any[]> {
    // Try to get from localStorage first
    const storedTasks = localStorage.getItem(this.tasksStorageKey);
    //console.log('storedTasks', storedTasks)
    if (storedTasks) {
      // Parse and return as observable
      try {
        const tasks = JSON.parse(storedTasks);
        return of(tasks);
      } catch (error) {
        console.error('Error parsing stored tasks', error);
        // If parsing fails, proceed to get from file
        return this.getTasksFromFile();
      }
    } else {
      // Not found in localStorage, get from file
      return this.getTasksFromFile();
    }
  }

  private getTasksFromFile(): Observable<any[]> {
    return this.http.get<any[]>(this.tasksJsonFile).pipe(
      catchError(error => {
        console.error('Error loading tasks file', error);
        // Return empty array if file not found or other error
        return of([]);
      }),
      switchMap(tasks => {
        // Save to localStorage for next time
        if (tasks && tasks.length > 0) {
          localStorage.setItem(this.tasksStorageKey, JSON.stringify(tasks));
        }
        return of(tasks);
      })
    );
  }

  updateTaskColumns(columnData: any): Observable<any> {
    return this.getTasks().pipe(
      switchMap(tasks => {
        localStorage.setItem(this.tasksStorageKey, JSON.stringify(columnData));
        return of(columnData);
      }),
      catchError(error => {
        console.error('Error updateTaskColumns', error);
        return of(null);
      })
    );
  }

  getTasksForEmployee(employeeId: string): Observable<any> {
    return this.getTasks().pipe(
      map((taskCols: any[]) => {
        return taskCols.map(col => ({
          ...col,
          tasks: col.tasks.filter((task: any) => task.data?.assignee === employeeId)
        }));
      }),
      catchError(error => {
        console.error('Error getTasksForEmployee', error);
        return of(null);
      })
    );
  }

  addTask(taskData: any): Observable<any> {
    taskData.data.id = Date.now().toString();
    return this.getTasks().pipe(
      switchMap((taskColumns: any[]) => {
        // Clone the array to avoid mutation issues
        const updatedColumns = [...taskColumns];
        
        // If no columns exist, create a new column with the task
        if (updatedColumns.length === 0) {
          updatedColumns.push({
            id: 'todo',
            title: 'To Do',
            tasks: [taskData]
          });
        } 
        else {
          // Add to first column (assuming it's the "To Do" column)
          updatedColumns[0].tasks.unshift(taskData); // unshift adds to beginning
        }
  
        // Save to localStorage
        localStorage.setItem(this.tasksStorageKey, JSON.stringify(updatedColumns));
        
        return of(updatedColumns);
      }),
      catchError(error => {
        console.error('Error adding task', error);
        return throwError(() => new Error('Failed to add task'));
      })
    );
  }
  
  updateTask(updatedTaskData: any): Observable<any> {
    return this.getTasks().pipe(
      switchMap((taskColumns: any[]) => {
        let taskFound = false;
        const updatedColumns = taskColumns.map(column => {
          const updatedTasks = column.tasks.map((task: any) => {
            if (task.data.id === updatedTaskData.data.id) {
              taskFound = true;
              return { ...task, ...updatedTaskData };
            }
            return task;
          });
          return { ...column, tasks: updatedTasks };
        });
  
        if (!taskFound) {
          return throwError(() => new Error('Task not found'));
        }
  
        localStorage.setItem(this.tasksStorageKey, JSON.stringify(updatedColumns));
        return of(updatedColumns);
      }),
      catchError(error => {
        console.error('Error updating task', error);
        return throwError(() => new Error('Failed to update task'));
      })
    );
  }

  addOrUpdateTask(taskData: any): Observable<any> {
    return taskData.data.id ? this.updateTask(taskData) : this.addTask(taskData);
  }

  deleteTask(taskId: string): Observable<any[]> {
    return this.getTasks().pipe(
      map((taskColumns: any[]) => {
        const updatedColumns = taskColumns.map(column => ({
          ...column,
          tasks: column.tasks.filter((task: any) => task.data.id !== taskId)
        }));
  
        localStorage.setItem(this.tasksStorageKey, JSON.stringify(updatedColumns));
        return updatedColumns;
      }),
      catchError(error => {
        console.error('Error deleting task', error);
        return throwError(() => new Error('Failed to delete task'));
      })
    );
  }

  /** TASKS TYPE ********************************************************************************************** */

  private readonly taskTypesStorageKey = 'crm-task-types';
  private readonly taskTypesJsonFile = 'assets/data/task-types.json';

  getTaskTypes(): Observable<any[]> {
    const storedTaskTypes = localStorage.getItem(this.taskTypesStorageKey);
    if (storedTaskTypes) {
      try {
        const tasks = JSON.parse(storedTaskTypes);
        return of(tasks);
      } catch (error) {
        console.error('Error parsing stored tasks', error);
        return this.getTaskTypesFromFile();
      }
    } else {
      return this.getTaskTypesFromFile();
    }
  }

  private getTaskTypesFromFile(): Observable<any[]> {
    return this.http.get<any[]>(this.taskTypesJsonFile).pipe(
      catchError(error => {
        return of([]);
      }),
      switchMap(tasks => {
        if (tasks && tasks.length > 0) {
          localStorage.setItem(this.taskTypesStorageKey, JSON.stringify(tasks));
        }
        return of(tasks);
      })
    );
  }

  /** DEPARTMENT**********************************************************************************8***** */

  private readonly departmentsStorageKey = 'crm-departments';
  private readonly departmentsJsonFile = 'assets/data/departments.json';

  getEmployeesForDepartment(departmentId: string): Observable<any[]> {
    return this.getEmployees().pipe(
      map(employees => employees.filter(e => e.department === departmentId)),
      catchError(error => {
        console.error('Error fetching department employees', error);
        return of([]); // Return empty array instead of null
      })
    );
  }

  getDepartments(): Observable<any[]> {
    // Try to get from localStorage first
    const storedDepartments = localStorage.getItem(this.departmentsStorageKey);

    if (storedDepartments) {
      // Parse and return as observable
      try {
        const departments = JSON.parse(storedDepartments);
        return of(departments);
      } catch (error) {
        console.error('Error parsing stored departments', error);
        // If parsing fails, proceed to get from file
        return this.getDepartmentsFromFile();
      }
    } else {
      // Not found in localStorage, get from file
      return this.getDepartmentsFromFile();
    }
  }

  getDepartmentOptions(): Observable<any[]> {
    const storedEmployees = localStorage.getItem(this.departmentsStorageKey);

    if (storedEmployees) {
      try {
        const departments = JSON.parse(storedEmployees);
        const mapped = departments.map((item: any) => ({
          label: item.label,
          value: item.label
        }));
        return of(mapped);
      } catch (error) {
        console.error('Error parsing stored employees', error);
        return this.getDepartmentsFromFile().pipe(
          map(departments => departments.map((item: any) => ({
            label: item.label,
            value: item.label
          })))
        );
      }
    } else {
      return this.getDepartmentsFromFile().pipe(
        map(departments => departments.map((item: any) => ({
          label: item.label,
          value: item.label
        })))
      );
    }
  }

  private getDepartmentsFromFile(): Observable<any[]> {
    return this.http.get<any[]>(this.departmentsJsonFile).pipe(
      catchError(error => {
        console.error('Error loading employees file', error);
        // Return empty array if file not found or other error
        return of([]);
      }),
      switchMap(employees => {
        // Save to localStorage for next time
        if (employees && employees.length > 0) {
          localStorage.setItem(this.departmentsStorageKey, JSON.stringify(employees));
        }
        return of(employees);
      })
    );
  }

  addDepartment(newDepartment: any): Observable<any[]> {
    return this.getDepartments().pipe(
      take(1),
      map(departments => {
        const updatedDepartments = [...departments, newDepartment];
        localStorage.setItem(this.departmentsStorageKey, JSON.stringify(updatedDepartments));
        return updatedDepartments;
      }),
      catchError(error => {
        console.error('Error adding department', error);
        return of([]);
      })
    );
  }

  updateDepartment(updatedDepartment: any): Observable<any[]> {
    return this.getDepartments().pipe(
      take(1),
      map(departments => {
        const index = departments.findIndex(d => d.id === updatedDepartment.id);
        if (index === -1) {
          console.warn('Department not found for update:', updatedDepartment.value);
          return departments;
        }
        const updatedDepartments = [...departments];
        updatedDepartments[index] = updatedDepartment;
        localStorage.setItem(this.departmentsStorageKey, JSON.stringify(updatedDepartments));
        return updatedDepartments;
      }),
      catchError(error => {
        console.error('Error updating department', error);
        return of([]);
      })
    );
  }

  deleteDepartment(departmentId: string): Observable<any[]> {
    return this.getDepartments().pipe(
      take(1),
      map(departments => {
        const filteredDepartments = departments.filter(d => d.id !== departmentId);
        localStorage.setItem(this.departmentsStorageKey, JSON.stringify(filteredDepartments));
        return filteredDepartments;
      }),
      catchError(error => {
        console.error('Error deleting department', error);
        return of([]);
      })
    );
  }

  /** COMPANY ******************************************************************************** */

  private readonly companiesStorageKey = 'crm-companies';
  private readonly companiesJsonFile = 'assets/data/companies.json';


  getCompanies(): Observable<any[]> {
    // Try to get from localStorage first
    const storedCompanies = localStorage.getItem(this.companiesStorageKey);

    if (storedCompanies) {
      // Parse and return as observable
      try {
        const companies = JSON.parse(storedCompanies);
        return of(companies);
      } catch (error) {
        console.error('Error parsing stored companies', error);
        // If parsing fails, proceed to get from file
        return this.getCompaniesFromFile();
      }
    } else {
      // Not found in localStorage, get from file
      return this.getCompaniesFromFile();
    }
  }

  private getCompaniesFromFile(): Observable<any[]> {
    return this.http.get<any[]>(this.companiesJsonFile).pipe(
      catchError(error => {
        console.error('Error loading companies file', error);
        // Return empty array if file not found or other error
        return of([]);
      }),
      switchMap(companies => {
        console.log('companies', companies)
        // Save to localStorage for next time
        if (companies && companies.length > 0) {
          localStorage.setItem(this.companiesStorageKey, JSON.stringify(companies));
        }
        return of(companies);
      })
    );
  }

  addCompany(newCompany: any): Observable<any[]> {
    return this.getCompanies().pipe(
      map((companies: any[]) => {
        // Generate a unique ID if not provided
        if (!newCompany.id) {
          newCompany.id = Date.now().toString();
        }

        const updatedCompanies = [...companies, newCompany];
        localStorage.setItem(this.companiesStorageKey, JSON.stringify(updatedCompanies));
        return updatedCompanies;
      })
    );
  }

  updateCompany(updatedCompany: any): Observable<any[]> {
    return this.getCompanies().pipe(
      map((companies: any[]) => {
        const updatedCompanies = companies.map(company =>
          company.id === updatedCompany.id ? { ...company, ...updatedCompany } : company
        );

        localStorage.setItem(this.companiesStorageKey, JSON.stringify(updatedCompanies));
        return updatedCompanies;
      })
    );
  }

  updateCompanyContacts(companyId: string | number, newContacts: any[]): Observable<any[]> {
    return this.getCompanies().pipe(
      map((companies: any[]) => {
        const updatedCompanies = companies.map(company => {
          if (company.id === companyId) {
            return { ...company, contacts: newContacts };
          }
          return company;
        });

        localStorage.setItem(this.companiesStorageKey, JSON.stringify(updatedCompanies));
        return updatedCompanies;
      })
    );
  }

  deleteCompany(companyId: string | number): Observable<any[]> {
    return this.getCompanies().pipe(
      map((companies: any[]) => {
        const updatedCompanies = companies.filter(company => company.id !== companyId);
        localStorage.setItem(this.companiesStorageKey, JSON.stringify(updatedCompanies));
        return updatedCompanies;
      })
    );
  }

  /** DEAL ******************************************************************************** */

  private readonly dealsStorageKey = 'crm-deals';
  private readonly dealsJsonFile = 'assets/data/deals.json';

  getDeals() {
    // Try to get from localStorage first
    const storedDeals = localStorage.getItem(this.dealsStorageKey);

    if (storedDeals) {
      try {
        const deals = JSON.parse(storedDeals);
        return of(deals);
      } catch (error) {
        console.error('Error parsing stored deals', error);
        return this.getDealsFromFile();
      }
    } else {
      return this.getDealsFromFile();
    }
  }

  private getDealsFromFile(): Observable<any[]> {
    return this.http.get<any[]>(this.dealsJsonFile).pipe(
      catchError(error => {
        console.error('Error loading companys file', error);
        return of([]);
      }),
      switchMap(deals => {
        if (deals && deals.length > 0) {
          localStorage.setItem(this.dealsStorageKey, JSON.stringify(deals));
        }
        return of(deals);
      })
    );
  }

  getDealsForCompany(companyId: string): Observable<any[]> {
    return this.getDeals().pipe(
      map((dealsMap: { [key: string]: any[] }) => {
        return dealsMap[companyId] || [];
      })
    );
  }

  addDeal(companyId: string, newDeal: any): Observable<any> {
    return this.getDeals().pipe(
      map((dealsMap: { [key: string]: any[] }) => {
        const companyDeals = dealsMap[companyId] || [];
        newDeal.id = Date.now().toString(); // or use UUID if preferred  
        companyDeals.push(newDeal);
        dealsMap[companyId] = companyDeals;
        localStorage.setItem(this.dealsStorageKey, JSON.stringify(dealsMap));
        return companyDeals;
      })
    );
  }

  updateDeal(companyId: string, updatedDeal: any): Observable<any> {
    return this.getDeals().pipe(
      map((dealsMap: { [key: string]: any[] }) => {
        const companyDeals = dealsMap[companyId] || [];
        const index = companyDeals.findIndex((d: any) => d.id === updatedDeal.id);  
        companyDeals[index] = updatedDeal;
        dealsMap[companyId] = companyDeals;
        localStorage.setItem(this.dealsStorageKey, JSON.stringify(dealsMap));
        return companyDeals;
      })
    );
  }

  deleteDeal(companyId: string, dealId: string | number): Observable<any> {
    return this.getDeals().pipe(
      map((dealsMap: { [key: string]: any[] }) => {
        const companyDeals = dealsMap[companyId] || [];
        console.log('companyDeals', companyDeals);
        dealsMap[companyId] = companyDeals.filter(deal => deal.id !== dealId);
        localStorage.setItem(this.dealsStorageKey, JSON.stringify(dealsMap));
        return dealsMap[companyId];
      })
    );
  }

  /** COMPANY ASSETS ******************************************************************************** */

  private readonly companyAssetsStorageKey = 'crm-company-assets';
  private readonly companyAssetsJsonFile = 'assets/data/company-assets.json';

  getCompanyAssets() {
    // Try to get from localStorage first
    const storedCompanyAssets = localStorage.getItem(this.companyAssetsStorageKey);

    if (storedCompanyAssets) {
      try {
        const companyAssets = JSON.parse(storedCompanyAssets);
        return of(companyAssets);
      } catch (error) {
        console.error('Error parsing stored company assets', error);
        return this.getCompanyAssetsFromFile();
      }
    } else {
      return this.getCompanyAssetsFromFile();
    }
  }

  private getCompanyAssetsFromFile(): Observable<any[]> {
    return this.http.get<any[]>(this.companyAssetsJsonFile).pipe(
      catchError(error => {
        console.error('Error loading company assets file', error);
        return of([]);
      }),
      switchMap(companyAssets => {
        //if (companyAssets && companyAssets.length > 0) {
          localStorage.setItem(this.companyAssetsStorageKey, JSON.stringify(companyAssets));
        //}
        return of(companyAssets);
      })
    );
  }

  getAssetsForCompany(companyId: string): Observable<any[]> {
    return this.getCompanyAssets().pipe(
      map((companyAssetsMap: { [key: string]: any[] }) => {
        return companyAssetsMap[companyId] || [];
      })
    );
  }

  updateCompanyAsset(companyId: string, updatedCompanyAsset: any): Observable<any> {
    return this.getCompanyAssets().pipe(
      map((companyAssetsMap: { [key: string]: any[] }) => {
        const companyAssets = companyAssetsMap[companyId] || [];

        const index = companyAssets.findIndex((a: any) => a.id === updatedCompanyAsset.id);

        if (index !== -1) {
          companyAssets[index] = updatedCompanyAsset; // Update existing
        } else {
          companyAssets.push(updatedCompanyAsset); // If it doesn't exist, add it
        }

        companyAssetsMap[companyId] = companyAssets;
        localStorage.setItem(this.companyAssetsStorageKey, JSON.stringify(companyAssetsMap));
        return companyAssets;
      })
    );
  }

  getCompaniesWithAssets(): Observable<any[]> {
    return forkJoin({
      companies: this.getCompanies(),
      assets: this.getCompanyAssets()
    }).pipe(
      map(({ companies, assets }) => {
        return companies.map(company => {
          const companyId = company.id?.toString(); 
          return {
            ...company,
            assets: assets[companyId] || []
          };
        });
      })
    );
  }

  getCompaniesWithAssetsTree(): Observable<TreeNodeI[]> {
    return forkJoin({
      companies: this.getCompanies(),
      assets: this.getCompanyAssets()
    }).pipe(
      map(({ companies, assets }) => {
        return companies.map(company => {
          const companyId = company.id?.toString();
          const companyAssets = assets[companyId] || [];
  
          return <TreeNodeI>{
            name: company.companyName,
            isFile: false,
            children: this.mapAssetsToTree(companyAssets, companyId)
          };
        });
      })
    );
  }
  
  private mapAssetsToTree(assets: any[], companyId:string): TreeNodeI[] {
    return assets.map(asset => {
      const node: TreeNodeI = {
        name: asset.name,
        isFile: asset.isFile
      };
  
      if (!asset.isFile && Array.isArray(asset.children)) {
        node.children = this.mapAssetsToTree(asset.children, companyId);
      }
      else if(asset.isFile){
        node.name = `${asset.name}`;
        node.path = companyId;
      }
  
      return node;
    });
  }  

  /** ROLES ******************************************************************************** */

  private readonly rolesStorageKey = 'crm-roles';
  private readonly rolesJsonFile = 'assets/data/roles.json';

  getRoles(): Observable<any[]> {
    const storedRoles = localStorage.getItem(this.rolesStorageKey);

    if (storedRoles) {
      try {
        const roles = JSON.parse(storedRoles);
        return of(roles);
      } catch (error) {
        console.error('Error parsing stored roles', error);
        return this.getRolesFromFile();
      }
    } else {
      return this.getRolesFromFile();
    }
  }

  getRoleOptions(): Observable<{ label: string; value: any }[]> {
    return this.getRoles().pipe(
      map(roles => roles.map(item => ({
        label: item.roleName,
        value: item.roleName
      })))
    );
  }

  private getRolesFromFile(): Observable<any[]> {
    return this.http.get<any[]>(this.rolesJsonFile).pipe(
      catchError(error => {
        console.error('Error loading roles file', error);
        return of([]);
      }),
      switchMap(roles => {
        console.log('roles', roles);
        if (roles && roles.length > 0) {
          localStorage.setItem(this.rolesStorageKey, JSON.stringify(roles));
        }
        return of(roles);
      })
    );
  }

  addRole(newRole: any): Observable<any[]> {
    return this.getRoles().pipe(
      map((roles: any[]) => {
        if (!newRole.id) {
          newRole.id = Date.now().toString();
        }

        const updatedRoles = [...roles, newRole];
        localStorage.setItem(this.rolesStorageKey, JSON.stringify(updatedRoles));
        return updatedRoles;
      })
    );
  }

  updateRole(updatedRole: any): Observable<any[]> {
    return this.getRoles().pipe(
      map((roles: any[]) => {
        const updatedRoles = roles.map(role =>
          role.id === updatedRole.id ? { ...role, ...updatedRole } : role
        );

        localStorage.setItem(this.rolesStorageKey, JSON.stringify(updatedRoles));
        return updatedRoles;
      })
    );
  }

  addOrUpdateRole(role:any): Observable<any[]> {
    if(role.id) return this.updateRole(role);
    return this.addRole(role);
  }

  updateRolePermissions(roleId: string | number, newPermissions: any[]): Observable<any[]> {
    return this.getRoles().pipe(
      map((roles: any[]) => {
        const updatedRoles = roles.map(role => {
          if (role.id === roleId) {
            return { ...role, permissions: newPermissions };
          }
          return role;
        });

        localStorage.setItem(this.rolesStorageKey, JSON.stringify(updatedRoles));
        return updatedRoles;
      })
    );
  }

  deleteRole(roleId: string | number): Observable<any[]> {
    return this.getRoles().pipe(
      map((roles: any[]) => {
        const updatedRoles = roles.filter(role => role.id !== roleId);
        localStorage.setItem(this.rolesStorageKey, JSON.stringify(updatedRoles));
        return updatedRoles;
      })
    );
  }

  /** FORMS ******************************************************************************** */

  private readonly formsStorageKey = 'crm-forms';
  private readonly formsJsonFile = 'assets/data/forms.json';

}

