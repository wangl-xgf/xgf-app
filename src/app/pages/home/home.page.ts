import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {getPlansState, getAllPlans} from '../../reducers';
import {Observable} from 'rxjs';
import {PlanInfo} from '../../bean/result/index.result';
import {OperatePlan, Index, ChangePlan} from '../../actions/app.actions';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {AppService} from '../../app.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

    groups$: Observable<{
        plans: PlanInfo[];
        isTomorrow: boolean;
    }[]>;

    constructor(private store$: Store<any>,
                private alertController: AlertController,
                private router: Router,
                public service: AppService) {}
    ngOnInit(): void {
        this.groups$ = this.store$.pipe(
            select(getAllPlans),
            map(plans => [{
                isTomorrow: false,
                title: '今天',
                plans: plans.filter(plan => !plan.isTomorrow),
            }, {
                isTomorrow: true,
                title: '明天',
                plans: plans.filter(plan => plan.isTomorrow),
            }])
        );
    }
    loadData(event) {
        setTimeout(() => {
            event.target.complete();
            this.store$.dispatch(new Index());
        }, 500);
    }

    openDetail(id: number) {
        this.router.navigateByUrl(`/plan-detail/${id}`);
    }
}
