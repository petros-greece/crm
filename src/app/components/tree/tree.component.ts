import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface TreeNodeI {
  name: string;
  children?: TreeNodeI[];
}

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [MatTreeModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <mat-tree #tree [dataSource]="dataSource" [childrenAccessor]="childrenAccessor">
    <!-- Leaf node -->
    <mat-tree-node *matTreeNodeDef="let node" matTreeNodePadding (click)="onNodeClick(node)">
      <button mat-icon-button disabled></button>
      {{node.name}}
    </mat-tree-node>

    <!-- Expandable node -->
    <mat-tree-node *matTreeNodeDef="let node; when: hasChild" matTreeNodePadding matTreeNodeToggle
                   [cdkTreeNodeTypeaheadLabel]="node.name" (click)="onNodeClick(node)">
      <button mat-icon-button matTreeNodeToggle
              [attr.aria-label]="'Toggle ' + node.name">
        <mat-icon class="mat-icon-rtl-mirror">
          {{tree.isExpanded(node) ? 'expand_more' : 'chevron_right'}}
        </mat-icon>
      </button>
      {{node.name}}
    </mat-tree-node>
  </mat-tree>
  `,
  styleUrl: './tree.component.scss'
})
export class TreeComponent {
  @Input() dataSource: TreeNodeI[] = [];
  @Output() nodeClicked = new EventEmitter<TreeNodeI>();

  childrenAccessor = (node: TreeNodeI) => node.children ?? [];

  hasChild = (_: number, node: TreeNodeI) => !!node.children && node.children.length > 0;

  onNodeClick(node: TreeNodeI) {
    this.nodeClicked.emit(node);
  }
}