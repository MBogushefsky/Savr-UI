import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { BudgetComponent } from './modules/budget/budget.component';
import { DealsComponent } from './modules/deals/deals.component';
import { FundsComponent } from './modules/funds/funds.component';
import { HomeComponent } from './modules/home/home.component';
import { InvestmentsComponent } from './modules/investments/investments.component';
import { LoginComponent } from './modules/login/login.component';
import { SettingsComponent } from './modules/settings/settings.component';
import { ShoppingComponent } from './modules/shopping/shopping.component';
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
    path: 'budget',
    component: BudgetComponent,
    canActivate: [TokenGuard]
  },
  {
    path: 'investments',
    component: InvestmentsComponent,
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
    RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
