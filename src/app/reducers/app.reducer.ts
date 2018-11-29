import {AppActionTypes, LoginSuccess} from '../actions/app.actions';
import {InitResult} from '../bean/result/init.result';


export function reducer(
    state: InitResult = null,
    action: LoginSuccess
): InitResult {
    switch (action.type) {
        case AppActionTypes.LoginSuccess:
            return action.payload;
        default:
            return state;
    }
}



