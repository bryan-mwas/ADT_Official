import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './reports.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { DrugInventoryComponent } from './drug-inventory/drug-inventory.component';
import { EarlyWarningIndicatorsComponent } from './early-warning-indicators/early-warning-indicators.component';
import { GuidelinesComponent } from './guidelines/guidelines.component';
import { MohFormsComponent } from './moh-forms/moh-forms.component';
import { StandardComponent } from './standard/standard.component';
import { VisitingPatientsComponent } from './visiting-patients/visiting-patients.component';
import { SmartadminModule } from '../shared/smartadmin.module';
import { SmartadminInputModule } from '../shared/forms/input/smartadmin-input.module';
import { SmartadminDatatableModule } from '../shared/ui/datatable/smartadmin-datatable.module';

@NgModule({
    imports: [
        CommonModule,
        routing,
        SmartadminModule,
        SmartadminDatatableModule,
        SmartadminInputModule,
        ReactiveFormsModule,
    ],
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
