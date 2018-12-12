import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {AddPlan} from '../../actions/app.actions';
import {AlertController} from '@ionic/angular';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {getUserConfiguration} from '../../reducers';
import {filter, take} from 'rxjs/operators';
import {UserConfigurationInfo} from '../../bean/result/index.result';
import {AppService} from '../../app.service';

@Component({
    selector: 'app-add-plan',
    templateUrl: './add-plan.page.html',
    styleUrls: ['./add-plan.page.scss'],
})
export class AddPlanPage implements OnInit {

    form: FormGroup;

    endTime: string;

    userConfiguration: UserConfigurationInfo;

    minDate: string;

    maxDate: string;

    constructor(private formBuilder: FormBuilder,
                private store$: Store<any>,
                private router: Router,
                private alertController: AlertController,
                public service: AppService,
                private datePipe: DatePipe) {
    }

    ngOnInit() {

        const now = new Date();
        const date = this.datePipe.transform(now, 'yyyy-MM-dd');
        this.minDate = date;
        this.maxDate = this.datePipe.transform(new Date(now.getTime() + 60 * 60 * 60 * 1000), 'yyyy-MM-dd');

        this.store$.pipe(
            select(getUserConfiguration),
            filter(userConfiguration => !!userConfiguration),
            take(1)
        ).subscribe(userConfiguration => {
            this.userConfiguration = userConfiguration;
            const beginTime = this.datePipe.transform(now, 'HH:mm:ss');
            this.changeEndTime(beginTime);
            this.form = this.formBuilder.group({
                beginTime: [beginTime, Validators.required],
                content: ['', Validators.required],
                date: [date, Validators.required]
            });

            this.form.controls['beginTime'].valueChanges.pipe(
                filter(value => !!value)
            ).subscribe(value => this.changeEndTime(value));
        });
    }

    changeEndTime(beginTime: string) {
        const array = beginTime.split(':');
        const date = new Date();
        date.setHours(+array[0], +array[1], +array[2], (+this.userConfiguration.workTime) * 60 * 1000);
        this.endTime = this.datePipe.transform(date, 'HH:mm:ss');
    }

    create() {
        if (this.form.valid) {
            this.store$.dispatch(new AddPlan({
                content: this.form.value.content,
                beginTime: `${this.form.value.date} ${this.form.value.beginTime}`,
                endTime: `${this.form.value.date} ${this.form.value.endTime}`
            }));
            this.router.navigateByUrl('tabs/(home:home)');
        } else {
            this.alertController.create({
                message: '表单不正确',
                buttons: ['OK']
            }).then((alert: any) => alert.present());
        }
    }

}
