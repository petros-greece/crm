/* folder-structure.component.ts */
import { Component, inject, Input, OnChanges, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { DialogService } from '../dialog/dialog.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { UploadFileFieldComponent } from '../upload-file-field.component';
import { PreviewAssetComponent } from '../preview-asset.component';

export interface TreeNodeI {
  name: string;
  isFile: boolean;
  children?: TreeNodeI[];
  path?: string;
}

@Component({
  selector: 'app-folder-structure',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    MatIconModule, 
    MatButtonModule,
    MatToolbarModule, 
    MatListModule, 
    MatMenuModule, 
    MatFormFieldModule,
    MatInputModule,
    UploadFileFieldComponent,
    PreviewAssetComponent
  ],
  templateUrl: './folder-structure.component.html',
  styleUrls: ['./folder-structure.component.scss']
})
export class FolderStructureComponent implements OnChanges{
  @Input() dataSourceInput: TreeNodeI[] = [];
  @Input() pathPrefix: string = '';
  @ViewChild('addFolderTmpl', { static: true }) addFolderTmpl!: TemplateRef<any>;
  @ViewChild('addFileTmpl', { static: true }) addFileTmpl!: TemplateRef<any>;

  dialogService = inject(DialogService);

  // Breadcrumb path: list of nodes from root to current
  path: { nodes: TreeNodeI[]; label: string }[] = [];
  currentNodes: TreeNodeI[] = [];
  selectedFileName: string | null = null;
  newFolderName = '';
  files:File[] = [];

  ngOnInit() {
    this.reset();
  }

  ngOnChanges() {
    if (this.dataSourceInput) {
      this.reset();
    }
  }

  private reset() {
    this.path = [{ nodes: this.dataSourceInput, label: 'Root' }];
    this.currentNodes = this.dataSourceInput;
    this.clearSelection();
  }

  navigateTo(index: number) {
    this.path = this.path.slice(0, index + 1);
    this.currentNodes = this.path[index].nodes;
    this.clearSelection();
  }

  onFolderClick(node: TreeNodeI) {
    if (!node.isFile && node.children) {
      this.path.push({ nodes: node.children, label: node.name });
      this.currentNodes = node.children;
      this.clearSelection();
    }
  }

  onFileClick(node: TreeNodeI) {
    const path = node.path ? node.path + '/' : '';
    this.selectedFileName = path + node.name;
  }

  private clearSelection() {
    this.selectedFileName = null;
  }

  /** ADD FILE FOLDER *************************************************** */

  openAddFolderDialog(){
    this.newFolderName = '';
    this.dialogService.openConfirm({
      content: this.addFolderTmpl,
      header: `Add Folder`,
      cls: 'bg-violet-800 !text-white',
      confirmText: 'OK'
    }).subscribe(confirmed=>{
      //console.log(this.currentNodes)
      if(confirmed === true && this.newFolderName){
        this.currentNodes.push({name: this.newFolderName, isFile: false, children: []})
      }
    })
  }

  openAddFileDialog(){
    this.files = [];
    this.dialogService.openConfirm({
      content: this.addFileTmpl,
      header: `Add Files`,
      cls: 'bg-violet-800 !text-white',
      confirmText: 'Add'
    }).subscribe(confirmed=>{
      if(confirmed === true && this.files.length){
        this.files.forEach((f)=>{
          this.currentNodes.push({name: f.name, isFile: true})
        });
        
      }
    })

  }

  /***************************************************** */

}
