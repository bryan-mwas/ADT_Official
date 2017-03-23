import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders.component';
import { UpdateCdrrComponent } from './update-cdrr/update-cdrr.component';
import { UpdateMapComponent } from './update-map/update-map.component';
import { ViewCdrrComponent } from './view-cdrr/view-cdrr.component';
import { NewCdrrComponent } from './new-cdrr/new-cdrr.component';
import { MapTemplateComponent } from './map-template/map-template.component';
import { CdrrTemplateComponent } from './cdrr-template/cdrr-template.component';
import { HighlightDirective } from './cdrr-template/cddr.directive';
import { ViewMapComponent } from './view-map/view-map.component';
import { routing } from "./orders.routing";
import { SmartadminModule } from "../shared/smartadmin.module";
import { ReactiveFormsModule } from '@angular/forms';
import { SmartadminInputModule } from "../shared/forms/input/smartadmin-input.module";
import { SmartadminDatatableModule } from "../shared/ui/datatable/smartadmin-datatable.module";
import { OrdersService } from './orders.service';
import { Ng2PaginationModule } from 'ng2-pagination';
import { UtilsModule } from '../shared/utils/utils.module'; // For field filter pipe.

@NgModule({
  declarations: [
    OrdersComponent,
    MapTemplateComponent,
    CdrrTemplateComponent,
    ViewMapComponent,
    ViewCdrrComponent,
    UpdateMapComponent,
    UpdateCdrrComponent,
    NewCdrrComponent,
    HighlightDirective
  ],
  imports: [
    CommonModule,
    routing,
    SmartadminModule,
    ReactiveFormsModule,
    SmartadminInputModule,
    SmartadminDatatableModule,
    Ng2PaginationModule,
    UtilsModule,
  ],
  providers: [OrdersService],
  entryComponents: []
})
export class OrdersModule { }