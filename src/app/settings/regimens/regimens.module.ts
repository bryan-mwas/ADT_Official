import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { routing } from "./regimens.routing";
import { SmartadminModule } from "../../shared/smartadmin.module";
import { SmartadminDatatableModule } from "../../shared/ui/datatable/smartadmin-datatable.module";
import { SmartadminInputModule } from "../../shared/forms/input/smartadmin-input.module";
import { FormsModule } from '@angular/forms';
import { RegimenChangeReasonComponent } from "./regimen-change-reason/regimen-change-reason.component";
import { RegimenDrugsComponent } from "./regimen-drugs/regimen-drugs.component";
import { RegimenManagementComponent } from "./regimen-management/regimen-management.component";
import { RegimenServiceTypeComponent } from "./regimen-service-type/regimen-service-type.component";
import { RegimenOrderComponent } from "./regimen-order/regimen-order.component";
import { RegimenCategoryComponent } from "./regimen-category/regimen-category.component";
import { RegimenCategoryOrderComponent } from "./regimen-category-order/regimen-category-order.component";


@NgModule({
    declarations: [
        RegimenServiceTypeComponent,
        RegimenDrugsComponent,
        RegimenManagementComponent,
        RegimenChangeReasonComponent,
        RegimenOrderComponent,
        RegimenCategoryComponent,
        RegimenCategoryOrderComponent
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

export class RegimensModule { }