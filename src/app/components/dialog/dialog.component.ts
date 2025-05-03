import { Component, Inject, TemplateRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';  
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dialog',
  standalone: true,
  templateUrl: './dialog.component.html',
  imports: [
    CommonModule,        
    MatDialogModule,
    MatButtonModule,
    MatIcon
  ]
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      cls: string, 
      header: string, 
      content: TemplateRef<any> | string, 
      showButtons?:boolean, 
      confirmText?: string, 
      cancelText?: string,
      icon?:string 
    }
  ) {}

  isTemplateRef(content: any): content is TemplateRef<any> {
    return content instanceof TemplateRef;
  }
}