import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CdkTreeModule, NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../services/dialog.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UploadFileFieldComponent } from '../upload-file-field.component';

export interface TreeNodeI {
  name: string;
  isFile: boolean;
  children?: TreeNodeI[];
  isExpanded?: boolean;
}

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [CommonModule, MatTreeModule, MatButtonModule,UploadFileFieldComponent, MatIconModule, CdkTreeModule, MatFormFieldModule, FormsModule, MatInputModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent {

  @ViewChild('newFolderTmpl', { static: true }) newFolderTmpl!: TemplateRef<any>;
  @ViewChild('uploadFileTmpl', { static: true }) uploadFileTmpl!: TemplateRef<any>;


  
  @Input() set dataSourceInput(data: TreeNodeI[]) {
    this._data = data;
    this.dataSource.data = this._data;
    this.syncExpansionStates(this._data);
  }
  @Output() nodeClicked = new EventEmitter<TreeNodeI>();
  dialogService = inject(DialogService);

  treeControl = new NestedTreeControl<TreeNodeI>(node =>
    node.isFile ? [] : node.children ?? []
  );
  dataSource = new MatTreeNestedDataSource<TreeNodeI>();
  private _data: TreeNodeI[] = [];

  newFolderName = '';
  files:File[] = [];
  targetNode!: TreeNodeI;

  hasChild = (_: number, node: TreeNodeI) => !node.isFile && !!node.children && node.children.length > 0;

  /** EVENTS *************************************************** */

  onNodeClick(node: TreeNodeI) {
    this.nodeClicked.emit(node);
  }

  toggleNode(node: TreeNodeI) {
    node.isExpanded = !node.isExpanded;
    if (node.isExpanded) {
      this.treeControl.expand(node);
    } else {
      this.treeControl.collapse(node);
    }
  }

  addRootNode() {
    this.dialogService.openConfirm({
      cls: 'bg-violet-800 !text-white',
      header: 'Add Folder?',
      content: this.newFolderTmpl,
    })
      .subscribe(confirmed => {
        if (confirmed === true && this.newFolderName) {
          this._data = [...this._data, { name: this.newFolderName, isFile: false, isExpanded: false }];
          this.refreshTree();
        }
      });

  }

  addChildNode(targetNode: TreeNodeI) {
    this.dialogService.openConfirm({
      cls: 'bg-violet-800 !text-white',
      header: 'Add Folder?',
      content: this.newFolderTmpl,
    })
    .subscribe(confirmed => {
      if (confirmed === true && this.newFolderName) {
        const updatedTree = this.addChildImmutable(this._data, targetNode, {
          name: this.newFolderName,
          isFile: false,
          isExpanded: false,
          children: []
        });
        this._data = updatedTree;
        this.refreshTree();
      }
    });
  }

  openAddFiledDialog(targetNode: TreeNodeI){
    this.targetNode = targetNode;
    this.dialogService.openConfirm({
      cls: 'bg-violet-800 !text-white',
      header: 'Upload File',
      content: this.uploadFileTmpl,
      showButtons: false
    })
  }

  onAddFilesToList(files:File[]){
    this.files = files;
  }

  onAddFilesToTree(){
    let updatedTree: TreeNodeI[] = [];
    this.files.forEach((f)=>{
      updatedTree = this.addChildImmutable(this._data, this.targetNode, {
        name: f.name,
        isFile: true,
        isExpanded: false,
      });
    })
    this._data = updatedTree;
    this.refreshTree();
  }

  private addChildImmutable(
    nodes: TreeNodeI[],
    target: TreeNodeI,
    newChild: TreeNodeI
  ): TreeNodeI[] {
    return nodes.map(node => {
      if (node === target) {
        const updatedChildren = [...(node.children ?? []), newChild];
        return { ...node, isExpanded: true, children: updatedChildren };
      } else if (node.children) {
        return {
          ...node,
          children: this.addChildImmutable(node.children, target, newChild),
        };
      }
      return node;
    });
  }

  removeNode(target: TreeNodeI) {

    let extraMsg = '';
    if (target.children && target.children.length) {
      extraMsg = ' and all it\'s children'
    }

    this.dialogService.openConfirm({
      cls: 'bg-red-500',
      header: 'Remove Department?',
      content: `Are you sure you want to remove: ${target.name}${extraMsg}?`,
    })
      .subscribe(confirmed => {
        if (confirmed === true) {
          this._data = this.removeRecursively(this._data, target);
          this.refreshTree();
        }
      });

  }

  private removeRecursively(nodes: TreeNodeI[], target: TreeNodeI): TreeNodeI[] {
    return nodes
      .map(n => {
        if (n === target) return null;
        const updatedChildren = n.children
          ? this.removeRecursively(n.children, target)
          : undefined;
        return { ...n, children: updatedChildren };
      })
      .filter(n => n !== null) as TreeNodeI[];
  }

  /** SYNCING *************************************************** */

  private refreshTree() {
    this.dataSource.data = [...this._data];
    this.syncExpansionStates(this._data);
  }

  private syncExpansionStates(nodes: TreeNodeI[]) {
    this.treeControl.dataNodes = nodes;
    this.treeControl.collapseAll();
    this.traverseNodes(nodes, node => {
      if (node.isExpanded) {
        this.treeControl.expand(node);
      }
    });
  }

  private traverseNodes(nodes: TreeNodeI[], cb: (n: TreeNodeI) => void) {
    nodes.forEach(n => {
      cb(n);
      if (n.children) this.traverseNodes(n.children, cb);
    });
  }


}
