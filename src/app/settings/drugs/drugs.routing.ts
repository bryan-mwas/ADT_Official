import { RouterModule, Routes } from "@angular/router";
import { BrandNamesComponent } from "./brand-names/brand-names.component";
import { DrugClassificationComponent } from "./drug-classification/drug-classification.component";
import { DrugCodesComponent } from "./drug-codes/drug-codes.component";
import { DrugConsumptionComponent } from "./drug-consumption/drug-consumption.component";
import { DrugDestinationsComponent } from "./drug-destinations/drug-destinations.component";
import { DrugDosesComponent } from "./drug-doses/drug-doses.component";
import { DrugIndicationsComponent } from "./drug-indications/drug-indications.component";
import { DrugInstructionsComponent } from "./drug-instructions/drug-instructions.component";
import { DrugRunningBalanceComponent } from "./drug-running-balance/drug-running-balance.component";
import { DrugSourcesComponent } from "./drug-sources/drug-sources.component";
import { GenericNamesComponent } from "./generic-names/generic-names.component";


export const routes: Routes = [
    {
        path: 'brand-names',
        component: BrandNamesComponent,
        data: { pageTitle: 'Brand Name Management' }
    },
    {
        path: 'drug-classification',
        component: DrugClassificationComponent,
        data: { pageTitle: 'Drug Classification Management' }
    },
    {
        path: 'drug-codes',
        component: DrugCodesComponent,
        data: { pageTitle: 'Drug Code Management' }
    },
    {
        path: 'drug-consumption',
        component: DrugConsumptionComponent,
        data: { pageTitle: 'Drug Consumption Management' }
    },
    {
        path: 'drug-destinations',
        component: DrugDestinationsComponent,
        data: { pageTitle: 'Drug Destination Management' }
    },
    {
        path: 'drug-doses',
        component: DrugDosesComponent,
        data: { pageTitle: 'Drug Dose Management' }
    },
    {
        path: 'drug-indications',
        component: DrugIndicationsComponent,
        data: { pageTitle: 'Drug Indication Management' }
    },
    {
        path: 'drug-instructions',
        component: DrugInstructionsComponent,
        data: { pageTitle: 'Drug Instruction Management' }
    },
    {
        path: 'drug-running-balance',
        component: DrugRunningBalanceComponent,
        data: { pageTitle: 'Drug Running Balance Management' }
    },
    {
        path: 'drug-sources',
        component: DrugSourcesComponent,
        data: { pageTitle: 'Drug Sources Management' }
    },
    {
        path: 'generic-names',
        component: GenericNamesComponent,
        data: { pageTitle: 'Generic Name Management' }
    },
];

export const routing = RouterModule.forChild(routes);
