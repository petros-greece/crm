import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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


}
