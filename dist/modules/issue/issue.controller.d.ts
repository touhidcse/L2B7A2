import type { Request, Response } from "express";
import type { IGetIssuesQuery } from "./issue.interface";
export declare const issueController: {
    createIssue: (req: Request, res: Response) => Promise<void>;
    getAllIssues: (req: Request<{}, {}, {}, IGetIssuesQuery>, res: Response) => Promise<void>;
    getSingleIssue: (req: Request, res: Response) => Promise<void>;
    updateIssue: (req: Request, res: Response) => Promise<void>;
    deleteIssue: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=issue.controller.d.ts.map