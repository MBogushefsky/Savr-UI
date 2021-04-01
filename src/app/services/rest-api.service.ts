import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PlaidAccount, PlaidTransaction } from '../models/plaid';
import { User } from '../models/user';
import { UserPreference, UserPreferenceType } from '../models/user-preference';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  private apiHost: string = environment.apiServer;

  constructor(private http: HttpClient) { }

  login(username: string, passwordHash: string): Observable<User> {
    return this.http.get<User>(this.apiHost + "/api/login?username=" + username + "&passwordHash=" + passwordHash);
  }

  uploadProfileImage(imageFormData: FormData) {
    return this.http.post<any>(this.apiHost + "/api/profile/image", imageFormData);
  }

  getAllUserPreferenceTypes() {
    return this.http.get<UserPreferenceType[]>(this.apiHost + "/api/user-preferences/types");
  }

  getAllUserPreferences() {
    return this.http.get<UserPreference[]>(this.apiHost + "/api/user-preferences");
  }

  changeUserPreference(userPreferenceToChange: UserPreference) {
    return this.http.put<UserPreference>(this.apiHost + "/api/user-preferences/" + userPreferenceToChange.typeId, userPreferenceToChange);
  }

  changeAllUserPreferences(userPreferencesToChange: UserPreference[]) {
    return this.http.put<boolean>(this.apiHost + "/api/user-preferences", userPreferencesToChange);
  }

  changeProfileSettings(newProfileSettings: any) {
    return this.http.put<User>(this.apiHost + "/api/profile", newProfileSettings);
  }

  changePassword(changePasswordSettings: any) {
    return this.http.put<User>(this.apiHost + "/api/security/password", changePasswordSettings);
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

  hardRefreshTransactionsByAccountId(accountId: string) {
    return this.http.delete<void>(this.apiHost + "/api/transactions/" + accountId);
  }

  getAccounts() {
    return this.http.get<PlaidAccount[]>(this.apiHost + "/api/accounts");
  }

  getEbayProductsByKeyword(keyword: string) {
    return this.http.get<any>(this.apiHost + "/api/ebay/products?keyword=" + keyword);
  }

  getIntradayOfStockSymbol(symbol: string) {
    return this.http.get<any>(this.apiHost + "/api/investments/stocks/" + symbol);
  }

  getCandlestickFor24Hours(symbol: string) {
    return this.http.get<any>(this.apiHost + "/api/binance/candlestick/last-day/" + symbol);
  }
}
