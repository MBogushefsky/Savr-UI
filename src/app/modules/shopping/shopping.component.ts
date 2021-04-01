import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { RainForestService } from 'src/app/services/rain-forest.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.scss'],
})
export class ShoppingComponent implements OnInit {

  searchInput: string;
  amazonSearchResults: any[] = [];
  ebaySearchResults: any[] = [];
  walmartSearchResults: any[] = [];

  loadingAmazonSearch: boolean = false;
  loadingEbaySearch: boolean = false;
  loadingWalmartSearch: boolean = false;

  constructor(private restApiService: RestApiService, private rainForestService: RainForestService) { }

  ngOnInit() {}

  setSearchInput(event: any) {
    this.searchInput = event.target.value;
  }

  searchForProducts() {
    if (this.loadingAmazonSearch || this.loadingEbaySearch) {
      return;
    }
    this.loadingAmazonSearch = true;
    this.rainForestService.searchProducts(this.searchInput).subscribe(
      (returnedAmazonProducts: any) => {
        this.amazonSearchResults = [];
        returnedAmazonProducts.search_results.forEach(
          (result) => {
            if (result.prices) {
              let resultProduct: Product = {
                title: result.title,
                imageSrc: result.image,
                price: result.prices[0].value,
                priceRaw: result.prices[0].raw,
                link: result.link,
                platform: 'Amazon'
              };
              this.amazonSearchResults.push(resultProduct);
            }
          }
        )
        this.loadingAmazonSearch = false;
      }
    );

    this.loadingEbaySearch = true;
    this.restApiService.getEbayProductsByKeyword(this.searchInput).subscribe(
      (returnedEbayProducts: any) => {
        this.ebaySearchResults = [];
        returnedEbayProducts.findItemsByKeywordsResponse[0].searchResult[0].item.forEach(
          (result) => {
            let resultProduct: Product = {
              title: result.title,
              imageSrc: result.galleryURL[0],
              price: result.sellingStatus[0].currentPrice[0].__value__,
              priceRaw: (result.sellingStatus[0].currentPrice[0]['@currencyId'] == 'USD' ? "$" : "?") + 
                result.sellingStatus[0].currentPrice[0].__value__,
              link: result.viewItemURL,
              platform: 'Ebay'
            };
            this.ebaySearchResults.push(resultProduct);
          }
        )
        this.loadingEbaySearch = false;
      }
    );

    this.loadingWalmartSearch = true;
    this.restApiService.getBlueCartProductsByKeyword(this.searchInput).subscribe(
      (returnedWalmartProducts: any) => {
        this.walmartSearchResults = [];
        returnedWalmartProducts.search_results.forEach(
          (result) => {
            let resultProduct: Product = {
              title: result.product.title,
              imageSrc: result.product.primary_image,
              price: result.offers.primary.price,
              priceRaw: '$' + result.offers.primary.price,
              link: result.product.link,
              platform: 'Walmart'
            };
            this.walmartSearchResults.push(resultProduct);
          }
        )
        this.loadingWalmartSearch = false;
      }
    );
    
  }
}
