import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RainForestService {

  private apiHost: string = environment.rainForestServer;
  private apiKey: string = environment.rainForestApiKey;

  constructor(private http: HttpClient) { }

  searchProducts(search: string) {
    return this.http.get(this.apiHost + "/request?api_key=" + this.apiKey + "&type=search&amazon_domain=amazon.com&search_term=" + encodeURIComponent(search));
  }
  
}
