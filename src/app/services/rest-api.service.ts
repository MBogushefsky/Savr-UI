import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PlaidAccount, PlaidTransaction } from '../models/plaid';
import { Product } from '../models/product';
import { User } from '../models/user';
import { UserPreference, UserPreferenceType } from '../models/user-preference';
import { FoundationService } from './foundation.service';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  private apiHost: string = environment.apiServer;

  constructor(private http: HttpClient, private foundationService: FoundationService) { }

  login(username: string, passwordHash: string): Observable<User> {
    return this.http.get<User>(this.apiHost + "/login?username=" + username + "&passwordHash=" + passwordHash);
  }

  signUp(user: User): Observable<boolean> {
    return this.http.put<boolean>(this.apiHost + "/sign-up", user);
  }

  uploadProfileImage(imageFormData: FormData) {
    return this.http.post<any>(this.apiHost + "/profile/image", imageFormData);
  }

  getAllUserPreferenceTypes() {
    return this.http.get<UserPreferenceType[]>(this.apiHost + "/user-preferences/types");
  }

  getAllUserPreferences() {
    return this.http.get<UserPreference[]>(this.apiHost + "/user-preferences");
  }

  changeUserPreference(userPreferenceToChange: UserPreference) {
    return this.http.put<UserPreference>(this.apiHost + "/user-preferences/" + userPreferenceToChange.typeId, userPreferenceToChange);
  }

  changeAllUserPreferences(userPreferencesToChange: UserPreference[]) {
    return this.http.put<boolean>(this.apiHost + "/user-preferences", userPreferencesToChange);
  }

  changeProfileSettings(newProfileSettings: any) {
    return this.http.put<User>(this.apiHost + "/profile", newProfileSettings);
  }

  changePassword(changePasswordSettings: any) {
    return this.http.put<User>(this.apiHost + "/security/password", changePasswordSettings);
  }

  savePlaidToken(publicToken: string) {
    return this.http.post<void>(this.apiHost + "/tokens?token=" + publicToken, {});
  }

  getTransactionsByAccountIdsInTimeRangeUngrouped(accountIds: string[], startDate: Date, endDate: Date) {
    if (startDate != null && endDate != null) {
      let startDateParam = this.foundationService.formatDate(startDate);
      let endDateParam = this.foundationService.formatDate(endDate);
      return this.http.get<PlaidTransaction[]>(this.apiHost + "/transactions/ungrouped?accountIds=" + accountIds + "&start-date=" + startDateParam + "&end-date=" + endDateParam);
    }
    else {
      return this.http.get<PlaidTransaction[]>(this.apiHost + "/transactions/ungrouped?accountIds=" + accountIds);
    }
  }

  getTransactionsByAccountIdsInTimeRangeGrouped(accountIds: string[], startDate: Date, endDate: Date) {
    if (startDate != null && endDate != null) {
      let startDateParam = this.foundationService.formatDate(startDate);
      let endDateParam = this.foundationService.formatDate(endDate);
      return this.http.get<PlaidTransaction[][]>(this.apiHost + "/transactions/grouped?accountIds=" + accountIds + "&start-date=" + startDateParam + "&end-date=" + endDateParam);
    }
    else {
      return this.http.get<PlaidTransaction[][]>(this.apiHost + "/transactions/grouped?accountIds=" + accountIds);
    }
  }

  getAllTransactions() {
    return this.http.get<PlaidTransaction[]>(this.apiHost + "/transactions");
  }

  hardRefreshTransactionsByAccountId(accountId: string) {
    return this.http.delete<void>(this.apiHost + "/transactions/" + accountId);
  }

  getAccounts() {
    return this.http.get<PlaidAccount[]>(this.apiHost + "/accounts");
  }

  getAccountById(id: string) {
    return this.http.get<PlaidAccount>(this.apiHost + "/accounts/" + id);
  }

  getAmazonProductsByKeyword(keyword: string, page: number) {
    return this.http.get<Product[]>(this.apiHost + "/amazon/products?keyword=" + keyword + "&page=" + page);
  }

  getEbayProductsByKeyword(keyword: string, page: number) {
    return this.http.get<Product[]>(this.apiHost + "/ebay/products?keyword=" + keyword + "&page=" + page);
  }

  getWalmartProductsByKeyword(keyword: string, page: number) {
    return this.http.get<Product[]>(this.apiHost + "/walmart/products?keyword=" + keyword + "&page=" + page);
  }

  searchForSymbol(query: string) {
    return this.http.get<any>(this.apiHost + "/exchanges/search?query=" + query);
  }

  getSymbolMetadata(symbol: string, isStock: boolean) {
    return this.http.get<any>(this.apiHost + "/exchanges/" + symbol + "/metadata?is-stock=" + isStock);
  }

  getSymbolPriceHistory(symbol: string, isStock: boolean, interval: string, startDate: Date, endDate: Date) {
    if (startDate != null && endDate != null) {
      let startDateParam = this.foundationService.formatDate(startDate);
      let endDateParam = this.foundationService.formatDate(endDate);
      return this.http.get<any>(this.apiHost + "/exchanges/" + symbol + "/price-history?is-stock=" + isStock + "&interval=" + interval + "&start-date=" + startDateParam + "&end-date=" + endDateParam);
    }
    else {
      return this.http.get<any>(this.apiHost + "/exchanges/" + symbol + "/price-history?is-stock=" + isStock + "&interval=" + interval);
    }
  }

  getIntradayOfStockSymbol(symbol: string) {
    return this.http.get<any>(this.apiHost + "/investments/stocks/" + symbol);
  }

  getCandlestickFor24Hours(symbol: string) {
    return this.http.get<any>(this.apiHost + "/binance/candlestick/last-day/" + symbol);
  }
}
