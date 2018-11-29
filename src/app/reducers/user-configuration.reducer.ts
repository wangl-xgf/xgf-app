import {AppActionTypes, IndexSuccess} from '../actions/app.actions';
import {IndexResult, UserConfigurationInfo} from '../bean/result/index.result';


export function userConfigurationReducer(
    state: UserConfigurationInfo = null,
    action: IndexSuccess
): UserConfigurationInfo {
    switch (action.type) {
        case AppActionTypes.IndexSuccess:
            return action.payload.userConfiguration;
        default:
            return state;
    }
}



