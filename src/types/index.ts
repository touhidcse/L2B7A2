export const USER_ROLE = {
    maintainer: 'maintainer',
    contributor: "contributor",
} as const;

export type ROLES = 'maintainer'| "contributor";


export const ISSUE_TYPE = {
    bug: 'bug',
    feature_request: 'feature_request'
} as const;


export type TYPES = 'bug' | 'feature_request';


export const ISSUE_STATUS ={
    open: 'open',
    in_progress: 'in_progress',
    resolved: 'resolved'
} as const;

export type STATUSES = 'open' | 'in_progress' | 'resolved';