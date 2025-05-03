import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import { Option } from '../form-builder/form-builder.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly employeesStorageKey = 'crm-employees';
  private readonly employeesJsonFile = 'assets/data/employees.json'; // Adjust path as needed

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

  // New method to get employee options
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

  updateEmployeeRole(id: string, departmentId:string, role:string): Observable<any> {
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


  /************************************************************************************************ */

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

  updateTaskColumns(columnData:any):Observable<any> {
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
  

  /************************************************************************************8***** */

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
    const storedEmployees = localStorage.getItem(this.departmentsStorageKey);
    
    if (storedEmployees) {
      // Parse and return as observable
      try {
        const employees = JSON.parse(storedEmployees);
        return of(employees);
      } catch (error) {
        console.error('Error parsing stored employees', error);
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
          value: item.id
        }));
        return of(mapped);
      } catch (error) {
        console.error('Error parsing stored employees', error);
        return this.getDepartmentsFromFile().pipe(
          map(departments => departments.map((item: any) => ({
            label: item.label,
            value: item.id
          })))
        );
      }
    } else {
      return this.getDepartmentsFromFile().pipe(
        map(departments => departments.map((item: any) => ({
          label: item.label,
          value: item.id
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



}

