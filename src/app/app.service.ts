import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, filter, map, tap} from 'rxjs/operators';
import {environment} from '../environments/environment';
import {enc, HmacSHA256} from 'crypto-js';
import {AlertController} from '@ionic/angular';
import {IndexParams} from './bean/params/index.params';
import {InitResult} from './bean/result/init.result';
import {InitParams} from './bean/params/init.params';
import {IndexResult} from './bean/result/index.result';
import {AddPlanParams} from './bean/params/add-plan.params';
import {SetConfigParams} from './bean/params/set-config.params';
import {ChangePlanParams} from './bean/params/change-plan.params';
import {of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    private userId: number;

    private token: String;

    constructor(private httpClient: HttpClient,
                private alertController: AlertController) {
    }

    init(params: InitParams) {
        return this.post<InitResult>('login/v1/register/mch', params).pipe(
            tap(({userId, token}) => {
                this.userId = userId;
                this.token = token;
            })
        );
    }

    index(params: IndexParams) {
        return this.post<IndexResult>('index/v1/index', params);
    }

    addPlan(params: AddPlanParams) {
        return this.post<{
            id: number
        }>('plan/v1/add/plan', params);
    }

    changePlan(params: {
        day: number;
        id: number;
        userId: number;
    }) {
        return this.post('plan/v1/change/plan', params);
    }

    setConfig(params: SetConfigParams) {
        return this.post('user/v1/set', params);
    }

    /**
     * 指定计划推迟一天APi或者往前推一天
     * @returns {any}
     */
    operatePlan(params: ChangePlanParams) {
        return this.post('plan/v1/operate/plan', params);
    }

    post<T>(uri: string, params: any = {}) {
        return this.httpClient.post<CommonResponse<T>>(environment.getHttpUrl(uri), this.jsonSign(params)).pipe(
            tap(console.log),
            filter(res => {
                if (!res.succeed) {
                    this.alertController.create({
                        message: res.message,
                        buttons: ['OK']
                    }).then(alert => alert.present());
                }
                return res.succeed;
            }),
            map(res => res.data),
            catchError(err => {
                this.alertController.create({
                    header: '请求失败，服务器错误',
                    message: err.message,
                    buttons: ['OK']
                }).then(alert => alert.present());
                return of(err);
            })
        );
    }

    private jsonSign(data) {
        const timestamp = new Date().getTime();
        const json = {
            charset: 'utf-8',
            clientModel: 'iPhone',
            clientOperatingSystem: 'iOS 12.1',
            clientToken: this.token,
            data: data,
            partnerId: '10000000',
            partnerName: 'XIAOCHENGXU',
            signType: 'sha256',
            timestamp: new Date().getTime()
        };
        if (json.data) {
            const dataKey = Object.keys(json.data).sort();
            const newData = {};
            for (let i = 0; i < dataKey.length; i++) {
                newData[dataKey[i]] = json.data[dataKey[i]];
            }
            json.data = newData;
        }
        const newKey = Object.keys(json).sort();
        const newJson = {};
        for (let i = 0; i < newKey.length; i++) {
            newJson[newKey[i]] = json[newKey[i]];
        }
        const jsonStr = Object.keys(newJson).map(function (key) {
            let result;
            if (key === 'data') {
                result = key + '=' + JSON.stringify(json[key]);
            } else {
                result = key + '=' + json[key];
            }
            return result;
        }).join('&');
        console.log(jsonStr);
        return {
            ...json,
            sign: enc.Base64.stringify(HmacSHA256('Message', jsonStr))
        };
    }

}


interface CommonResponse<T> {
    data: T;
    errorCode: number;
    message: string;
    returnCode: number;
    succeed: boolean;
}
