import {Action} from '@ngrx/store';
import {InitResult} from '../bean/result/init.result';
import {IndexResult, PlanInfo} from '../bean/result/index.result';

export enum AppActionTypes {
    Login = '[App] Login',
    LoginSuccess = '[App] LoginSuccess',
    Index = '[App] Index',
    IndexSuccess = '[App] IndexSuccess',
    OperatePlan = '[App] DeletePlan',
    AddPlan = '[App] AddPlan',
    AddPlanSuccess = '[App] AddPlanSuccess',
    ChangePlan = '[App] ChangePlan'
}

export class Login implements Action {
    type = AppActionTypes.Login;
}

export class LoginSuccess implements Action {
    type = AppActionTypes.LoginSuccess;
    constructor(public payload: InitResult) {}
}

export class Index implements Action {
    type = AppActionTypes.Index;
}

export class IndexSuccess implements Action {
    type = AppActionTypes.IndexSuccess;
    constructor(public payload: IndexResult) {}
}

export class OperatePlan implements Action {
    type = AppActionTypes.OperatePlan;
    constructor(public payload: {
        id: number;
        planStatus: 1 | 2
    }) {}
}

export class AddPlan implements Action {
    type = AppActionTypes.AddPlan;
    constructor(public payload: any) {}
}

export class AddPlanSuccess implements Action {
    type = AppActionTypes.AddPlanSuccess;
    constructor(public payload: PlanInfo) {}
}

export class ChangePlan implements Action {
    type = AppActionTypes.ChangePlan;
    constructor(public payload: {
        day: number;
        id: number;
    }) {}
}

