import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ActiveCharts, AvailableCharts } from 'src/app/models/chart';
import { Globals } from 'src/app/globals';
import { PlaidTransaction } from 'src/app/models/plaid';
import { RestApiService } from 'src/app/services/rest-api.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FoundationService } from 'src/app/services/foundation.service';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
})
export class BudgetComponent implements OnInit {

  AvailableCharts = AvailableCharts;

  categoriesFound: { [category: string]: PlaidTransaction[] } = {
    Unknown: []
  };
  categoriesSpent: { [category: string]: number } = {
    Unknown: 0
  };

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
    this.restApiService.getAllTransactions().subscribe(
      (returnedTransactions: PlaidTransaction[]) => {
        this.foundationService.randomDataValuesIfPresentationMode('PlaidTransaction', returnedTransactions);
        returnedTransactions.forEach(
          (transaction: PlaidTransaction) => {
            if (transaction.categories.length === 0) {
              if (transaction.amount < 0) {
                this.categoriesSpent['Unknown'] += Math.abs(transaction.amount);
              }
              this.categoriesFound['Unknown'].push(transaction);
            }
            else {
              let category = transaction.categories[0];
              if (this.categoriesFound[category] == null) {
                this.categoriesFound[category] = [];
              }
              if (this.categoriesSpent[category] == null) {
                this.categoriesSpent[category] = 0;
              }
              if (transaction.amount < 0) {
                this.categoriesSpent[category] += Math.abs(transaction.amount / transaction.categories.length);
              }
              this.categoriesFound[category].push(transaction);
              /*transaction.categories.forEach(
                (category) => {
                  if (this.categoriesFound[category] == null) {
                    this.categoriesFound[category] = [];
                  }
                  if (this.categoriesSpent[category] == null) {
                    this.categoriesSpent[category] = 0;
                  }
                  if (transaction.amount < 0) {
                    this.categoriesSpent[category] += Math.abs(transaction.amount / transaction.categories.length);
                  }
                  this.categoriesFound[category].push(transaction);
                }
              );*/
            }
          }
        );
        this.categoryDoughnutChart = new Chart('category-data-chart', {
          type: 'doughnut',
          data: {
            datasets: [{
                data: [],
                backgroundColor: []
            }],
            labels: []
          },
          options: {
            title: {
              display: false
            },
            cutoutPercentage: 40,
            tooltips: {
              callbacks: {
                  label: function(tooltipItem, data) {
                    let labelForTooltip = data.labels[tooltipItem.index];
                    let dataSet = (<any>data.datasets[0]);
                    /*if (dataSet.transactions != null && dataSet.transactions[tooltipItem.index] != null) {
                      console.log(dataSet.transactions[tooltipItem.index])
                      let categoriesFound = [];
                      labelForTooltip += " (";
                      for (let transaction of dataSet.transactions[tooltipItem.index]) {
                        labelForTooltip += transaction.categories;
                      }
                      labelForTooltip += ")";
                    }*/
                    return labelForTooltip + ": $" + (<number>dataSet.data[tooltipItem.index]).toFixed(2);
                  }
              }
            },
            hover: {
              onHover: this.hoverOverSliceEvent
            },
            legend: {
              /*onHover: (() => {
                let prevTarget;
                return (e, el) => {
                  const section = el.index;
                  if (prevTarget !== section) {    
                    console.log(e, el);          
                    const currentStyle = e.target.style;
                    currentStyle.cursor = section ? 'pointer' : 'default';
                  }
                  prevTarget = section;
                }
              })(),*/
              onClick: (e, legendItem) => {
                this.clickedChartIndex(legendItem.index);
              }
            },
            plugins: {
              plugins: [ChartDataLabels],
              datalabels: {
                color: 'white',
                display: (context) => {
                  let sum = 0;
                  let dataArr = <number[]>context.chart.data.datasets[0].data;
                  dataArr.map(data => {
                      sum += data;
                  });
                  let percentage = (<number>context.chart.data.datasets[0].data[context.dataIndex])*100 / sum;
                  return percentage >= 5; 
                },
                formatter: (value, context) => {
                  let sum = 0;
                  let dataArr = <number[]>context.chart.data.datasets[0].data;
                  dataArr.map(data => {
                      sum += data;
                  });
                  let percentage = "~" + ((value / sum)* 100).toFixed(0)+"%";
                  return percentage;
                },
                labels: {
                  title: {
                    font: {
                      weight: 'bold'
                    }
                  }
                }
              }
            }
            /*plugins: [{
              afterLayout: function(chart) {
                chart.legend.legendItems.forEach(
                  (legendLabel, index) => {
                    let label = chart.data.labels[index];
                    let data = chart.data.datasets[0].data[index];
                    let sameCount = chart.data.datasets[0].sameCount[index];
        
                    legendLabel.text = label
                    return label;
                  }
                )
              }
            }]*/
          }
        });  
        this.loadOverallCategorySpentChart('topMiddle');
      }
    );
  }

  loadOverallCategorySpentChart(spot: string) {
    this.activeCharts.spots[spot] = {
      type: AvailableCharts.SpendingByCategory
    };
    this.categoryDoughnutChartInfo = [];
    let totalSpendingForEachOfAllCategories = 0;
    for (let category in this.categoriesFound) {
      let totalSpendingInCategory = this.categoriesSpent[category];
      totalSpendingForEachOfAllCategories += totalSpendingInCategory;
    }
    for (let category in this.categoriesSpent) {
      let percentOfSpendingInCategory = (this.categoriesSpent[category] / totalSpendingForEachOfAllCategories) * 100;
      if (percentOfSpendingInCategory >= 0.5) {
        let chartInformationOnCategory = {
          label: category + " (" + percentOfSpendingInCategory.toFixed(2) + "%)",
          category: category,
          data: this.categoriesSpent[category]
        };
        this.categoryDoughnutChartInfo.push(chartInformationOnCategory);
      }
    }
    this.categoryDoughnutChartInfo.sort((a, b) => b.data - a.data);
    /*let topChartInformation = [];
    for (let i = 0; i < 10; i++) {
      topChartInformation.push(allChartInfomation[i]);
    }*/
    let labels: string[] = this.categoryDoughnutChartInfo.map((info) => info.label);
    let data: number[] = this.categoryDoughnutChartInfo.map((info) => info.data);
    let backgroundColors: string[] = this.categoryDoughnutChartInfo.map(
      (info, index) => {
        if (info.category === 'Unknown') {
          return 'rgb(211,211,211)';
        }
        return this.globals.getRGBString(index);
      }
    );
    this.categoryDoughnutChart.data.labels = labels;
    this.categoryDoughnutChart.data.datasets[0].data = data;
    this.categoryDoughnutChart.data.datasets[0].backgroundColor = backgroundColors;
    this.categoryDoughnutChart.update(); 
  }

  loadCategoryTransactionsSpentChart(spot: string, category: string) {
    this.activeCharts.spots[spot] = {
      type: AvailableCharts.SingleCategorySpending,
      properties: { category: category },
      previous: AvailableCharts.SpendingByCategory
    };
    this.categoryTransactionsDoughnutChartInfo = [];
    let spendingTransactionsForCategory = this.categoriesFound[category].filter(
      (transaction) => transaction.amount < 0
    ).map((transaction) => { 
      let newTransaction = Object.assign({}, transaction);
      newTransaction.amount = Math.abs(newTransaction.amount); 
      return newTransaction;
    });
    let totalSpendingForAllTransactionInCategory = spendingTransactionsForCategory.map((transaction) => transaction.amount)
    .reduce(
      (acc, curr) => {
        let currentAbsValue = curr;
        return acc + currentAbsValue;
      }
    );

    for (let transaction of spendingTransactionsForCategory) {
      let absAmount = Math.abs(transaction.amount);
      let labelOfTransaction = (transaction.merchantName ? transaction.merchantName : transaction.name);
      let percentOfSpending = (absAmount / totalSpendingForAllTransactionInCategory) * 100;
      let foundIdenticalMerchant = this.categoryTransactionsDoughnutChartInfo.find((chartInfo) => chartInfo.label === labelOfTransaction);
      if (foundIdenticalMerchant != null) {
        foundIdenticalMerchant.data += absAmount;
        foundIdenticalMerchant.percent =  (foundIdenticalMerchant.data / totalSpendingForAllTransactionInCategory) * 100;
        foundIdenticalMerchant.transactions.push(transaction);
      }
      else {
        let chartInformation = {
          label: labelOfTransaction,
          percent: percentOfSpending.toFixed(2),
          category: category,
          data: absAmount,
          transactions: [transaction]
        };
        this.categoryTransactionsDoughnutChartInfo.push(chartInformation);
      }
    }
    this.categoryTransactionsDoughnutChartInfo.sort((a, b) => b.data - a.data);
    let labels: string[] = [];
    let data: number[] = [];
    let transactions: PlaidTransaction[][] = [];
    let backgroundColors: string[] = [];
    this.categoryTransactionsDoughnutChartInfo.forEach(
      (info, index) => {
        labels.push(info.label);
        data.push(info.data);
        transactions.push(info.transactions);
        backgroundColors.push(this.globals.getRGBString(index));
      }
    );
    this.categoryDoughnutChart.data.labels = labels;
    this.categoryDoughnutChart.data.datasets[0].data = data;
    (<any>this.categoryDoughnutChart.data.datasets[0]).transactions = transactions;
    this.categoryDoughnutChart.data.datasets[0].backgroundColor = backgroundColors;
    this.categoryDoughnutChart.update(); 
  }

  clickedChart(event: any, index?: number) {
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
  })();
}
