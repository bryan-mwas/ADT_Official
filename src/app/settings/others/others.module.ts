import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { routing } from "./others.routing";
import { SmartadminModule } from "../../shared/smartadmin.module";
import { SmartadminDatatableModule } from "../../shared/ui/datatable/smartadmin-datatable.module";
import { SmartadminInputModule } from "../../shared/forms/input/smartadmin-input.module";
import { FormsModule } from '@angular/forms';
import { ManualAutoScriptsComponent } from "./manual-auto-scripts/manual-auto-scripts.component";
import { NonAdheranceReasonsComponent } from "./non-adherance-reasons/non-adherance-reasons.component";
import { PatientMergingComponent } from "./patient-merging/patient-merging.component";
import { PatientStatusComponent } from "./patient-status/patient-status.component";
import { PepReasonsComponent } from "./pep-reasons/pep-reasons.component";
import { ServicePointsComponent } from "./service-points/service-points.component";
import { TransactionTypesComponent } from "./transaction-types/transaction-types.component";
import { VisitPurposeComponent } from "./visit-purpose/visit-purpose.component";

@NgModule({

    declarations:[
        ManualAutoScriptsComponent,
        NonAdheranceReasonsComponent,
        PatientMergingComponent,
        PatientStatusComponent,
        PepReasonsComponent,
        ServicePointsComponent,
        TransactionTypesComponent,
        VisitPurposeComponent        
    ],

    imports: [
        CommonModule,
        routing,
        SmartadminModule,
        SmartadminInputModule,
        SmartadminDatatableModule,
        FormsModule
    ]
})

export class OthersModule { }