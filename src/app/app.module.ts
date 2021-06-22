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
import { SmartShoppingComponent } from './pages/smart-shopping/smart-shopping.component';
import { TradeTrainerComponent } from './pages/trade-trainer/trade-trainer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './pages/settings/settings.component';
import { BreakdownComponent } from './pages/breakdown/breakdown.component';
import { PlaidAccountModalComponent } from './modals/plaid-account-modal/plaid-account-modal.component';
import { EventPlanningComponent } from './pages/event-planning/event-planning.component';
import { CalendarModule } from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BankAccountViewComponent } from './pages/bank-account-view/bank-account-view.component';
import { RouterModule } from '@angular/router';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { BankInstitutionsViewComponent } from './reusable-modules/bank-cards/bank-institutions-view/bank-institutions-view.component';
import { BankAccountsViewComponent } from './reusable-modules/bank-cards/bank-accounts-view/bank-accounts-view.component';
import { AvailableFundsChartViewComponent } from './reusable-modules/charts/available-funds-chart-view/available-funds-chart-view.component';
import { LineChartComponent } from './reusable-modules/generic-components/line-chart/line-chart.component';
import { PieChartComponent } from './reusable-modules/generic-components/pie-chart/pie-chart.component';
import { SpendingByCategoryViewComponent } from './reusable-modules/charts/spending-by-category-view/spending-by-category-view.component';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { SymbolPriceDataViewComponent } from './reusable-modules/charts/symbol-price-data-view/symbol-price-data-view.component';
import { ProfileSettingsComponent } from './pages/settings/profile-settings/profile-settings.component';
import { MoneyManagementSettingsComponent } from './pages/settings/money-management-settings/money-management-settings.component';
import { NotificationSettingsComponent } from './pages/settings/notification-settings/notification-settings.component';
import { SecuritySettingsComponent } from './pages/settings/security-settings/security-settings.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { UserPreferenceControlComponent } from './reusable-modules/components/user-preference-control/user-preference-control.component';
import { ShoppingSearchedProductsViewComponent } from './reusable-modules/components/shopping-searched-products-view/shopping-searched-products-view.component';
import { RatingModule } from 'primeng/rating';
import { GoalsComponent } from './pages/goals/goals.component';
import { KnobModule } from 'primeng/knob';
import { GaugesModule } from '@progress/kendo-angular-gauges';
import { FinancialGoalWizardModalComponent } from './reusable-modules/components/financial-goal-wizard-modal/financial-goal-wizard-modal.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { StepsModule } from 'primeng/steps';
import { MenuModule } from 'primeng/menu';
import { AccordionComponent } from './reusable-modules/generic-components/accordion/accordion.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FieldGroupComponent } from './reusable-modules/generic-components/field-group/field-group.component';
import { InputMaskModule } from 'primeng/inputmask';
import { TextFieldControlComponent } from './reusable-modules/generic-components/field-group/text-field-control/text-field-control.component';
import { PasswordFieldControlComponent } from './reusable-modules/generic-components/field-group/password-field-control/password-field-control.component';
import { PhoneFieldControlComponent } from './reusable-modules/generic-components/field-group/phone-field-control/phone-field-control.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    HomeComponent,
    BreakdownComponent,
    GoalsComponent,
    AvailableFundsChartViewComponent,
    SpendingByCategoryViewComponent,
    SymbolPriceDataViewComponent,
    LineChartComponent,
    PieChartComponent,
    BankAccountsViewComponent,
    BankInstitutionsViewComponent,
    BankAccountViewComponent,
    EventPlanningComponent,
    SmartShoppingComponent,
    ShoppingSearchedProductsViewComponent,
    TradeTrainerComponent,
    SettingsComponent,
    ProfileSettingsComponent,
    MoneyManagementSettingsComponent,
    UserPreferenceControlComponent,
    NotificationSettingsComponent,
    SecuritySettingsComponent,
    PlaidAccountModalComponent,
    FinancialGoalWizardModalComponent,
    AccordionComponent,
    FieldGroupComponent,
    TextFieldControlComponent,
    PasswordFieldControlComponent,
    PhoneFieldControlComponent
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
    CalendarModule,
    AutoCompleteModule,
    InputNumberModule,
    DropdownModule,
    CheckboxModule,
    RatingModule,
    KnobModule,
    GaugesModule,
    ToastModule,
    InputTextModule,
    StepsModule,
    MenuModule,
    FontAwesomeModule,
    InputMaskModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptor, multi: true },
    Globals,
    MessageService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
