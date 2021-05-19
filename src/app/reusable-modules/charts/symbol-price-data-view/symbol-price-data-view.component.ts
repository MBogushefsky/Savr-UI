import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Globals } from 'src/app/globals';
import { FoundationService } from 'src/app/services/foundation.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-symbol-price-data-view',
  templateUrl: './symbol-price-data-view.component.html',
  styleUrls: ['./symbol-price-data-view.component.scss'],
})
export class SymbolPriceDataViewComponent implements OnInit {
  @Input('symbol') symbol: string;

  scopes: any[];
  scope: string = "Realtime";

  symbolData: any;
  scopedData: any[];

  chartLabels: string[];
  chartValues: number[];
  chartOptions: any = {
    type: 'exchange',
    beginAtZero: false
  };
  
  constructor(private globals: Globals, 
    private restApiService: RestApiService,
    private foundationService: FoundationService) { }

  ngOnInit() {
    this.scopes = [
      {
        label: 'Past Year',
        value: 'PastYear',
        default: false
      },
      {
        label: 'Past 6 Months',
        value: 'Past6Months',
        default: false
      },
      {
        label: 'Past Month',
        value: 'PastMonth',
        default: false
      },
      {
        label: 'Past Week',
        value: 'PastWeek',
        default: false
      },
      {
        label: 'Past 3 Days',
        value: 'Past3Days',
        default: false
      },
      {
        label: 'Realtime',
        value: 'Realtime',
        default: true
      }
    ];
    this.onScopeChange(this.scope);
    this.restApiService.getSymbolMetadata(this.symbol, true).subscribe(
      (returnedData: any) => {
        this.symbolData = returnedData;
      }
    )
  }

  onScopeChange(scope: string, event?: any) {
    if (scope == null && event != null) {
      scope = event.detail.value;
    }
    let interval = null;
    let startDate: Date = new Date();
    let endDate: Date = new Date();
    if (scope === 'PastYear') {
      interval = '24hour';
      startDate.setFullYear(startDate.getFullYear() - 1);
    }
    else if (scope === 'Past6Months') {
      interval = '12hour';
      startDate.setMonth(startDate.getMonth() - 6);
    }
    else if (scope === 'PastMonth') {
      interval = '6hour';
      startDate.setMonth(startDate.getMonth() - 1);
    }
    else if (scope === 'PastWeek') {
      interval = '3hour';
      startDate.setDate(startDate.getDate() - 7);
    }
    else if (scope === 'Past3Days') {
      interval = '1hour';
      startDate.setDate(startDate.getDate() - 3);
    }
    else if (scope == 'Realtime') {
      interval = '1min';
      startDate = null;
      endDate = null;
    }

    this.restApiService.getSymbolPriceHistory(this.symbol, true, interval, startDate, endDate).subscribe(
      (returnedData: any) => {
        this.scopedData = returnedData.data;
        this.updateChart();
      }
    )

    // this.restApiService.getAccounts().subscribe(
    //   (returnedAccounts: PlaidAccount[]) => {
    //     this.foundationService.randomDataValuesIfPresentationMode('PlaidAccount', returnedAccounts);
    //     this.bankAccounts = returnedAccounts;
    //     let availableSum = 0;
    //     for (let account of this.bankAccounts) {
    //       availableSum += account.availableBalance;
    //     }
    //     this.bankAccountsAvailableSum = availableSum;
    //     let accountIds = this.bankAccounts.map((account) => account.accountId);
    //     this.restApiService.getTransactionsByAccountIdsInTimeRangeGrouped(accountIds, startDate, endDate).subscribe(
    //       (returnedScopedTransactions: PlaidTransaction[][]) => {
    //         this.foundationService.randomDataValuesIfPresentationModeDoubleDimensional('PlaidTransaction', returnedScopedTransactions);
    //         this.scopedTransactions = returnedScopedTransactions;
    //         this.updateChart();
    //       }
    //     );
    //   }
    // );
  }

  updateChart() {
    let labels = [];
    let values = [];
    this.scopedData = this.scopedData.filter((data) => data.open != null);
    this.symbolData.price = this.scopedData[0].open;
    labels = this.scopedData.map((result) => moment(result.date).format("YYYY-MM-DD hh:mm:ss a"));
    values = this.scopedData.map((result) => result.open)
    this.chartLabels = labels;
    this.chartValues = values;
  }

}
