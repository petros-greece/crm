import { Injectable } from '@angular/core';
import { Observable, forkJoin, from, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Injectable()
export class TransferService {

  constructor() { }

  downloadLocalStorageAsZipFolder(): Observable<void> {
    return new Observable((observer) => {
      const zip = new JSZip();
      const folder = zip.folder('crm-data');

      if (!folder) {
        console.error('Failed to create crm-data folder in ZIP.');
        observer.error('Failed to create folder in ZIP.');
        return;
      }

      const keys = Object.keys(localStorage).filter(key => key !== 'debug');
      console.log('Exporting localStorage keys:', keys);

      const fileObservables = keys.map(key => {
        return new Observable<void>((subObserver) => {
          const value = localStorage.getItem(key);
          let parsed;

          try {
            parsed = JSON.parse(value!);
          } catch {
            parsed = value;
          }

          try {
            folder.file(`${key}.json`, JSON.stringify(parsed, null, 2));
            console.log(`Added ${key}.json to ZIP`);
            subObserver.next(); // Emit value after the file is added
            subObserver.complete();
          } catch (err) {
            console.error(`Failed to add file ${key}.json:`, err);
            subObserver.error(err);
          }
        });
      });

      // Wait for all "file creation" observables to complete
      forkJoin(fileObservables).pipe(
        switchMap(() => {
          console.log('All files added. Generating ZIP...');
          return from(zip.generateAsync({ type: 'blob' }));
        }),
        catchError((error) => {
          console.error('ZIP generation failed:', error);
          observer.error(error);
          return of(); // required fallback
        })
      ).subscribe({
        next: (content) => {
          console.log('Saving ZIP as crm-data.zip');
          saveAs(content, 'crm-data.zip');
          observer.complete();
        },
        error: (error) => {
          console.error('Error in final step:', error);
          observer.error(error);
        }
      });
    });
  }

  uploadAndRestoreLocalStorage(file: File): Observable<void> {
    return new Observable((observer) => {
      if (!file) {
        observer.error('No file selected.');
        return;
      }

      JSZip.loadAsync(file)
        .then((zip) => {
          const folderPrefix = Object.keys(zip.files).find(path =>
            /^crm-data[^/]*\/$/.test(path)
          );

          console.log(folderPrefix)

          if (!folderPrefix) {
            observer.error('No crm-data folder found in ZIP');
            return;
          }
          console.log(folderPrefix)
          const folder = zip.folder(folderPrefix);
          if (!folder) {
            observer.error('No crm-data folder found in ZIP');
            return;
          }
          console.log(folder)
          const fileObservables: Observable<void>[] = [];

          folder.forEach((relativePath, zipEntry) => {
            if (!zipEntry.dir) {
              const fileObservable = from(zipEntry.async('text')).pipe(
                map((fileContent) => {
                  const parsedData = JSON.parse(fileContent);
                  const key = relativePath.replace(/\.json$/, '');
                  localStorage.setItem(key, JSON.stringify(parsedData));
                })
              );
              fileObservables.push(fileObservable);
            }
          });
          console.log(fileObservables)
          forkJoin(fileObservables).subscribe({
            next: () => { },
            complete: () => observer.complete(),
            error: (err) => {
              console.error('Error during ZIP processing:', err);
              observer.error('Failed to process some files in ZIP: ' + err.message);
            },
          });
        })
        .catch((error) => {
          console.error('JSZip load failed:', error);
          observer.error('Error reading ZIP file: ' + error.message);
        });
    });
  }


}
