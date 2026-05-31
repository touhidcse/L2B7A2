import { pool } from "../../db";
import { ISSUE_STATUS, USER_ROLE } from "../../types";
import type { IGetIssuesQuery, IIssueResponse, IIssueRow, IUserReporter } from "./issue.interface";


// 3. Create issue

const createIssueIntoDB = async (
  payload: IIssueRow,
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
    throw Error("No issue found")
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
    [user.id, user])
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

// 5. Get single issue

const getSingleIssueFromDB = async (id: number) => {
  //  get issue
  const issueResult = await pool.query<IIssueRow>(
    `
    SELECT *
    FROM issues
    WHERE id = $1
    `,
    [id]
  );

  //  console.log(issueResult);


  if (issueResult.rows.length === 0) {
    throw new Error("Issue not found");
  }

  const issue = issueResult.rows[0];

  // console.log(issue);

  // get reporter

  const userResult = await pool.query<IUserReporter>(
    `
    SELECT id, name, role
    FROM users
    WHERE id = $1
    `,
    [issue?.reporter_id]
  );

  if (userResult.rows.length === 0) {
    throw new Error("Reporter not found");
  }
  const reporter = userResult.rows[0];

  // format response
  return {
    id: issue?.id,
    title: issue?.title,
    description: issue?.description,
    type: issue?.type,
    status: issue?.status,
    reporter,
    created_at: issue?.created_at,
    updated_at: issue?.updated_at,
  };
};

// 6. Update Issue

const updateIssueIntoDB = async (
  payload: {
    title: string;
    description: string;
    type: "bug" | "feature_request";
  },
  issueId: number,
  userId: number,
  role: string
) => {

  const issueResult = await pool.query(
    `
    SELECT *
    FROM issues
    WHERE id = $1
    `,
    [issueId]
  );

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new Error("Issue not found");
  }

  // Contributor rules
  if (role === USER_ROLE.contributor) {

    if (issue.reporter_id !== userId) {
      throw new Error(
        "Contributor can update only own issue"
      );
    }

    if (issue.status !== ISSUE_STATUS.open) {
      throw new Error(
        "Contributor can update only open issues"
      );
    }
  }

  // Nobody can update resolved issue
  if (issue.status === ISSUE_STATUS.resolved) {
    throw new Error(
      "Cannot update resolved issue"
    );
  }

  const { title, description, type } = payload;

  const result = await pool.query(
    `
    UPDATE issues
    SET
      title = $1,
      description = $2,
      type = $3,
      updated_at = NOW()
    WHERE id = $4
    RETURNING *
    `,
    [title, description, type, issueId]
  );

  return result.rows[0];
};

// 7. Delete issue

const deleteIssueFromDB = async (issueId: number) => {
  const issueResult = await pool.query(
    `
    SELECT *
    FROM issues
    WHERE id = $1
    `,
    [issueId]
  );

  const issue = issueResult.rows[0];
  // console.log("From delte portion of issue service:",issueResult);
  if (!issue) {
    throw new Error("Issue not found");
  }

  const result = await pool.query(`
    DELETE FROM issues WHERE id=$1
    RETURNING *
    `, [issueId]
  );
  return result;
}



export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueIntoDB,
  deleteIssueFromDB
};
