import {ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import * as fromRouter from '@ngrx/router-store';
import {RouterStateSerializer} from '@ngrx/router-store';
import * as fromApp from './app.reducer';
import {Params, RouterStateSnapshot} from '@angular/router';
/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import {storeFreeze} from 'ngrx-store-freeze';
import {indexReducer} from './index.reducer';
import {IndexResult, PlanInfo, UserConfigurationInfo} from '../bean/result/index.result';
import {userConfigurationReducer} from './user-configuration.reducer';
import {InitResult} from '../bean/result/init.result';
import {plansAdapter, plansReducer, PlansState} from './plans.reducer';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
    router: fromRouter.RouterReducerState<RouterStateUrl>;
    app: InitResult;
    userConfiguration: UserConfigurationInfo;
    plansState: PlansState;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const reducers: ActionReducerMap<State> = {
    router: fromRouter.routerReducer,
    app: fromApp.reducer,
    userConfiguration: userConfigurationReducer,
    plansState: plansReducer
};

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
    return function(state: State, action: any): State {
        console.log('state', state);
        console.log('action', action);
        return reducer(state, action);
    };
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<State>[] = environment.production ? [] : [storeFreeze, logger];


export const getAppState = createFeatureSelector<InitResult>('app');
//

export const getUserId = createSelector(
    getAppState, state => state && state.userId
);


export const getUserConfiguration = createFeatureSelector<UserConfigurationInfo>('userConfiguration');
export const getPlansState = createFeatureSelector<PlansState>('plansState');

export const {
    selectIds: getPlanIds,
    selectEntities: getPlanEntities,
    selectAll: getAllPlans,
    selectTotal: getTotalPlans,
} = plansAdapter.getSelectors(getPlansState);

export const getPageIndex = createSelector(
    getPlansState, state => state.pageIndex
);









/**
 * The RouterStateSerializer takes the current RouterStateSnapshot
 * and returns any pertinent information needed. The snapshot contains
 * all information about the state of the router at the given point in time.
 * The entire snapshot is complex and not always needed. In this case, you only
 * need the URL and query parameters from the snapshot in the store. Other items could be
 * returned such as route parameters and static route data.
 */

export interface RouterStateUrl {
    url: string;
    params: Params;
    queryParams: Params;
}

export class CustomRouterStateSerializer
    implements RouterStateSerializer<RouterStateUrl> {
    serialize(routerState: RouterStateSnapshot): RouterStateUrl {
        let route = routerState.root;

        while (route.firstChild) {
            route = route.firstChild;
        }

        const {
            url,
            root: { queryParams },
        } = routerState;
        const { params } = route;

        // Only return an object including the URL, params and query params
        // instead of the entire snapshot
        return { url, params, queryParams };
    }
}

