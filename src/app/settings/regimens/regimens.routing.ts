import { RouterModule, Routes } from "@angular/router";
import { RegimenChangeReasonComponent } from "./regimen-change-reason/regimen-change-reason.component";
import { RegimenDrugsComponent } from "./regimen-drugs/regimen-drugs.component";
import { RegimenManagementComponent } from "./regimen-management/regimen-management.component";
import { RegimenServiceTypeComponent } from "./regimen-service-type/regimen-service-type.component";
import { RegimenOrderComponent } from "./regimen-order/regimen-order.component";
import { RegimenCategoryComponent } from "./regimen-category/regimen-category.component";
import { RegimenCategoryOrderComponent } from "./regimen-category-order/regimen-category-order.component";


export const routes: Routes = [
    {
        path: 'regimen-change-reason',
        component: RegimenChangeReasonComponent,
        data: { pageTitle: 'Regimen Change Reason Management' }
    },
    {
        path: 'regimen-drugs',
        component: RegimenDrugsComponent,
        data: { pageTitle: 'Regimen Drugs Management' }
    },
    {
        path: 'regimen-management',
        component: RegimenManagementComponent,
        data: { pageTitle: 'Regimen Management' }
    },
    {
        path: 'regimen-service-type',
        component: RegimenServiceTypeComponent,
        data: { pageTitle: 'Regimen Service Type Management' }
    },
    {
        path: 'regimen-order',
        component: RegimenOrderComponent,
        data: { pageTitle: 'Regimen Order Management' }
    },
    {
        path: 'regimen-category',
        component: RegimenCategoryComponent,
        data: { pageTitle: 'Regimen Category Management' }
    },
    {
        path: 'regimen-category-order',
        component: RegimenCategoryOrderComponent,
        data: { pageTitle: 'Regimen Category Order Management' }
    }
];

export const routing = RouterModule.forChild(routes);
