import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import * as moment from 'moment';
import {
  PlaidErrorMetadata,
  PlaidErrorObject,
  PlaidEventMetadata,
  PlaidOnEventArgs,
  PlaidOnExitArgs,
  PlaidOnSuccessArgs,
  PlaidSuccessMetadata,
  PlaidConfig,
  NgxPlaidLinkService,
  PlaidLinkHandler
} from "ngx-plaid-link";
import { Globals } from 'src/app/globals';
import { PlaidAccount, PlaidTransaction } from 'src/app/models/plaid';
import { FoundationService } from 'src/app/services/foundation.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  
  public plaidAccounts: PlaidAccount[] = [];
  public plaidAccountsTotalBalance: number = 0;
  public plaidTransactions: PlaidTransaction[] = [];

  constructor(private globals: Globals, 
    private restApiService: RestApiService,
    private foundationService: FoundationService) { 

  }

  ngOnInit() {
    this.restApiService.getAccounts().subscribe(
      (returnedAccounts: PlaidAccount[]) => {
        this.foundationService.randomDataValuesIfPresentationMode('PlaidAccount', returnedAccounts);
        this.plaidAccounts = returnedAccounts;
        let accountTransactionsLoadCounter = this.plaidAccounts.length;
        for (let account of this.plaidAccounts) {
          this.plaidAccountsTotalBalance += account.availableBalance;
          this.restApiService.getTransactionsByAccountId(account.accountId).subscribe(
            (returnedTransactions: PlaidTransaction[]) => {
              this.foundationService.randomDataValuesIfPresentationMode('PlaidTransaction', returnedTransactions);
              accountTransactionsLoadCounter--;
              this.plaidTransactions = this.plaidTransactions.concat(returnedTransactions);
              if (accountTransactionsLoadCounter === 0) {
                let dataDict: Map<string, number> = new Map();
                let previousTransactionsAccumulatingSum = this.plaidAccountsTotalBalance;
                for (let i = 0; i < 30; i++) {
                  let dateToCheck = moment().subtract(i, "days").format("YYYY-MM-DD");
                  let previousTransactionsSum = 0;
                  this.plaidTransactions.forEach((transaction) => {
                    if (transaction.date === dateToCheck) {
                      previousTransactionsSum += transaction.amount;
                    }
                  });
                  previousTransactionsAccumulatingSum -= previousTransactionsSum;
                  if (i === 0) {
                    dataDict.set(dateToCheck, this.plaidAccountsTotalBalance)
                  }
                  else {
                    dataDict.set(dateToCheck, previousTransactionsAccumulatingSum);
                  }
                }
                this.loadAvailableFundsLineChart(dataDict);
              }
            }
          );
        }
      }
    );
    
  }

  loadAvailableFundsLineChart(dataMap: Map<string, number>) {
    var availableFundsLineChart = new Chart('data-chart', {
      type: 'line',
      data: {
        labels: Array.from(dataMap.keys()).reverse().map(
          (dateKey) => {
            if (dateKey === moment().format("YYYY-MM-DD")) {
              return 'Today';
            }
            else if (dateKey === moment().subtract(1, "days").format("YYYY-MM-DD")) {
              return 'Yesterday';
            }
            return moment(dateKey).format("MM-DD");
          }
        ),
        datasets: [
          {
            label: 'Available Funds',
            data: Array.from(dataMap.values()).reverse(),
            borderWidth: 3,
            fill: false,
            backgroundColor: 'rgb(173,216,230)',
            borderColor: 'rgb(173,216,230)'
          }
        ]
      },
      options: {
        scales: {
            yAxes: [{
                ticks: {
                  beginAtZero: true,
                  callback: function(value, index, values) {
                      return '$' + value;
                  }
                }
            }]
        },
        plugins: {
          datalabels: {
            display: false,
            formatter: (value, context) => {
              return value.toFixed(2);
            }
          }
        }
      }
    });
  }

}
