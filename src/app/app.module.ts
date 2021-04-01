import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NgxPlaidLinkModule } from "ngx-plaid-link";
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Globals } from './globals';
import { AuthorizationInterceptor } from './interceptors/authorization.interceptor';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { ShoppingComponent } from './modules/shopping/shopping.component';
import { InvestmentsComponent } from './modules/investments/investments.component';
import { FormsModule } from '@angular/forms';
import { BudgetComponent } from './modules/budget/budget.component';
import { DealsComponent } from './modules/deals/deals.component';
import { SettingsComponent } from './modules/settings/settings.component';
import { FundsComponent } from './modules/funds/funds.component';
import { PlaidAccountModalComponent } from './modals/plaid-account-modal/plaid-account-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    FundsComponent,
    ShoppingComponent,
    InvestmentsComponent,
    BudgetComponent,
    DealsComponent,
    SettingsComponent,
    PlaidAccountModalComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule, 
    CommonModule,
    FormsModule,
    IonicModule.forRoot(), 
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    NgxPlaidLinkModule,
    HttpClientModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptor, multi: true },
    Globals
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
