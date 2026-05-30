export interface IGetIssuesQuery {
  sort?: "newest" | "oldest";
  type?: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
}

export interface IIssueRow {
  id: number;
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status: "open" | "in_progress" | "resolved";
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface IUserReporter {
  id: number;
  name: string;
  role: "contributor" | "maintainer";
}

export interface IIssueResponse {
  id: number;
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status: "open" | "in_progress" | "resolved";
  reporter: IUserReporter;
  created_at: Date;
  updated_at: Date;
}