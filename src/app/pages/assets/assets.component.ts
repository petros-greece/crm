import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TreeNodeI } from '../../components/tree/tree.component';
import { DialogService } from './../../components/dialog/dialog.service';
import { CommonModule } from '@angular/common';
import { PreviewAssetComponent } from '../../components/preview-asset.component';
import { FolderStructureComponent } from '../../components/folder-structure/folder-structure.component';
import { DataService } from '../../services/data.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-assets',
  imports: [CommonModule, PreviewAssetComponent, FolderStructureComponent],
  template: `
  <div class="crm-assets-con">
    <app-folder-structure [dataSourceInput]="assetsTree" pathPrefix="assets/"></app-folder-structure>
    <!-- <app-tree [dataSourceInput]="assetsTree" (nodeClicked)="previewAsset($event)"></app-tree> -->
  </div>
  <ng-template #previewAssetTmpl>
    <app-preview-asset [assetPath]="assetPath"></app-preview-asset>
  </ng-template>
  `,
  styleUrl: './assets.component.scss'
})
export class AssetsComponent implements OnInit {

  private destroy$ = new Subject<void>();

  @ViewChild('previewAssetTmpl', { static: true }) previewAssetTmpl!: TemplateRef<any>;
  dialogService = inject(DialogService);
  dataService = inject(DataService)
  assetPath = '';
  assetsTree: TreeNodeI[] = [];

  ngOnInit(): void {
    this.dataService.getCompaniesWithAssetsTree()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        console.log('data', data);
        this.assetsTree = data;
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  previewAsset(node: TreeNodeI) {
    if (node.children) { return }

    this.assetPath = node.name;
    this.dialogService.openTemplate({
      header: 'Preview Asset',
      content: this.previewAssetTmpl,
      panelClass: 'responsive-dialog'
    })

  }




}
