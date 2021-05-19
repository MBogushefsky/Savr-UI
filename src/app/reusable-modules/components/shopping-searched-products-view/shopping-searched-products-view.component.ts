import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-shopping-searched-products-view',
  templateUrl: './shopping-searched-products-view.component.html',
  styleUrls: ['./shopping-searched-products-view.component.scss'],
})
export class ShoppingSearchedProductsViewComponent implements OnInit {
  @Input('store') store: string;
  @Input('products') products: Product[];
  @Input('isLoading') isLoading: boolean;

  constructor() { }

  ngOnInit() {}

}
