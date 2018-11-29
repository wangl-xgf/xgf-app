import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {getPlanEntities} from '../../reducers';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {PlanInfo} from '../../bean/result/index.result';

@Component({
    selector: 'app-plan-detail',
    templateUrl: './plan-detail.page.html',
    styleUrls: ['./plan-detail.page.scss'],
})
export class PlanDetailPage implements OnInit {

    plan$: Observable<PlanInfo>;

    constructor(private activatedRoute: ActivatedRoute,
                private store$: Store<any>) {
    }

    ngOnInit() {
        const id = +this.activatedRoute.snapshot.paramMap.get('id');
        this.plan$ = this.store$.pipe(
            select(getPlanEntities),
            map(entities => entities[id]),
            tap(a => console.log(a))
        );
    }

}
