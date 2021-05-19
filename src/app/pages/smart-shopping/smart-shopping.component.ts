import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-smart-shopping',
  templateUrl: './smart-shopping.component.html',
  styleUrls: ['./smart-shopping.component.scss'],
})
export class SmartShoppingComponent implements OnInit {

  searchInput: string;
  amazonSearchResults: Product[] = [];
  ebaySearchResults: Product[] = [];
  walmartSearchResults: Product[] = [];

  loadingAmazonSearch: boolean = false;
  loadingEbaySearch: boolean = false;
  loadingWalmartSearch: boolean = false;

  showSearches: string[] = [];

  constructor(private restApiService: RestApiService) { }

  ngOnInit() {
    this.showSearches = ['amazon', 'ebay', 'walmart'];
  }

  setSearchInput(event: any) {
    this.searchInput = event.target.value;
  }

  searchForProducts() {
    if (this.loadingAmazonSearch || this.loadingEbaySearch) {
      return;
    }
    this.loadingAmazonSearch = true;
    this.restApiService.getAmazonProductsByKeyword(this.searchInput, 1).subscribe(
      (returnedAmazonProducts: Product[]) => {
        this.amazonSearchResults = returnedAmazonProducts;
        this.loadingAmazonSearch = false;
      }
    );

    this.loadingEbaySearch = true;
    this.restApiService.getEbayProductsByKeyword(this.searchInput, 1).subscribe(
      (returnedEbayProducts: any) => {
        this.ebaySearchResults = returnedEbayProducts;
        this.loadingEbaySearch = false;
      }
    );

    this.loadingWalmartSearch = true;
    this.restApiService.getWalmartProductsByKeyword(this.searchInput, 1).subscribe(
      (returnedWalmartProducts: Product[]) => {
        this.walmartSearchResults = returnedWalmartProducts;
        this.loadingWalmartSearch = false;
      }
    );
    
  }
}
