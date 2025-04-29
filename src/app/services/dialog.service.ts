import { Injectable, TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../components/dialog/dialog.component';
import { Observable } from 'rxjs';

export interface DialogOptions {
  cls?: string;
  header: string;
  content: TemplateRef<any> | ComponentType<any> | string;
  panelClass?: string;
  width?: string;
  headCls?: string;
  showButtons?: boolean;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openTemplate(
    data: DialogOptions
  ): MatDialogRef<DialogComponent, any> {
    // Set up defaults, then override with whatever the caller passed:
    const defaults: Partial<DialogOptions> = {
      cls: '',
      panelClass: '',
      headCls: '',
      showButtons: false,
      confirmText: 'OK',
      cancelText: 'Cancel'
    };
    const dialogData = { ...defaults, ...data };

    return this.dialog.open(DialogComponent, {
      width: dialogData.width,
      panelClass: dialogData.panelClass,
      data: dialogData
    });
  }

 
  openConfirm(
    data: DialogOptions,
  ): Observable<boolean> {
    
    const completeData = {
      confirmText: 'OK',
      cancelText: 'Cancel',
      showButtons: true,
      ...data, // override defaults if data has values
    };
  
    const ref = this.dialog.open(DialogComponent, {
      panelClass: data.panelClass,
      data: completeData,
    });
  
    return ref.afterClosed();
  }
  

  /**
   * Closes all open dialogs.
   */
  closeAll() {
    this.dialog.closeAll();
  }
}
