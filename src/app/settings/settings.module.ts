import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { routing } from "./settings.routing";
import { SmartadminModule } from "../shared/smartadmin.module";
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        routing,
        SmartadminModule,
        FormsModule
    ]
})

export class SettingsModule { }