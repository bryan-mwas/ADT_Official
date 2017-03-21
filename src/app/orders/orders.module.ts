import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders.component';
import { UpdateCdrrComponent } from './update-cdrr/update-cdrr.component';
import { UpdateMapComponent } from './update-map/update-map.component';
import { ViewCdrrComponent } from './view-cdrr/view-cdrr.component';
import { HighlightDirective } from './view-cdrr/cddr.directive';
import { ViewMapComponent } from './view-map/view-map.component';
import { routing } from "./orders.routing";
import { SmartadminModule } from "../shared/smartadmin.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SmartadminInputModule } from "../shared/forms/input/smartadmin-input.module";
import { SmartadminDatatableModule } from "../shared/ui/datatable/smartadmin-datatable.module";
import { OrdersService } from './orders.service';
import { Ng2PaginationModule } from 'ng2-pagination';
import { UtilsModule } from '../shared/utils/utils.module'; // For field filter pipe.

@NgModule({
  declarations: [
    OrdersComponent,
    ViewMapComponent,
    ViewCdrrComponent,
    UpdateMapComponent,
    UpdateCdrrComponent,
    HighlightDirective
  ],
  imports: [
    CommonModule,
    routing,
    SmartadminModule,
    ReactiveFormsModule,
    FormsModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    Ng2PaginationModule,
    UtilsModule,
  ],
  providers: [OrdersService],
  entryComponents: []
})
export class OrdersModule { }