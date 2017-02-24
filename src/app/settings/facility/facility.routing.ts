import { RouterModule, Routes } from "@angular/router";
import { FacilityDetailsComponent } from "./facility-details/facility-details.component"
import { FacilityPatientSourcesComponent } from "./facility-patient-sources/facility-patient-sources.component"
import { FacilitySupportersComponent } from "./facility-supporters/facility-supporters.component"
import { FacilityUsersComponent } from "./facility-users/facility-users.component"


export const routes: Routes = [
    {
        path: 'facility-details/:id',
        component: FacilityDetailsComponent,
        data: { pageTitle: 'Facility Details' }
    },
    {
        path: 'facility-patient-sources',
        component: FacilityPatientSourcesComponent,
        data: { pageTitle: 'Facility Patient Sources' }
    },
    {
        path: 'facility-supporters',
        component: FacilitySupportersComponent,
        data: { pageTitle: 'Facility Supporters' }
    },
    {
        path: 'facility-users',
        component: FacilityUsersComponent,
        data: { pageTitle: 'Facility Users' }
    }
];

export const routing = RouterModule.forChild(routes);
