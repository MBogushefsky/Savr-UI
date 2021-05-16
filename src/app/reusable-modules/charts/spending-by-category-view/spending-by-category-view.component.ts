import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/globals';
import { PlaidAccount, PlaidTransaction } from 'src/app/models/plaid';
import { FoundationService } from 'src/app/services/foundation.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-spending-by-category-view',
  templateUrl: './spending-by-category-view.component.html',
  styleUrls: ['./spending-by-category-view.component.scss'],
})
export class SpendingByCategoryViewComponent implements OnInit {

  public bankAccounts: PlaidAccount[] = [];
  scopedTransactions: PlaidTransaction[];

  chartScope: string = "Past1Month";
  chartScopes: any[];
  chartLabels: string[];
  chartValues: number[];

  constructor(private globals: Globals, 
    private restApiService: RestApiService,
    private foundationService: FoundationService) { }

  ngOnInit() {
    this.chartScopes = [
      {
        label: 'Past 1 Month',
        value: 'Past1Month',
        default: true
      },
      {
        label: 'Past 2 Months',
        value: 'Past2Month',
        default: false
      },
      {
        label: 'Past 3 Months',
        value: 'Past3Month',
        default: false
      }
    ];
    this.onScopeChange(this.chartScope);
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
        let accountIds = this.bankAccounts.map((account) => account.accountId);
        this.restApiService.getTransactionsByAccountIdsInTimeRangeUngrouped(accountIds, startDate, endDate).subscribe(
          (returnedScopedTransactions: PlaidTransaction[]) => {
            this.foundationService.randomDataValuesIfPresentationMode('PlaidTransaction', returnedScopedTransactions);
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

    let categoriesFound: { [category: string]: PlaidTransaction[] } = {
      Unknown: []
    };
    let categoriesSpent: { [category: string]: number } = {
      Unknown: 0
    };

    this.scopedTransactions.forEach(
      (transaction: PlaidTransaction) => {
        let category;
        if (transaction.categories.length === 0) {
          category = 'Unknown'
        }
        else {
          category = transaction.categories[0];
        }
        if (categoriesFound[category] == null) {
          categoriesFound[category] = [];
        }
        if (categoriesSpent[category] == null) {
          categoriesSpent[category] = 0;
        }
        if (transaction.amount < 0) {
          categoriesSpent[category] += Math.abs(transaction.amount);
        }
        categoriesFound[category].push(transaction);
      }
    );
    for (let category in categoriesSpent) {
      labels.push(category);
      values.push(categoriesSpent[category]);
    }
    this.chartLabels = labels;
    this.chartValues = values;
  }

  /*loadOverallCategorySpentChart(spot: string) {
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
  }*/

}
