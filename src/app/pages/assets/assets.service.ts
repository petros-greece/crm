import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type AssetResponseType = 'json' | 'arraybuffer' | 'blob' | 'text' | 'pdfBlob';

/** Map each responseType to its actual data type */
interface AssetDataMap<T = any> {
  json: T;
  arraybuffer: ArrayBuffer;
  blob: Blob;
  text: string;
  pdfBlob: Blob;
}

/** Discriminated union of all possible file responses */
export type AssetResponse<T = any> =
  | { type: 'json'; data: AssetDataMap<T>['json'] }
  | { type: 'arraybuffer'; data: AssetDataMap['arraybuffer'] }
  | { type: 'blob'; data: AssetDataMap['blob'] }
  | { type: 'pdfBlob'; data: AssetDataMap['pdfBlob'] }
  | { type: 'text'; data: AssetDataMap['text'] };

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  constructor(private http: HttpClient) {}

  private getJson<T>(path: string): Observable<{ type: 'json'; data: T }> {
    return this.http.get<T>(`${environment.baseUrl}/assets/${path}`).pipe(
      map(data => ({ type: 'json' as const, data }))
    );
  }

  private getArrayBuffer(path: string): Observable<{ type: 'arraybuffer'; data: ArrayBuffer }> {
    return this.http.get(`${environment.baseUrl}/assets/${path}`, { responseType: 'arraybuffer' }).pipe(
      map(buffer => ({ type: 'arraybuffer' as const, data: buffer }))
    );
  }

  private getBlob(path: string): Observable<{ type: 'blob'; data: Blob }> {
    return this.http.get(`${environment.baseUrl}/assets/${path}`, { responseType: 'blob' }).pipe(
      map(blob => ({ type: 'blob' as const, data: blob }))
    );
  }

  private getPdfBlob(path: string): Observable<{ type: 'pdfBlob'; data: Blob }> {
    return this.http.get(`${environment.baseUrl}/assets/${path}`, { responseType: 'blob' }).pipe(
      map(blob => ({ type: 'pdfBlob' as const, data: blob }))
    );
  }

  private getText(path: string): Observable<{ type: 'text'; data: string }> {
    return this.http.get(`${environment.baseUrl}/assets/${path}`, { responseType: 'text' }).pipe(
      map(text => ({ type: 'text' as const, data: text }))
    );
  }

  /**
   * Generic file fetcher that infers the type correctly
   */
  getFile<T = unknown>(path: string): Observable<AssetResponse<T>> {
    const ext = path.split('.').pop()?.toLowerCase();

    switch (ext) {
      case 'json':
        return this.getJson<T>(path) as Observable<AssetResponse<T>>;

      case 'xlsx':
      case 'xls':
      case 'csv':
        return this.getArrayBuffer(path) as Observable<AssetResponse<T>>;

      case 'pdf':
        return this.getPdfBlob(path) as Observable<AssetResponse<T>>;

      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return this.getBlob(path) as Observable<AssetResponse<T>>;

      case 'txt':
      case 'html':
      case 'xml':
        return this.getText(path) as Observable<AssetResponse<T>>;

      default:
        // fallback to blob
        return this.getBlob(path) as Observable<AssetResponse<T>>;
    }
  }
}
