import {AddPlanSuccess, AppActionTypes, OperatePlan, IndexSuccess, ChangePlan} from '../actions/app.actions';
import {PlanInfo} from '../bean/result/index.result';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';

export interface PlansState extends EntityState<PlanInfo> {
    pageIndex: number;
}


export const plansAdapter: EntityAdapter<PlanInfo> = createEntityAdapter<PlanInfo>({
    selectId: (plan: PlanInfo) => plan.id,
    sortComparer: false
});

export function plansReducer(
    state: PlansState = plansAdapter.getInitialState({
        pageIndex: 0
    }),
    action: IndexSuccess | OperatePlan | AddPlanSuccess | ChangePlan
): PlansState {
    switch (action.type) {
        case AppActionTypes.IndexSuccess:
            return plansAdapter.addMany((action as IndexSuccess).payload.planList, <PlansState>{
                ...state,
                pageIndex: state.pageIndex + 1
            });
        case AppActionTypes.OperatePlan:
            if ((action as OperatePlan).payload.planStatus === 2) {
                return plansAdapter.removeOne((action as OperatePlan).payload.id, state);
            }
            return plansAdapter.updateOne({
                id: (action as OperatePlan).payload.id,
                changes: {
                    planStatus: 1
                }
            }, state);
        case AppActionTypes.ChangePlan:
            if ((action as ChangePlan).payload.day === 1) {

                return plansAdapter.updateOne({
                    id: (action as ChangePlan).payload.id,
                    changes: {
                        isTomorrow: 1
                    }
                }, state);
            } else {
                return plansAdapter.updateOne({
                    id: (action as ChangePlan).payload.id,
                    changes: {
                        isTomorrow: 0
                    }
                }, state);
            }
        case AppActionTypes.AddPlanSuccess:
            return plansAdapter.addOne((action as AddPlanSuccess).payload, state);
        default:
            return state;
    }
}



