import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {AddPlan, AddPlanSuccess, AppActionTypes, OperatePlan, Index, IndexSuccess, LoginSuccess, ChangePlan} from '../actions/app.actions';
import {filter, map, switchMap, take, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AppService} from '../app.service';
import {AlertController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {getPageIndex, getUserId} from '../reducers';
import {PlanInfo} from '../bean/result/index.result';


declare const device;

@Injectable()
export class AppEffects {

    @Effect()
    login$ = this.actions$.pipe(
        ofType(AppActionTypes.Login),
        switchMap(() => {
            let mchId;
            if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                mchId = device.uuid;
            } else {
                mchId = '140bf7de325bb220';
            }
            return this.appService.init({
                mchId
            });
        }),
        map(result => new LoginSuccess(result))
    );

    @Effect()
    index$ = this.actions$.pipe(
        ofType<Index>(AppActionTypes.Index),
        switchMap(() => this.store$.pipe(
            select(getUserId),
            filter(userId => !!userId),
            take(1),
            switchMap(userId => this.store$.pipe(
                select(getPageIndex),
                take(1),
                switchMap(pageIndex => this.appService.index({
                    pageIndex,
                    userId
                }))
            )),
        )),
        tap(result => {
            result.planList.forEach(plan => {
                const ms = this.getMsToNow(plan.beginTime);
                plan.beginTimeout = setTimeout(() => {
                    this.alertController.create({
                        message: `计划开始${plan.content}`
                    }).then(alert => alert.present());
                    const endMs = +result.userConfiguration.workTime;
                    plan.endTimeout = setTimeout(() => {
                        this.alertController.create({
                            message: `ji hua jie shu`
                        }).then(alert => alert.present());
                    }, endMs);
                }, ms);
            });
        }),
        map(result => new IndexSuccess(result))
    );

    @Effect({dispatch: false})
    operatePlan$ = this.actions$.pipe(
        ofType<OperatePlan>(AppActionTypes.OperatePlan),
        map(action => action.payload),
        switchMap(({id, planStatus}) => this.store$.pipe(
            select(getUserId),
            take(1),
            switchMap(userId => this.appService.operatePlan({
                userId,
                id,
                planStatus
            }))
        ))
    );


    @Effect()
    addPlan$ = this.actions$.pipe(
        ofType<AddPlan>(AppActionTypes.AddPlan),
        map(action => action.payload),
        switchMap(payload => this.store$.pipe(
            select(getUserId),
            take(1),
            switchMap(userId => this.appService.addPlan({
                userId,
                beginTime: payload.beginTime,
                content: payload.content
            })),
            map(({id}) => new AddPlanSuccess(<PlanInfo> {
                id,
                ...payload
            }))
        ))
    );

    @Effect({dispatch: false})
    changePlan$ = this.actions$.pipe(
        ofType<ChangePlan>(AppActionTypes.ChangePlan),
        map(action => action.payload),
        switchMap(({id, day}) => this.store$.pipe(
            select(getUserId),
            take(1),
            switchMap(userId => this.appService.changePlan({
                id,
                day,
                userId
            }))
        ))
    );

    getMsToNow(time: string) {
        const dateTimes = time.split(' ');
        const dates = dateTimes[0].split('-');
        const times = dateTimes[1].split(':');
        const timeNum = new Date(+dates[0], +dates[1], +dates[3], +times[0], +times[1], +times[2]).getTime();
        const now = new Date().getTime();
        return timeNum - now;
    }

    constructor(private actions$: Actions,
                private store$: Store<any>,
                private router: Router,
                private alertController: AlertController,
                private appService: AppService) {}
}
