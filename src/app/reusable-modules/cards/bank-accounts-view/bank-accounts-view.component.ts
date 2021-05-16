import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Globals } from 'src/app/globals';
import { PlaidAccount, PlaidTransaction } from 'src/app/models/plaid';
import { FoundationService } from 'src/app/services/foundation.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-bank-accounts-view',
  templateUrl: './bank-accounts-view.component.html',
  styleUrls: ['./bank-accounts-view.component.scss'],
})
export class BankAccountsViewComponent implements OnInit {
  @Input('header') header: string;
  @Input('accounts') accounts: PlaidAccount[];

  allTransactions: PlaidTransaction[] = [];

  transactionDisplayScope: string = "Past7Days";
  scopedTransactions: PlaidTransaction[][];

  unorderedScopedTransactionsByDate: PlaidTransaction[];
  pieTransactionSpendingChart: Chart;

  constructor(private route: ActivatedRoute, 
    private foundationService: FoundationService, 
    private restApiService: RestApiService,
    private globals: Globals) { }

  ngOnInit() {
    this.onTranscationScopeChange(this.transactionDisplayScope);
  }

  getPreferredNameOfSubType(subType: string) {
    if (subType === 'checking') { return 'Checking'; }
    if (subType === 'savings') { return 'Savings'; }
    if (subType === 'credit card') { return 'Credit Card'; }
  }

  onTranscationScopeChange(scope: string, event?: any) {
    if (scope == null && event != null) {
      scope = event.detail.value;
    }
    this.scopedTransactions = null;
    let startDate: Date = new Date();
    let endDate: Date = new Date();
    if (scope === 'Past7Days') {
      startDate.setDate(startDate.getDate() - 7);
      this.getTransactionsBetweenDates(startDate, endDate);
    }
    else if (scope === 'Past30Days') {
      startDate.setDate(startDate.getDate() - 30);
      this.getTransactionsBetweenDates(startDate, endDate);
    }
    else if (scope === 'All') {
      this.getTransactionsBetweenDates(null, null);
    }
  }

  getTransactionsBetweenDates(startDate: Date, endDate: Date) {
    let accountIds = this.accounts.map((account) => account.accountId);
    this.restApiService.getTransactionsByAccountIdsInTimeRangeGrouped(accountIds, startDate, endDate).subscribe(
      (returnedScopedTransactions: PlaidTransaction[][]) => {
        this.foundationService.randomDataValuesIfPresentationModeDoubleDimensional('PlaidTransaction', returnedScopedTransactions);
        this.scopedTransactions = returnedScopedTransactions;
      }
    );
  }

  /*initializeChart() {
    this.pieTransactionSpendingChart = new Chart('pie-transaction-spending-data-chart', {
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
        // tooltips: {
        //   callbacks: {
        //       label: function(tooltipItem, data) {
        //         let labelForTooltip = data.labels[tooltipItem.index];
        //         let dataSet = (<any>data.datasets[0]);
        //         return labelForTooltip + ": $" + (<number>dataSet.data[tooltipItem.index]).toFixed(2);
        //       }
        //   }
        // },
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
      }
    });  
  }

  loadData() {
    let spendingTransactions = this.unorderedScopedTransactionsByDate;
    spendingTransactions.filter((transaction) => transaction.amount < 0);
    let labels: string[] = spendingTransactions.map((transaction) => {
      if (transaction.merchantName == null) {
        return transaction.name;
      }
      return transaction.merchantName;
    });
    let data: number[] = spendingTransactions.map((transaction) => -1 * transaction.amount);
    let backgroundColors: string[] = spendingTransactions.map(
      (info, index) => {
        return this.globals.getRGBString(index);
      }
    );
    this.pieTransactionSpendingChart.data.labels = labels;
    this.pieTransactionSpendingChart.data.datasets[0].data = data;
    this.pieTransactionSpendingChart.data.datasets[0].backgroundColor = backgroundColors;
    this.pieTransactionSpendingChart.update(); 
  }*/

}
