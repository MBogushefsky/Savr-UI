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
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ShoppingComponent } from './pages/shopping/shopping.component';
import { InvestmentsComponent } from './pages/investments/investments.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { DealsComponent } from './pages/deals/deals.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { FundsComponent } from './pages/funds/funds.component';
import { PlaidAccountModalComponent } from './modals/plaid-account-modal/plaid-account-modal.component';
import { EventPlanningComponent } from './pages/event-planning/event-planning.component';
import { CalendarModule } from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BankAccountViewComponent } from './pages/bank-account-view/bank-account-view.component';
import { RouterModule } from '@angular/router';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { BankInstitutionsViewComponent } from './reusable-modules/cards/bank-institutions-view/bank-institutions-view.component';
import { BankAccountsViewComponent } from './reusable-modules/cards/bank-accounts-view/bank-accounts-view.component';
import { AvailableFundsChartViewComponent } from './reusable-modules/charts/available-funds-chart-view/available-funds-chart-view.component';
import { LineChartComponent } from './reusable-modules/generic-charts/line-chart/line-chart.component';
import { PieChartComponent } from './reusable-modules/generic-charts/pie-chart/pie-chart.component';
import { SpendingByCategoryViewComponent } from './reusable-modules/charts/spending-by-category-view/spending-by-category-view.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    HomeComponent,
    FundsComponent,
    AvailableFundsChartViewComponent,
    SpendingByCategoryViewComponent,
    LineChartComponent,
    PieChartComponent,
    BankAccountsViewComponent,
    BankInstitutionsViewComponent,
    BankAccountViewComponent,
    EventPlanningComponent,
    ShoppingComponent,
    InvestmentsComponent,
    ExpensesComponent,
    DealsComponent,
    SettingsComponent,
    PlaidAccountModalComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule, 
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule.forRoot(), 
    IonicStorageModule.forRoot(),
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxPlaidLinkModule,
    HttpClientModule,
    CalendarModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptor, multi: true },
    Globals
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
