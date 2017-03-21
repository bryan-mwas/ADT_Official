import { NgModule } from '@angular/core';
import { routing } from './reports.routing';

import { DrugInventoryComponent } from './drug-inventory/drug-inventory.component';
import { EarlyWarningIndicatorsComponent } from './early-warning-indicators/early-warning-indicators.component';
import { GuidelinesComponent } from './guidelines/guidelines.component';
import { MohFormsComponent } from './moh-forms/moh-forms.component';
import { StandardComponent } from './standard/standard.component';
import { VisitingPatientsComponent } from './visiting-patients/visiting-patients.component';

@NgModule({
    imports: [ routing ],
    exports: [],
    declarations: [
        DrugInventoryComponent,
        EarlyWarningIndicatorsComponent,
        GuidelinesComponent,
        MohFormsComponent,
        StandardComponent,
        VisitingPatientsComponent
    ],
    providers: [],
})
export class ReportsModule { }
