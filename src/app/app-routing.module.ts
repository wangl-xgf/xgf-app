import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
    {path: '', loadChildren: './pages/tabs/tabs.module#TabsPageModule'},
  { path: 'add-plan', loadChildren: './pages/add-plan/add-plan.module#AddPlanPageModule' },
  { path: 'plan-detail/:id', loadChildren: './pages/plan-detail/plan-detail.module#PlanDetailPageModule' },
  { path: 'demo', loadChildren: './demo/demo.module#DemoPageModule' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
