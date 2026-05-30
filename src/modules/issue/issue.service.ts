import { pool } from "../../db";
import type { IGetIssuesQuery, IIssueResponse, IIssueRow, IUserReporter } from "./issue.interface";


// 3. Create issue

const createIssueIntoDB = async (
  payload: Iissue,
  reporter_id: number
) => {

  const { title, description, type, status } = payload;

  const result = await pool.query(
    `
      INSERT INTO issues
      (title, description, type, status,reporter_id)

      VALUES ($1, $2, $3, COALESCE($4, 'open'),$5)

      RETURNING *
    `,
    [title, description, type, status, reporter_id]
  );

  return result;
};

// 4. Get All issues

const getAllIssuesFromDB = async (query: IGetIssuesQuery): Promise<IIssueResponse[]> => {
  const { sort = "newest", type, status } = query;

  // Validation
  const allowedSort = ["newest", "oldest"] as const;
  const allowedTypes = ["bug", "feature_request"] as const;
  const allowedStatuses = ["open", "in_progress", "resolved",] as const;

  if (sort && !allowedSort.includes(sort)) {
    throw new Error(
      "Invalid sort value. Allowed values: newest, oldest"
    );
  }

  if (type && !allowedTypes.includes(type)) {
    throw new Error(
      "Invalid type value. Allowed values: bug, feature_request"
    );
  }

  if (status && !allowedStatuses.includes(status)) {
    throw new Error(
      "Invalid status value. Allowed values: open, in_progress, resolved"
    );
  }

  const conditions: string[] = [];
  const values: string[] = [];

  // Type filter
  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  // Status filter
  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const orderClause = `
  ORDER BY created_at ${sort === "oldest" ? "ASC" : "DESC"}
  `;

  const sql = `
    SELECT * FROM issues ${whereClause} ${orderClause}
    `;

  // Fetch Issues

  const issuesResult = await pool.query<IIssueRow>(sql, values);

  const issues = issuesResult.rows;

  if (issues.length === 0) {
     throw Error ("No issue found")
  }

  // Unique reporter ids

  const reporterIds = [
    ...new Set(issues.map((issue) => issue.reporter_id)),
  ];

  // Fetch all reporters in one query

  const usersResult = await pool.query<IUserReporter>(
    `
      SELECT id, name, role FROM users WHERE id = ANY($1)
    `,
    [reporterIds]
  );

  // Create lookup map

  const usersMap = new Map<number, IUserReporter>(usersResult.rows.map((user): [number, IUserReporter] =>
    [ user.id,user ])
  );

  // Formatted issue
  const formattedIssues: IIssueResponse[] =
    issues.map((issue) => {
      const reporter = usersMap.get(issue.reporter_id);

      if (!reporter) {
        throw new Error(
          `Reporter not found for issue ${issue.id}`
        );
      }

      return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
      };
    });

  return formattedIssues;
};




export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
};
