import { Injectable, TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from './dialog.component';
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
  icon?:string;
  id?:string;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  private dialogRefs = new Map<string, MatDialogRef<DialogComponent, any>>();
  constructor(private dialog: MatDialog) {}

  openTemplate(data: DialogOptions): MatDialogRef<DialogComponent, any> {
    const defaults: Partial<DialogOptions> = {
      cls: '',
      panelClass: '',
      headCls: '',
      showButtons: false,
      confirmText: 'OK',
      cancelText: 'Cancel',
    };

    const dialogData = { ...defaults, ...data };

    const ref = this.dialog.open(DialogComponent, {
      width: dialogData.width,
      panelClass: dialogData.panelClass,
      data: dialogData,
    });

    if (dialogData.id) {
      this.dialogRefs.set(dialogData.id, ref);
      ref.afterClosed().subscribe(() => this.dialogRefs.delete(dialogData.id!));
    }

    return ref;
  }

  openConfirm(data: DialogOptions): Observable<boolean> {
    const completeData: DialogOptions = {
      confirmText: 'OK',
      cancelText: 'Cancel',
      showButtons: true,
      ...data,
    };

    const ref = this.dialog.open(DialogComponent, {
      panelClass: data.panelClass,
      data: completeData,
    });

    if (completeData.id) {
      this.dialogRefs.set(completeData.id, ref);
      ref.afterClosed().subscribe(() => this.dialogRefs.delete(completeData.id!));
    }

    return ref.afterClosed();
  }

  closeAll() {
    this.dialog.closeAll();
    this.dialogRefs.clear();
  }

  closeDialogById(id: string) {
    const ref = this.dialogRefs.get(id);
    if (ref) {
      ref.close();
      this.dialogRefs.delete(id);
    }
  }
}
