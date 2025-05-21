import { ChartType } from "ng-apexcharts";
import { ChartConfig, ChartData } from "../../components/chart/chart.component";

const chartTitleStyle = {
  fontSize: '20px',
  fontFamily: 'Arial',
  fontWeight: 700
};

export class BillingVars {



  totalChartData: ChartData | null = null;
  totalChartConfig: ChartConfig | null = null;

  giveTotalChart(deals: any[]) {

    const { totalRevenue, totalCost } = this.calculateRevenueAndCost(deals);

    this.totalChartConfig = {
      chart: {
        type: 'bar' as ChartType,
        height: 300,
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      title: {
        text: 'Total Revenue & Cost',
        style: chartTitleStyle
      }
    };
    this.totalChartData = {
      series: [{
        data: [{
          x: 'Revenue',
          y: totalRevenue
        }, {
          x: 'Cost',
          y: totalCost,
          fillColor: 'rgba(255,40,40,.85)'
        }]
      }]
    };


  }

  private calculateRevenueAndCost(deals: any[]): { totalRevenue: number, totalCost: number } {
    let totalRevenue = 0;
    let totalCost = 0;

    for (const deal of deals) {
      const value = Number(deal.dealValue) || 0;
      if (deal.revenueOrCost === 'revenue') {
        totalRevenue += value;
      } else if (deal.revenueOrCost === 'cost') {
        totalCost += value;
      }
    }

    return { totalRevenue, totalCost };
  }

  totalPerCompanyChartData: ChartData | null = null;
  totalPerCompanyChartConfig: ChartConfig | null = null;

  giveTotalPerCompanyChart(deals: any[]) {
    const revenueMap = new Map<string, number>();
    const costMap = new Map<string, number>();

    for (const deal of deals) {
      const company = deal.company || 'Unknown';
      const value = Number(deal.dealValue) || 0;

      if (deal.revenueOrCost === 'revenue') {
        revenueMap.set(company, (revenueMap.get(company) || 0) + value);
      } else if (deal.revenueOrCost === 'cost') {
        costMap.set(company, (costMap.get(company) || 0) + value);
      }
    }

    const companies = Array.from(new Set([...revenueMap.keys(), ...costMap.keys()]));
    const revenueSeries = companies.map(c => revenueMap.get(c) || 0);
    const costSeries = companies.map(c => costMap.get(c) || 0);

    this.totalPerCompanyChartData = {
      series: [
        { name: 'Revenue', data: revenueSeries },
        { name: 'Cost', data: costSeries }
      ]
    };

    this.totalPerCompanyChartConfig = {
      chart: {
        type: 'bar',
        height: companies.length * 50,
        stacked: false
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      colors: ['#00b894', 'rgba(255,40,40,.85)'],
      yaxis: {
        title: { text: '' }
      },
      xaxis: {
        labels: {
          style: {
            fontSize: '12px'
          }
        },
        categories: companies
      } as any,
      title: {
        text: 'Total Revenue & Cost per Company',
        style: chartTitleStyle
      },
      tooltip: {
        shared: true,
        intersect: false
      }
    };
  }

  totalPerDealTypeChartData: ChartData | null = null;
  totalPerDealTypeChartConfig: ChartConfig | null = null;

  giveTotalPerDealTypeChart(deals: any[]): void {
    const dealTypeMap = new Map<string, number>();

    for (const deal of deals) {
      const type = deal.dealTypeName || 'Unknown';
      const value = Number(deal.dealValue) || 0;
      dealTypeMap.set(type, (dealTypeMap.get(type) || 0) + value);
    }

    const data = Array.from(dealTypeMap.entries()).map(([x, y]) => ({ x, y }));

    this.totalPerDealTypeChartData = {
      series: [
        {
          data
        }
      ]
    };

    this.totalPerDealTypeChartConfig = {
      chart: {
        type: 'treemap',
        height: 350
      },
      title: {
        text: 'Total Value per Deal Type',
        style: chartTitleStyle
      },
      tooltip: {
        y: {
          formatter: (value: number) => `$${value.toLocaleString()}`
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '14px',
          fontWeight: 600
        },
        formatter: function (text: string, opts: any) {
          return `${text}`;
        }
      },
    };
  }


}