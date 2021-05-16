import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { DealsComponent } from './pages/deals/deals.component';
import { EventPlanningComponent } from './pages/event-planning/event-planning.component';
import { BankAccountViewComponent } from './pages/bank-account-view/bank-account-view.component';
import { FundsComponent } from './pages/funds/funds.component';
import { HomeComponent } from './pages/home/home.component';
import { InvestmentsComponent } from './pages/investments/investments.component';
import { LoginComponent } from './pages/login/login.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ShoppingComponent } from './pages/shopping/shopping.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { TokenGuard } from './route-guards/token.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'sign-up',
    component: SignUpComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [TokenGuard]
  },
  {
    path: 'funds',
    component: FundsComponent,
    canActivate: [TokenGuard]
  },
  {
    path: 'bank-account-view/:id',
    component: BankAccountViewComponent,
    canActivate: [TokenGuard]
  },
  {
    path: 'expenses',
    component: ExpensesComponent,
    canActivate: [TokenGuard]
  },
  {
    path: 'investments',
    component: InvestmentsComponent,
    canActivate: [TokenGuard]
  },
  {
    path: 'event-planning',
    component: EventPlanningComponent,
    canActivate: [TokenGuard]
  },
  {
    path: 'shopping',
    component: ShoppingComponent,
    canActivate: [TokenGuard]
  },
  {
    path: 'deals',
    component: DealsComponent,
    canActivate: [TokenGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [TokenGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
