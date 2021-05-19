import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { EventPlanningComponent } from './pages/event-planning/event-planning.component';
import { BankAccountViewComponent } from './pages/bank-account-view/bank-account-view.component';
import { BreakdownComponent } from './pages/breakdown/breakdown.component';
import { HomeComponent } from './pages/home/home.component';
import { TradeTrainerComponent } from './pages/trade-trainer/trade-trainer.component';
import { LoginComponent } from './pages/login/login.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SmartShoppingComponent } from './pages/smart-shopping/smart-shopping.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { TokenGuard } from './route-guards/token.guard';
import { PlanComponent } from './pages/plan/plan.component';

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
    path: 'breakdown',
    component: BreakdownComponent,
    canActivate: [TokenGuard]
  },
  {
    path: 'plan',
    component: PlanComponent,
    canActivate: [TokenGuard]
  },
  {
    path: 'bank-account-view/:id',
    component: BankAccountViewComponent,
    canActivate: [TokenGuard]
  },
  {
    path: 'trade-trainer',
    component: TradeTrainerComponent,
    canActivate: [TokenGuard]
  },
  {
    path: 'event-planning',
    component: EventPlanningComponent,
    canActivate: [TokenGuard]
  },
  {
    path: 'smart-shopping',
    component: SmartShoppingComponent,
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
