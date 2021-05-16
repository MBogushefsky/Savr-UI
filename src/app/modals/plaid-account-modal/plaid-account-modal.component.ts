import { KeyValue } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PlaidAccount, PlaidTransaction } from 'src/app/models/plaid';
import { FoundationService } from 'src/app/services/foundation.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-plaid-account-modal',
  templateUrl: './plaid-account-modal.component.html',
  styleUrls: ['./plaid-account-modal.component.scss'],
})
export class PlaidAccountModalComponent implements OnInit {
  @Input('plaidAccount') plaidAccount: PlaidAccount;

  transactionDisplayScope: string = "Past7Days";
  allTransactions: PlaidTransaction[] = [];

  scopedTransactionsByDate: Map<Date, PlaidTransaction[]> = new Map();

  constructor(private restApiService: RestApiService,
    private foundationService: FoundationService,
    private modalController: ModalController) { }

  ngOnInit() {
    this.loadTransactionsForAccount(this.plaidAccount.accountId);
  }

  loadTransactionsForAccount(accountId: string) {
    // this.restApiService.getTransactionsByAccountId(accountId).subscribe(
    //   (returnedTransactions: PlaidTransaction[]) => {
    //     this.foundationService.randomDataValuesIfPresentationMode('PlaidTransaction', returnedTransactions);
    //     this.allTransactions = returnedTransactions;
    //     this.onTranscationScopeChange(this.transactionDisplayScope);
    //   }
    // );
  }

  onTranscationScopeChange(scope: string, event?: any) {
    if (scope == null && event != null) {
      scope = event.detail.value;
    }
    this.scopedTransactionsByDate = new Map();
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
    let localScopedTransactionsByDate = new Map();
    for (let transaction of this.allTransactions) {
      let transactionDate = new Date(transaction.date);
      if ((startDate == null || transactionDate.getTime() >= startDate.getTime()) && (endDate == null || transactionDate.getTime() <= endDate.getTime())) {
        if (!localScopedTransactionsByDate.has(transaction.date)) {
          localScopedTransactionsByDate.set(transaction.date, [transaction]);
        }
        else {
          let oldList = localScopedTransactionsByDate.get(transaction.date);
          oldList.push(transaction);
          localScopedTransactionsByDate.set(transaction.date, oldList);
        }
      }
    }
    this.scopedTransactionsByDate = localScopedTransactionsByDate;
  }

  /*keyDescOrder = (a: KeyValue<Date,PlaidTransaction[]>, b: KeyValue<Date,PlaidTransaction[]>): number => {
    return a.key.getTime() > b.key.getTime() ? -1 : 1;
  }*/

  keepOrder = (a, b) => {
    return a;
  }

  getPreferredNameOfSubType(subType: string) {
    if (subType === 'checking') { return 'Checking'; }
    if (subType === 'savings') { return 'Savings'; }
    if (subType === 'credit card') { return 'Credit Card'; }
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
