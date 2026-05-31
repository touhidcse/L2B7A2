import type { IGetIssuesQuery, IIssueResponse, IIssueRow, IUserReporter } from "./issue.interface";
export declare const issueService: {
    createIssueIntoDB: (payload: IIssueRow, reporter_id: number) => Promise<import("pg").QueryResult<any>>;
    getAllIssuesFromDB: (query: IGetIssuesQuery) => Promise<IIssueResponse[]>;
    getSingleIssueFromDB: (id: number) => Promise<{
        id: number | undefined;
        title: string | undefined;
        description: string | undefined;
        type: "bug" | "feature_request" | undefined;
        status: "open" | "in_progress" | "resolved" | undefined;
        reporter: IUserReporter | undefined;
        created_at: Date | undefined;
        updated_at: Date | undefined;
    }>;
    updateIssueIntoDB: (payload: {
        title: string;
        description: string;
        type: "bug" | "feature_request";
    }, issueId: number, userId: number, role: string) => Promise<any>;
    deleteIssueFromDB: (issueId: number) => Promise<import("pg").QueryResult<any>>;
};
//# sourceMappingURL=issue.service.d.ts.map