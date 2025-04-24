import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private http: HttpClient = inject(HttpClient);
  
  constructor() { }

  getData(url: string, headers?: HttpHeaders): Observable<any> {
    return this.http.get(url, { headers });
  }
}
