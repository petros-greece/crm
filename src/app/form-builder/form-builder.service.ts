import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Option } from './form-builder.model';
import { DataService } from '../services/data.service';

@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {

  private http: HttpClient = inject(HttpClient);
  private dataService = inject(DataService);
  private readonly listsStorageKey = 'crm-lists';
  private readonly listsJsonFile = 'assets/json/lists.json';
  private readonly iconsStorageKey = 'crm-icons';
  private readonly iconsJsonFile = 'assets/json/icons.json';

  constructor() { }

  getData(url: string, headers?: HttpHeaders): Observable<any> {
    return this.http.get(url, { headers });
  }

  /**************************************************************************** */

  getIcons(): Observable<any> {
    const icons = localStorage.getItem(this.iconsStorageKey);
    if (icons) {
      return new Observable((observer) => {
        observer.next(JSON.parse(icons));
        observer.complete();
      });
    }

    // Fetch from file, save to localStorage, then return
    return new Observable((observer) => {
      this.getData(this.iconsJsonFile).subscribe((data) => {
        localStorage.setItem(this.iconsStorageKey, JSON.stringify(data));
        observer.next(data);
        observer.complete();
      }, (error) => {
        observer.error(error);
      });
    });
  }

  /**************************************************************************** */

  getLists(): Observable<any> {
    const lists = localStorage.getItem(this.listsStorageKey);
    if (lists) {
      return new Observable((observer) => {
        observer.next(JSON.parse(lists));
        observer.complete();
      });
    }

    // Fetch from file, save to localStorage, then return
    return new Observable((observer) => {
      this.getData(this.listsJsonFile).subscribe((data) => {
        localStorage.setItem(this.listsStorageKey, JSON.stringify(data));
        observer.next(data);
        observer.complete();
      }, (error) => {
        observer.error(error);
      });
    });
  }

  getList(key: string): Observable<any[]> {
    return this.getLists().pipe(
      map(all => {
        const list = all[key];
        if (!Array.isArray(list)) {
          throw new Error(`List “${key}” not found or not an array`);
        }
        return list;
      })
    );
  }

  getListOptions(key: string): Observable<Option[]> {
    if(key === 'crmEmployees'){
      console.log('gotten intlFormat;')
      return this.dataService.getEmployeeOptions()
    }

    
    else if (key === 'lists list') {
      return this.getListKeysOptions();
    }

    return this.getLists().pipe(
      map(all => {
        const list = all[key];
        if (!Array.isArray(list)) {
          throw new Error(`List "${key}" not found or not an array`);
        }
        // transform strings (or primitives) into { label, value } objects
        return (list as any[]).map(item => ({
          label: String(item),
          value: item
        }));
      })
    );
  }

  getListKeysOptions(): Observable<Option[]> {
    return this.getLists().pipe(
      map(all => {
        const keys = Object.keys(all);
        return keys.map(key => ({ label: key, value: key }));
      })
    );
  }

  addList(formData: { key: string, items: string[] }): Observable<any> {
    return this.getLists().pipe(
      map((lists: { [key: string]: string[] }) => {
        if (lists.hasOwnProperty(formData.key)) {
          throw new Error(`List "${formData.key}" already exists`);
        }
        lists[formData.key] = formData.items;
        localStorage.setItem(this.listsStorageKey, JSON.stringify(lists));
        return lists;
      })
    );
  }

  updateList(formData: { key: string, items: string[] }): Observable<any> {
    return this.getLists().pipe(
      map((lists: { [key: string]: string[] }) => {
        if (!lists.hasOwnProperty(formData.key)) {
          throw new Error(`List "${formData.key}" does not exist`);
        }
        lists[formData.key] = formData.items;
        localStorage.setItem(this.listsStorageKey, JSON.stringify(lists));
        return lists;
      })
    );
  }

  deleteList(listKey: string): Observable<any> {
    return this.getLists().pipe(
      map((lists: { [key: string]: string[] }) => {
        if (!lists.hasOwnProperty(listKey)) {
          throw new Error(`List "${listKey}" does not exist`);
        }
        delete lists[listKey];
        localStorage.setItem(this.listsStorageKey, JSON.stringify(lists));
        return lists;
      })
    );
  }


}
