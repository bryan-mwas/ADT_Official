import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileComponent } from './profile.component';
import {profileRouting} from "./profile.routing";
import {SmartadminModule} from "../shared/smartadmin.module";

@NgModule ({
    imports: [
        profileRouting,
        CommonModule,
        SmartadminModule
    ],
    declarations: [
        ProfileComponent
    ],
    providers: [],
    entryComponents: []
})

export class ProfileModule { }