import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-priority-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="flex items-center gap-2">
  <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
    <div 
      class="h-full transition-all duration-300 ease-in-out"
      [style.width.%]="fillPercentage"
      [ngClass]="_priorityColor"
    ></div>
  </div>
  <!-- <span class="text-sm w-20 text-left">{{priority}}</span> -->
</div>
  `,
  styles: ``
})
export class PriorityWidgetComponent implements OnInit, OnChanges {
  @Input() priority: string = "Medium";
  
  private priorityLevels: string[] = [
    "Very Low",
    "Low",
    "Medium",
    "High",
    "Very High",
    "Critical"
  ];

  // Store calculated color
  protected _priorityColor: string = 'bg-gray-400';

  ngOnInit() {
    this.calculatePriorityColor();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['priority']) {
      this.calculatePriorityColor();
    }
  }

  get fillPercentage(): number {
    const index = this.priorityLevels.indexOf(this.priority);
    return (index + 1) / this.priorityLevels.length * 100;
  }

  private calculatePriorityColor(): void {
    switch(this.priority) {
      case "Very Low": 
        this._priorityColor = 'bg-green-500';
        break;
      case "Low": 
        this._priorityColor = 'bg-lime-500';
        break;
      case "Medium": 
        this._priorityColor = 'bg-amber-400';
        break;
      case "High": 
        this._priorityColor = 'bg-orange-500';
        break;
      case "Very High": 
        this._priorityColor = 'bg-orange-600';
        break;
      case "Critical": 
        this._priorityColor = 'bg-red-500';
        break;
      default: 
        this._priorityColor = 'bg-gray-400';
    }
  }
}