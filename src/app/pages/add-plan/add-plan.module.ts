import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {AddPlanPage} from './add-plan.page';

const routes: Routes = [
    {
        path: '',
        component: AddPlanPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    providers: [DatePipe],
    declarations: [AddPlanPage]
})
export class AddPlanPageModule {
}
