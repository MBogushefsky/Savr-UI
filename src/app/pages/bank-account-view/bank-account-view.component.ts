import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import { ActivatedRoute } from '@angular/router';
import { PlaidAccount, PlaidTransaction } from 'src/app/models/plaid';
import { FoundationService } from 'src/app/services/foundation.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as Chart from 'chart.js';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-bank-account-view',
  templateUrl: './bank-account-view.component.html',
  styleUrls: ['./bank-account-view.component.scss'],
})
export class BankAccountViewComponent implements OnInit {
  accountId: string;
  account: PlaidAccount;
  accountHeader: string;

  constructor(private route: ActivatedRoute, 
    private foundationService: FoundationService, 
    private restApiService: RestApiService,
    private globals: Globals) {

  }

  ngOnInit() {
    this.accountId = this.route.snapshot.paramMap.get('id');
    this.restApiService.getAccountById(this.accountId).subscribe(
      (returnedAccount: PlaidAccount) => {
        this.account = returnedAccount;
        this.accountHeader = this.account.name + " (" + this.getPreferredNameOfSubType(this.account.subType) + ")";
      }
    );
  }

  getPreferredNameOfSubType(subType: string) {
    if (subType === 'checking') { return 'Checking'; }
    if (subType === 'savings') { return 'Savings'; }
    if (subType === 'credit card') { return 'Credit Card'; }
  }
}
