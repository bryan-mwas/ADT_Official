import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { routing } from "./drugs.routing";
import { SmartadminModule } from "../../shared/smartadmin.module";
import { SmartadminDatatableModule } from "../../shared/ui/datatable/smartadmin-datatable.module";
import { SmartadminInputModule } from "../../shared/forms/input/smartadmin-input.module";
import { FormsModule } from '@angular/forms';
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

@NgModule({
    declarations: [
        BrandNamesComponent,
        DrugClassificationComponent,
        DrugCodesComponent,
        DrugConsumptionComponent,
        DrugDestinationsComponent,
        DrugDosesComponent,
        DrugIndicationsComponent,
        DrugInstructionsComponent,
        DrugRunningBalanceComponent,
        DrugSourcesComponent,
        GenericNamesComponent
    ],
    imports: [
        CommonModule,
        routing,
        SmartadminModule,
        SmartadminDatatableModule,
        SmartadminInputModule,
        FormsModule
    ]
})

export class DrugsModule { }