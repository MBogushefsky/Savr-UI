import { AfterViewInit, Component, OnInit } from '@angular/core';
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
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  private plaidLinkHandler: PlaidLinkHandler;
  private plaidConfig: PlaidConfig = {
    apiVersion: "v2",
    env: "development",
    selectAccount: false,
    token: null,
    product: ["auth"],
    countryCodes: ['US', 'CA', 'GB'],
    key: "ce84441114a95a4795f66b9bddb36f",
    onSuccess: this.onPlaidSuccess,
    onExit: this.onPlaidExit
  };

  private plaidAccounts: PlaidAccount[] = [];
  private plaidTransactionsDict: { [id: string]: PlaidTransaction[] } = {};

  constructor(private globals: Globals, 
    private plaidLinkService: NgxPlaidLinkService,
    private restApiService: RestApiService) { 

  }

  ngOnInit() {
    this.restApiService.getAccounts().subscribe(
      (returnedAccounts: PlaidAccount[]) => {
        this.plaidAccounts = returnedAccounts;
      }
    );
  }

  ngAfterViewInit() {
  }

  loadTransactionsForAccount(accountId: string) {
    this.restApiService.getTransactionsByAccountId(accountId).subscribe(
      (returnedTransactions: PlaidTransaction[]) => {
        this.plaidTransactionsDict[accountId] = returnedTransactions;
      }
    )
  }

  onPlaidSuccess(token: any, metadata: any) {
    this.restApiService.savePlaidToken(token).subscribe(
      (returned: void) => {
        console.log("SUCCESS SAVED");
      }
    );
    console.log("SUCCESS", token);
  }

  onPlaidExit(error: any, metadata: any) {
    console.log("EXIT", error);
  }

  onPlaidLoad(event: any) {
    console.log("LOAD", event);
  }

  onPlaidEvent(event: any, metadata: any) {
    console.log("EVENT", event);
  }

  onPlaidClick() {
    this.plaidLinkService
      .createPlaid(
        Object.assign({}, this.plaidConfig, {
          onSuccess: (token, metadata) => this.onPlaidSuccess(token, metadata),
          onExit: (error, metadata) => this.onPlaidExit(error, metadata),
          onEvent: (eventName, metadata) => this.onPlaidEvent(eventName, metadata)
        })
      )
      .then((handler: PlaidLinkHandler) => {
        this.plaidLinkHandler = handler;
        this.plaidLinkHandler.open();
      });
  }

}
