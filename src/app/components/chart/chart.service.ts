import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  dealsToChartData(deals: any[]): any {
    const monthlyData: Record<string, { revenue: number; cost: number }> = {};
  
    for (const deal of deals) {
      const date = new Date(deal.closeDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
  
      const value = parseFloat(deal.dealValue || '0');
      if (!monthlyData[key]) {
        monthlyData[key] = { revenue: 0, cost: 0 };
      }
  
      if (deal.revenueOrCost === 'revenue') {
        monthlyData[key].revenue += value;
      } else if (deal.revenueOrCost === 'cost') {
        monthlyData[key].cost += value;
      }
    }
  
    const sortedDates = Object.keys(monthlyData).sort();
  
    return {
      categories: sortedDates,
      series: [
        {
          name: 'Sales',
          data: sortedDates.map(date => monthlyData[date].revenue)
        },
        {
          name: 'Expenses',
          data: sortedDates.map(date => monthlyData[date].cost)
        }
      ]
    };
  }

  

}
