export interface IndexResult {
    planList: PlanInfo[];
    userConfiguration: UserConfigurationInfo;
}

export interface PlanInfo {
    beginTime: string;
    content: string;
    endTime: string;
    icon: number;
    iconUrl: string;
    id: number;
    isTomorrow: number;
    planStatus: number;
    planStatusValue: string;

    beginTimeout?: any;
    endTimeout?: any;
}

export interface UserConfigurationInfo {
    sleepTimeShort: string;
    sleepTimeLong: string;
    workTime: string;
    conclusionTime: string;
}
