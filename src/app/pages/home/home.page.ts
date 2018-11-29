import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {getPlansState, getAllPlans} from '../../reducers';
import {Observable} from 'rxjs';
import {PlanInfo} from '../../bean/result/index.result';
import {OperatePlan, Index, ChangePlan} from '../../actions/app.actions';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';

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
                private router: Router) {}
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
    delete(id: number) {
        this.store$.dispatch(new OperatePlan({
            id,
            planStatus: 2
        }));
    }

    start(id: number) {
        this.store$.dispatch(new OperatePlan({
            id,
            planStatus: 1
        }));
    }

    change(id: number, day?: 0) {
        if (day === 0) {
            this.store$.dispatch(new ChangePlan({
                id,
                day
            }));
        } else {
            this.alertController.create({
                header: '请选择天数',
                subHeader: '任务将被推持',
                message: 'This is an alert message.',
                buttons: [{
                    text: '一天',
                    cssClass: 'text-agin: text-center;',
                    handler: () => this.store$.dispatch(new ChangePlan({
                        id,
                        day: 1
                    }))
                }, {
                    text: '二天',
                    handler: () => this.store$.dispatch(new ChangePlan({
                        id,
                        day: 2
                    }))
                }, '取消']
            }).then(alert => alert.present());        }
    }

    openDetail(id: number) {
        this.router.navigateByUrl(`/plan-detail/${id}`);
    }
}
