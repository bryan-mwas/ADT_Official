import { Routes, RouterModule } from '@angular/router';

import { DrugInventoryComponent } from './drug-inventory/drug-inventory.component';
import { EarlyWarningIndicatorsComponent } from './early-warning-indicators/early-warning-indicators.component';
import { StandardComponent } from './standard/standard.component';
import { VisitingPatientsComponent } from './visiting-patients/visiting-patients.component';
import { GuidelinesComponent } from './guidelines/guidelines.component';
import { MohFormsComponent } from './moh-forms/moh-forms.component';

export const routes: Routes = [
  { path: 'path', component: DrugInventoryComponent },
  {
    path: 'drug-inventory',
    component: DrugInventoryComponent,
    data: { pageTitle: 'Drug Inventory' }
  },
  {
    path: 'early-warning',
    component: EarlyWarningIndicatorsComponent,
    data: { pageTitle: 'Early Warning Indicators' }
  }
];

export const routing = RouterModule.forChild(routes);
