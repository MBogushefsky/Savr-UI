import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.scss'],
})
export class InvestmentsComponent implements OnInit {
  @ViewChild('stockIntradayChart') stockIntradayChartRef: ElementRef;

  searchInput: string;
  searchType: string = 'stocks';
  chartSearchResults: any[] = [];

  chartLoaded: boolean = false;
  chartSymbol: string;
  chartTypeToLoad: string;

  loadingSearch: boolean = false;

  constructor(private restApiService: RestApiService, 
    private elementRef: ElementRef, 
    private storage: Storage) { 
  }

  ngOnInit() {
    this.storage.get('StockSelection').then((stock) => {
      if (stock == null) { return; }
      let stockSelection = JSON.parse(stock);
      this.searchInput = stockSelection.symbol;
      this.searchType = stockSelection.type;
      this.searchForStockSymbol();
    });
  }

  setSearchInput(event: any) {
    this.searchInput = event.target.value;
  }

  searchForStockSymbol() {
    this.chartSearchResults = [];
    this.loadingSearch = true;
    this.chartLoaded = false;
    if (this.searchType === 'stocks') {
      this.restApiService.getIntradayOfStockSymbol(this.searchInput).subscribe(
        (returnedIntradayOfStock: any) => {
          this.chartTypeToLoad = 'stocks';
          this.chartSearchResults = returnedIntradayOfStock.data;
          this.chartSymbol = this.chartSearchResults[0].symbol;
          this.storage.set('StockSelection', JSON.stringify(
            {
              symbol: this.chartSearchResults[0].symbol,
              type: 'stocks'
            }
          ));
          this.loadingSearch = false;
        }
      );
    }
    else if (this.searchType === 'cryptocurrency') {
      this.restApiService.getCandlestickFor24Hours(this.searchInput).subscribe(
        (returned24HoursOfCryptocurrency: any) => {
          this.chartTypeToLoad = 'cryptocurrency';
          this.chartSearchResults = returned24HoursOfCryptocurrency;
          this.chartSymbol = this.searchInput;
          this.storage.set('StockSelection', JSON.stringify(
            {
              symbol: this.chartSymbol,
              type: 'cryptocurrency'
            }
          ));
          this.loadingSearch = false;
        }
      );
    }
  }

  ngAfterViewChecked() {
    if (!this.chartLoaded && this.chartSearchResults.length !== 0) {
      this.loadIntradayStockChartFromData();
      this.chartLoaded = true;
    }
  }

  loadIntradayStockChartFromData() {
    if (this.chartSearchResults == null || this.chartSearchResults.length == 0) {
      return;
    }
    if (this.chartTypeToLoad === 'stocks') {
      this.chartSearchResults = this.chartSearchResults.filter(
        (result) => {
          return result.last != null;
        }
      ).reverse();
      var stockIntradayChart = new Chart('data-chart', {
        type: 'line',
        data: {
          labels: this.chartSearchResults.map(
            (result) => moment(result.date).calendar()
          ),
          datasets: [
            {
              label: 'Price Per Share',
              data: this.chartSearchResults.map((result) => result.last),
              borderWidth: 3,
              fill: false,
              backgroundColor: 'rgb(173,216,230)',
              borderColor: 'rgb(173,216,230)'
            }
          ]
        },
        options: {
          scales: {
              yAxes: [{
                  ticks: {
                      callback: function(value, index, values) {
                          return '$' + value;
                      }
                  }
              }]
          },
          plugins: {
            datalabels: {
              display: 'auto'
            }
          }
        }
      });
    }
    else if (this.chartTypeToLoad === 'cryptocurrency') {
      let labels = this.chartSearchResults.map(
        (result) => moment(result[0]).calendar()
      );
      let data = this.chartSearchResults.map((result) => Number(result[4]));
      console.log("crypto", labels, data);

      var cryptocurrencyChart = new Chart('data-chart', {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Price Per Coin',
              data: data,
              borderWidth: 3,
              fill: false,
              backgroundColor: 'rgb(173,216,230)',
              borderColor: 'rgb(173,216,230)'
            }
          ]
        },
        options: {
          scales: {
              yAxes: [{
                  ticks: {
                      callback: function(value, index, values) {
                          return '$' + value;
                      }
                  }
              }]
          },
          plugins: {
            datalabels: {
              display: 'auto'
            }
          }
        }
      });
    }
  }
}
