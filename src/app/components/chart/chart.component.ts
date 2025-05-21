import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import {
  NgApexchartsModule,
  ChartComponent,
  ApexChart,
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexDataLabels,
  ApexLegend,
  ApexTooltip,
  ApexPlotOptions
} from 'ng-apexcharts';


export type ChartConfig = Partial<{
  chart: ApexChart;
  series: ApexAxisChartSeries;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  plotOptions: ApexPlotOptions;
}>;
export type ChartData = { categories?: any[]; series?: ApexAxisChartSeries }

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponentWrapper implements OnInit, OnChanges {
  @ViewChild('chartElem') chartElem!: ChartComponent;

  @Input() config: ChartConfig = {};
  @Input() data: ChartData = {};

  chart!: ApexChart;
  series!: ApexAxisChartSeries;
  title!: ApexTitleSubtitle;
  xaxis!: ApexXAxis;
  yaxis!: ApexYAxis[];
  stroke!: ApexStroke;
  dataLabels!: ApexDataLabels;
  legend!: ApexLegend;
  tooltip!: ApexTooltip;
  plotOptions!: ApexPlotOptions;

  private defaults: Required<ChartConfig> = {
    chart: { type: 'line', height: 350, width: '100%', zoom: { enabled: true }, toolbar: { show: true } },
    series: [],
    title: { text: '' },
    xaxis: { categories: [], type: 'category' },
    yaxis: [],
    stroke: { curve: 'smooth' },
    dataLabels: { enabled: false },
    legend: { position: 'top' },
    tooltip: { enabled: true },
    plotOptions: {}
  };

  ngOnInit(): void {
    console.log('chart inited')
    this.updateChartOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('chart changed', changes)
    // // Only update if inputs change
    // if (!changes['config'] && !changes['data']) {
    //   return;
    // }
    // this.updateChartOptions();
  }

  private updateChartOptions(): void {
    console.log('chart updateChartOptions')
    // Merge defaults + config
    const cfg = { ...this.defaults, ...this.config };

    // Override with provided data
    if (this.data.series) {
      cfg.series = this.data.series;
    }
    if (this.data.categories) {
      cfg.xaxis = { ...cfg.xaxis, categories: this.data.categories };
    }

    // Assign final options
    this.chart = cfg.chart!;
    this.series = cfg.series!;
    this.title = cfg.title!;
    this.xaxis = cfg.xaxis!;
    this.yaxis = Array.isArray(cfg.yaxis) ? cfg.yaxis : [cfg.yaxis!];
    this.stroke = cfg.stroke!;
    this.dataLabels = cfg.dataLabels!;
    this.legend = cfg.legend!;
    this.tooltip = cfg.tooltip!;
    this.plotOptions = cfg.plotOptions!;
  }
}