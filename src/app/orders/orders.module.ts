import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders.component';
import { UpdateCdrrComponent } from './update-cdrr/update-cdrr.component';
import { UpdateMapComponent } from './update-map/update-map.component';
import { ViewCdrrComponent } from './view-cdrr/view-cdrr.component';
import { ViewMapComponent } from './view-map/view-map.component';
import { routing } from "./orders.routing";
import { SmartadminModule } from "../shared/smartadmin.module";
import { FormsModule } from '@angular/forms';
import { SmartadminInputModule } from "../shared/forms/input/smartadmin-input.module";
import { SmartadminDatatableModule } from "../shared/ui/datatable/smartadmin-datatable.module";
import { OrdersService } from './orders.service';

@NgModule({
  declarations: [
    OrdersComponent,
    ViewMapComponent,
    ViewCdrrComponent,
    UpdateMapComponent,
    UpdateCdrrComponent
  ],
  imports: [
    CommonModule,
    routing,
    SmartadminModule,
    FormsModule,
    SmartadminInputModule,
    SmartadminDatatableModule
  ],
  providers: [OrdersService],
  entryComponents: []
})
export class OrdersModule { }