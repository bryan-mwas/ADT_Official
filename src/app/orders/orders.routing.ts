import { RouterModule, Routes } from "@angular/router";
import { OrdersComponent } from './orders.component';
import { UpdateCdrrComponent } from './update-cdrr/update-cdrr.component';
import { UpdateMapComponent } from './update-map/update-map.component';
import { ViewCdrrComponent } from './view-cdrr/view-cdrr.component';
import { ViewMapComponent } from './view-map/view-map.component';

export const routes: Routes = [
    {
        path: '',
        component: OrdersComponent
    },
    {
        path: 'view-cdrr',
        component: ViewCdrrComponent,
        data: { pageTitle: 'Satellite Facility F-CDRR'}
    },
    {
        path: 'update-cdrr',
        component: UpdateCdrrComponent,
        data: { pageTitle: 'Satellite Facility F-CDRR'}
    },
    {
        path: 'view-map',
        component: ViewMapComponent,
        data: { pageTitle: 'Satellite Facility MAP'}
    },
    {
        path: 'update-map',
        component: UpdateMapComponent,
        data: { pageTitle: 'Satellite Facility MAP'}
    }
];

export const routing = RouterModule.forChild(routes);