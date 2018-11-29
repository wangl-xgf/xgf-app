import {AppActionTypes, IndexSuccess} from '../actions/app.actions';
import {IndexResult} from '../bean/result/index.result';


export function indexReducer(
    state: IndexResult = null,
    action: IndexSuccess
): IndexResult {
    switch (action.type) {
        case AppActionTypes.IndexSuccess:
            return action.payload;
        default:
            return state;
    }
}



