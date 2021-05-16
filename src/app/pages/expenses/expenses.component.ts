import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ActiveCharts, AvailableCharts } from 'src/app/models/chart';
import { Globals } from 'src/app/globals';
import { PlaidTransaction } from 'src/app/models/plaid';
import { RestApiService } from 'src/app/services/rest-api.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FoundationService } from 'src/app/services/foundation.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
})
export class ExpensesComponent implements OnInit {

  AvailableCharts = AvailableCharts;

  categoryDoughnutChart: Chart;

  categoryDoughnutChartInfo: any[];
  categoryTransactionsDoughnutChartInfo: any[];

  activeCharts: ActiveCharts = {
    spots: {
      topMiddle: null
    }
  };

  constructor(private globals: Globals, 
    private restApiService: RestApiService,
    private foundationService: FoundationService) { }

  ngOnInit() {
    
  }

  /*clickedChart(event: any, index?: number) {
    let pointClicked: any = this.categoryDoughnutChart.getElementsAtEvent(event)[0];
    if (pointClicked) {
      this.clickedChartIndex(pointClicked._index);
    }
  }

  clickedChartIndex(index: number) {
    if (this.activeCharts.spots.topMiddle.type === AvailableCharts.SpendingByCategory) {
      this.loadCategoryTransactionsSpentChart('topMiddle', this.categoryDoughnutChartInfo[index].category);
    }
  }

  backToChart(spot: string, chartToSet: AvailableCharts) {
    if (chartToSet === AvailableCharts.SpendingByCategory) {
      this.loadOverallCategorySpentChart(spot);
    }
  }

  hoverOverSliceEvent = (() => {
    let prevTarget;
    return (e, el) => {
      const section = el[0];
      if (prevTarget !== section) {
        const currentStyle = e.target.style;
        currentStyle.cursor = section ? 'pointer' : 'default';
      }
      prevTarget = section;
    }
  })();*/
}
