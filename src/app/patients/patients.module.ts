import { NgModule } from "@angular/core";

import { PatientAddComponent } from './patient-add/patient-add.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientFilterPipe } from './patient-list/patient-list-filter.pipe';
import { PatientViewComponent } from './patient-view/patient-view.component';
import { PatientEditComponent } from './patient-edit/patient-edit.component';
import { PatientDispenseComponent } from './patient-dispense/patient-dispense.component';
import { DispenseEditComponent } from './patient-dispense/dispense-edit/dispense-edit.component';
import { LostFollowupComponent } from './lost-followup/lost-followup.component';
import { ErrorsComponent } from './errors/errors.component';
import { PatientsService } from './patients.service';
import { DispenseService } from './patient-dispense/dispense.service'
import { SharedModule } from './shared/shared.module';
import { routing } from "./patients.routing";
import { UtilsModule } from '../shared/utils/utils.module'; // For field filter pipe.
import { PaginationModule } from 'ng2-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PatientAddComponent,
    PatientListComponent,
    PatientViewComponent,
    PatientEditComponent,
    PatientDispenseComponent,
    DispenseEditComponent,
    LostFollowupComponent,
    ErrorsComponent,
    PatientFilterPipe
  ],
  imports: [
    routing,
    ReactiveFormsModule,
    SharedModule,
    PaginationModule.forRoot(),
    UtilsModule
  ],
  providers: [PatientsService, DispenseService],
  entryComponents: []
})
export class PatientsModule { }