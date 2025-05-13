import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  constructor() { }

  downloadLocalStorageAsZipFolder(): Observable<void> {
    return new Observable((observer) => {
      const zip = new JSZip();
      const folder = zip.folder('crm-data');
      
      if (!folder) {
        observer.error('Failed to create folder in ZIP.');
        return;
      }
  
      const keys = Object.keys(localStorage).filter(key => key !== 'debug');
      const fileObservables = keys.map(key => {
        return new Observable((subObserver) => {
          const value = localStorage.getItem(key);
          let parsed;
  
          try {
            parsed = JSON.parse(value!);
          } catch {
            parsed = value;
          }
  
          // Each key becomes a file inside 'crm-data' folder
          folder.file(`${key}.json`, JSON.stringify(parsed, null, 2));
          subObserver.next(null); // Emit value after the file is added
          subObserver.complete(); // Complete observable
        });
      });
  
      // Use switchMap to handle file processing
      from(fileObservables)
        .pipe(
          switchMap(() => zip.generateAsync({ type: 'blob' })),
          catchError((error) => {
            observer.error(error);
            return [];
          })
        )
        .subscribe({
          next: (content) => {
            saveAs(content, 'crm-data.zip');
            observer.complete();
          },
          error: (error) => observer.error(error),
        });
    });
  }

  uploadAndRestoreLocalStorage(event: Event): Observable<void> {
    return new Observable((observer) => {
      const input = event.target as HTMLInputElement;
      const file = input?.files?.[0];
      
      if (!file) {
        observer.error('No file selected.');
        return;
      }
  
      JSZip.loadAsync(file)
        .then((zip) => {
          const folder = zip.folder('crm-data');
          
          if (!folder) {
            observer.error('No crm-data folder found in ZIP');
            return;
          }
  
          const fileObservables:any = [];
          
          folder.forEach((relativePath, zipEntry) => {
            if (!zipEntry.dir) { // Skip directories
              const fileObservable = from(zipEntry.async('text')).pipe(
                switchMap((fileContent) => {
                  try {
                    const parsedData = JSON.parse(fileContent);
                    const key = relativePath.replace('.json', '');
                    // Update localStorage with parsed data
                    localStorage.setItem(key, JSON.stringify(parsedData));
                    return [];
                  } catch (error) {
                    observer.error('Error parsing JSON for file ' + relativePath);
                    return [];
                  }
                }),
                catchError((error) => {
                  observer.error('Error processing file ' + relativePath);
                  return [];
                })
              );
              fileObservables.push(fileObservable);
            }
          });
  
          // Use from to process all file observables
          from(fileObservables).subscribe({
            next: () => {},
            complete: () => observer.complete(),
            error: (error) => observer.error(error),
          });
        })
        .catch((error) => {
          observer.error('Error reading ZIP file: ' + error);
        });
    });
  }

}
