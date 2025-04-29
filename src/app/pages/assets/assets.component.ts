import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { TreeComponent, TreeNodeI } from '../../components/tree/tree.component';
import { AssetsVars } from './assets.vars';
import { DialogService } from '../../services/dialog.service';
import { CommonModule } from '@angular/common';
import { PreviewAssetComponent } from '../../components/preview-asset.component';

@Component({
  selector: 'app-assets',
  imports: [CommonModule, TreeComponent, PreviewAssetComponent],
  template: `
  <app-tree [dataSource]="assetsTree" (nodeClicked)="previewAsset($event)"></app-tree>
  <ng-template #previewAssetTmpl>
    <app-preview-asset [assetPath]="assetPath"></app-preview-asset>
  </ng-template>
  `,
  styleUrl: './assets.component.scss'
})
export class AssetsComponent extends AssetsVars {

  @ViewChild('previewAssetTmpl', { static: true }) previewAssetTmpl!: TemplateRef<any>;
  dialogService = inject(DialogService);
  assetPath = '';

  previewAsset(node: TreeNodeI) {
    if(node.children){ return }

    this.assetPath = node.name;
    this.dialogService.openTemplate({
      header: 'Preview Asset',
      content: this.previewAssetTmpl,
      panelClass: 'responsive-dialog'
    })
  
  }




}
