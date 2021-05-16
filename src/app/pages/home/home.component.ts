import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/globals';
import { PlaidAccount, PlaidTransaction } from 'src/app/models/plaid';
import { FoundationService } from 'src/app/services/foundation.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  
  public plaidAccounts: PlaidAccount[];

  constructor(private globals: Globals, 
    private restApiService: RestApiService,
    private foundationService: FoundationService) { 

  }

  ngOnInit() {
    this.restApiService.getAccounts().subscribe(
      (returnedAccounts: PlaidAccount[]) => {
        this.foundationService.randomDataValuesIfPresentationMode('PlaidAccount', returnedAccounts);
        this.plaidAccounts = returnedAccounts;
      }
    );
    // this.restApiService.getAccounts().subscribe(
    //   (returnedAccounts: PlaidAccount[]) => {
    //     this.foundationService.randomDataValuesIfPresentationMode('PlaidAccount', returnedAccounts);
    //     this.plaidAccounts = returnedAccounts;
    //     let accountTransactionsLoadCounter = this.plaidAccounts.length;
    //     for (let account of this.plaidAccounts) {
    //       this.plaidAccountsTotalBalance += account.availableBalance;
    //       this.restApiService.getTransactionsByAccountId(account.accountId).subscribe(
    //         (returnedTransactions: PlaidTransaction[]) => {
    //           this.foundationService.randomDataValuesIfPresentationMode('PlaidTransaction', returnedTransactions);
    //           accountTransactionsLoadCounter--;
    //           this.plaidTransactions = this.plaidTransactions.concat(returnedTransactions);
    //           if (accountTransactionsLoadCounter === 0) {
    //             let dataDict: Map<string, number> = new Map();
    //             let previousTransactionsAccumulatingSum = this.plaidAccountsTotalBalance;
    //             for (let i = 0; i < 30; i++) {
    //               let dateToCheck = moment().subtract(i, "days").format("YYYY-MM-DD");
    //               let previousTransactionsSum = 0;
    //               this.plaidTransactions.forEach((transaction) => {
    //                 if (transaction.date === dateToCheck) {
    //                   previousTransactionsSum += transaction.amount;
    //                 }
    //               });
    //               previousTransactionsAccumulatingSum -= previousTransactionsSum;
    //               if (i === 0) {
    //                 dataDict.set(dateToCheck, this.plaidAccountsTotalBalance)
    //               }
    //               else {
    //                 dataDict.set(dateToCheck, previousTransactionsAccumulatingSum);
    //               }
    //             }
    //           }
    //         }
    //       );
    //     }
    //   }
    // );
  }

  ngAfterViewInit() {
  }

}
