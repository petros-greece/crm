import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Option } from './form-builder.model';

@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {
  private http: HttpClient = inject(HttpClient);
  
  constructor() { }

  getData(url: string, headers?: HttpHeaders): Observable<any> {
    return this.http.get(url, { headers });
  }

  getIcons(): Observable<any> {
    const icons = localStorage.getItem('crm-icons');
    if (icons) {
      return new Observable((observer) => {
        observer.next(JSON.parse(icons));
        observer.complete();
      });
    }
  
    // Fetch from file, save to localStorage, then return
    return new Observable((observer) => {
      this.getData('./assets/json/icons.json').subscribe((data) => {
        localStorage.setItem('crm-icons', JSON.stringify(data));
        observer.next(data);
        observer.complete();
      }, (error) => {
        observer.error(error);
      });
    });
  }

  getLists(): Observable<any> {
    const lists = localStorage.getItem('crm-lists');
    if (lists) {
      return new Observable((observer) => {
        observer.next(JSON.parse(lists));
        observer.complete();
      });
    }
  
    // Fetch from file, save to localStorage, then return
    return new Observable((observer) => {
      this.getData('./assets/json/lists.json').subscribe((data) => {
        localStorage.setItem('crm-lists', JSON.stringify(data));
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
    if(key === 'lists list'){
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

}
