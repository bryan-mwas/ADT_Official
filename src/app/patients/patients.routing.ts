import { RouterModule, Routes } from "@angular/router";
import { PatientAddComponent } from './patient-add/patient-add.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientViewComponent } from './patient-view/patient-view.component';
import { PatientEditComponent } from './patient-edit/patient-edit.component';
import { PatientDispenseComponent } from './patient-dispense/patient-dispense.component';
import { DispenseEditComponent } from './patient-dispense/dispense-edit/dispense-edit.component';
import { LostFollowupComponent } from './lost-followup/lost-followup.component';
import { ErrorsComponent } from './errors/errors.component';

export const routes: Routes = [
    {
        path: 'add',
        component: PatientAddComponent,
        data: { pageTitle: 'Add Patient' }
    },
    {
        path: 'list',
        component: PatientListComponent,
        data: { pageTitle: 'Patient List' }
    },
    {
        path: 'detail/:id',
        component: PatientViewComponent,
        data: { pageTitle: 'Patient View' }
    },
    {
        path: 'edit/:id',
        component: PatientEditComponent,
        data: { pageTitle: 'Edit Patient' }
    },
    {
        path: 'dispense/:id',
        component: PatientDispenseComponent,
        data: { pageTitle: 'Dispense'}
    },
    {
        path: 'lost-followup',
        component: LostFollowupComponent,
        data: { pageTitle: 'Lost to Followup' }
    },
    {
        path: 'errors',
        component: ErrorsComponent,
        data: { pageTitle: 'Errors' }
    },
    {
        path: 'dispense-edit/:id',
        component: DispenseEditComponent,
        data: { pageTitle: 'Dispense Edit'}
    }
];

export const routing = RouterModule.forChild(routes);