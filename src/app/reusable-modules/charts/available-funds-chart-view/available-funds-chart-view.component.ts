import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Globals } from 'src/app/globals';
import { PlaidAccount, PlaidTransaction } from 'src/app/models/plaid';
import { FoundationService } from 'src/app/services/foundation.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-available-funds-chart-view',
  templateUrl: './available-funds-chart-view.component.html',
  styleUrls: ['./available-funds-chart-view.component.scss'],
})
export class AvailableFundsChartViewComponent implements OnInit {

  scopes: any[];
  scope: string = "Past1Month";

  public bankAccounts: PlaidAccount[] = [];
  bankAccountsAvailableSum: number = 0;
  scopedTransactions: PlaidTransaction[][];

  chartLabels: string[];
  chartValues: number[];
  chartOptions: any = {
    autoSkip: true,
    maxTicksLimit: 31
  };
  
  constructor(private globals: Globals, 
    private restApiService: RestApiService,
    private foundationService: FoundationService) { }

  ngOnInit() {
    this.scopes = [
      {
        label: 'Past 1 Month',
        value: 'Past1Month',
        default: true
      },
      {
        label: 'Past 2 Months',
        value: 'Past2Months',
        default: false
      },
      {
        label: 'Past 3 Months',
        value: 'Past3Months',
        default: false
      }
    ];
    this.onScopeChange(this.scope);
  }

  onScopeChange(scope: string, event?: any) {
    if (scope == null && event != null) {
      scope = event.detail.value;
    }
    this.scopedTransactions = null;
    let startDate: Date = new Date();
    let endDate: Date = new Date();
    if (scope === 'Past1Month') {
      startDate.setMonth(startDate.getMonth() - 1);
    }
    else if (scope === 'Past2Months') {
      startDate.setMonth(startDate.getMonth() - 2);
    }
    else if (scope === 'Past3Months') {
      startDate.setMonth(startDate.getMonth() - 3);
    }
    this.restApiService.getAccounts().subscribe(
      (returnedAccounts: PlaidAccount[]) => {
        this.foundationService.randomDataValuesIfPresentationMode('PlaidAccount', returnedAccounts);
        this.bankAccounts = returnedAccounts;
        let availableSum = 0;
        for (let account of this.bankAccounts) {
          availableSum += account.availableBalance;
        }
        this.bankAccountsAvailableSum = availableSum;
        let accountIds = this.bankAccounts.map((account) => account.accountId);
        this.restApiService.getTransactionsByAccountIdsInTimeRangeGrouped(accountIds, startDate, endDate).subscribe(
          (returnedScopedTransactions: PlaidTransaction[][]) => {
            this.foundationService.randomDataValuesIfPresentationModeDoubleDimensional('PlaidTransaction', returnedScopedTransactions);
            this.scopedTransactions = returnedScopedTransactions;
            this.updateChart();
          }
        );
      }
    );
  }

  updateChart() {
    let labels = [];
    let values = [];
    
    labels.push(moment(new Date()).format("MM/DD"));
    values.push(this.bankAccountsAvailableSum);
    let accumulatingBalance = this.bankAccountsAvailableSum;
    for (let transactionGroup of this.scopedTransactions) {
      let sumOfGroup = 0;
      for (let transaction of transactionGroup) {
        sumOfGroup += transaction.amount;
      }
      let dateLabel = new Date(transactionGroup[0].date);
      dateLabel.setDate(dateLabel.getDate());
      labels.push(moment(dateLabel).format("MM/DD"));
      accumulatingBalance -= sumOfGroup;
      values.push(accumulatingBalance);
    }
    this.chartLabels = labels;
    this.chartValues = values;
  }
}
