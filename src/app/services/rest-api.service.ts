import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlaidAccount, PlaidTransaction } from '../models/plaid';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  private apiHost: string = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  login(username: string, passwordHash: string): Observable<User> {
    return this.http.get<User>(this.apiHost + "/api/login?username=" + username + "&passwordHash=" + passwordHash);
  }

  savePlaidToken(publicToken: string) {
    return this.http.post<void>(this.apiHost + "/api/tokens?token=" + publicToken, {});
  }

  getTransactionsByAccountId(accountId: string) {
    return this.http.get<PlaidTransaction[]>(this.apiHost + "/api/transactions/" + accountId);
  }

  getAllTransactions() {
    return this.http.get<PlaidTransaction[]>(this.apiHost + "/api/transactions");
  }

  getAccounts() {
    return this.http.get<PlaidAccount[]>(this.apiHost + "/api/accounts");
  }
}
