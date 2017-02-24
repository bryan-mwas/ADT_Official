import { RouterModule, Routes } from "@angular/router";
import { ManualAutoScriptsComponent } from "./manual-auto-scripts/manual-auto-scripts.component";
import { NonAdheranceReasonsComponent } from "./non-adherance-reasons/non-adherance-reasons.component";
import { PatientMergingComponent } from "./patient-merging/patient-merging.component";
import { PatientStatusComponent } from "./patient-status/patient-status.component";
import { PepReasonsComponent } from "./pep-reasons/pep-reasons.component";
import { ServicePointsComponent } from "./service-points/service-points.component";
import { TransactionTypesComponent } from "./transaction-types/transaction-types.component";
import { VisitPurposeComponent } from "./visit-purpose/visit-purpose.component";

export const routes: Routes = [
    {
        path: 'manual-auto-scripts',
        component: ManualAutoScriptsComponent,
        data: { pageTitle: 'Manual Auto Scripts' }
    },
    {
        path: 'non-adherance-reasons',
        component: NonAdheranceReasonsComponent,
        data: { pageTitle: 'Non-Adherance Reason' }
    },
    {
        path: 'patient-merging',
        component: PatientMergingComponent,
        data: { pageTitle: 'Patient Merging' }
    },
    {
        path: 'patient-status',
        component: PatientStatusComponent,
        data: { pageTitle: 'Patient Status' }
    },
    {
        path: 'pep-reasons',
        component: PepReasonsComponent,
        data: { pageTitle: 'PEP Reason Management' }
    },
    {
        path: 'service-points',
        component: ServicePointsComponent,
        data: { pageTitle: 'Service Points' }
    },
    {
        path: 'transaction-types',
        component: TransactionTypesComponent,
        data: { pageTitle: 'Transaction Types' }
    },
    {
        path: 'visit-purpose',
        component: VisitPurposeComponent,
        data: { pageTitle: 'Visit Purpose' }
    }

];

export const routing = RouterModule.forChild(routes);
