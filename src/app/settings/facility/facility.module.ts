import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { routing } from "./facility.routing";
import { SmartadminModule } from "../../shared/smartadmin.module";
import { SmartadminDatatableModule } from "../../shared/ui/datatable/smartadmin-datatable.module";
import { SmartadminInputModule } from "../../shared/forms/input/smartadmin-input.module";
import { FormsModule } from '@angular/forms';
import { FacilityService } from './facility.service';
import { FacilityDetailsComponent } from "./facility-details/facility-details.component";
import { FacilityPatientSourcesComponent } from "./facility-patient-sources/facility-patient-sources.component";
import { FacilitySupportersComponent } from "./facility-supporters/facility-supporters.component";
import { FacilityUsersComponent } from "./facility-users/facility-users.component";
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
import { FacilityPatientSourcesPipe } from './facility-patient-sources/facility-patient-sources.pipe';
import { FacilitySupportersPipe } from './facility-supporters/facility-supporters.pipe';
import { FacilityUsersPipe } from './facility-users/facility-users.pipe';

@NgModule({
  declarations: [
    FacilityPatientSourcesComponent,
    FacilityDetailsComponent,
    FacilitySupportersComponent,
    FacilityUsersComponent,
    FacilityPatientSourcesPipe,
    FacilitySupportersPipe,
    FacilityUsersPipe
  ],
  imports: [
    CommonModule,
    routing,
    SmartadminModule,
    SmartadminDatatableModule,
    SmartadminInputModule,
    FormsModule,
    MultiselectDropdownModule
  ],
  providers: [FacilityService],
  entryComponents: []
})

export class FacilityModule { }