import {RouterModule, Routes} from "@angular/router";
import { ProfileComponent } from './profile.component';

export const profileRoutes:Routes = [
     {
        path: '',
        component: ProfileComponent,
        data: {
            pageTitle: ''
        }
    }
]

export const profileRouting = RouterModule.forChild(profileRoutes);