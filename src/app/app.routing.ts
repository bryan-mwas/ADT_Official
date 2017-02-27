/**
 * Created by griga on 7/11/16.
 */


import {Routes, RouterModule} from '@angular/router';
import {MainLayoutComponent} from "./shared/layout/app-layouts/main-layout.component";
import {AuthLayoutComponent} from "./shared/layout/app-layouts/auth-layout.component";
import {ModuleWithProviders} from "@angular/core";

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    data: {pageTitle: 'Home'},
    children: [
      {
        path: '', redirectTo: 'dashboard/analytics', pathMatch: 'full'
      },
      { path: 'home', loadChildren: 'app/+home/home.module#HomeModule', data: { pageTitle: 'CDF Kiriari Dispensary /  Dashboard' } },
      { path: 'patients', loadChildren: 'app/patients/patients.module#PatientsModule', data: { pageTitle: 'CDF Kiriari Dispensary /  Patients' } },
      { path: 'inventory', loadChildren: 'app/inventory/inventory.module#InventoryModule', data: { pageTitle: 'CDF Kiriari Dispensary /  Inventory' } },
      { path: 'profile', loadChildren: 'app/profile/profile.module#ProfileModule', data: { pageTitle: 'CDF Kiriari Dispensary /  Profile' } },
      { path: 'settings', loadChildren: 'app/settings/settings.module#SettingsModule', data: { pageTitle: 'CDF Kiriari Dispensary /  Settings' } },
      { path: 'orders', loadChildren: 'app/orders/orders.module#OrdersModule', data: { pageTitle: 'CDF Kiriari Dispensary /  Orders' } },
      // { path: 'faq', component: FaqComponent, data: { pageTitle: 'CDF Kiriari Dispensary /  Frequently Asked Questions' } }
    ]
  },

  {path: 'auth', component: AuthLayoutComponent, loadChildren: 'app/+auth/auth.module#AuthModule'},

  {path: '**', redirectTo: 'miscellaneous/error404'}

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
