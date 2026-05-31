

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  

// src/db/index.ts
import { Pool } from "pg";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env")
});
var config = {
  connection_string: process.env.CONNECTIONSTRING,
  port: process.env.PORT,
  secret: process.env.JWT_SECRET
};
var config_default = config;

// src/db/index.ts
var pool = new Pool({
  connectionString: config_default.connection_string
});
var initDB = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(40) NOT NULL,
            email VARCHAR(30) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role VARCHAR(15) DEFAULT 'contributor' CHECK ( role IN ('contributor','maintainer')),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `);
    await pool.query(`
            CREATE TABLE IF NOT EXISTS issues(
            id SERIAL PRIMARY KEY,
            title VARCHAR(150) NOT NULL,
            description TEXT NOT NULL CHECK (LENGTH(description) >= 20),
            type VARCHAR(20) NOT NULL CHECK (type IN ('bug', 'feature_request')),
            status VARCHAR(15) DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved')),
            reporter_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `);
    console.log("Database Connected successfully!");
  } catch (error) {
    console.log(error);
  }
};

// src/app.ts
import express from "express";

// src/modules/user/user.route.ts
import { Router } from "express";

// src/modules/user/user.service.ts
import bcrypt from "bcryptjs";
var registerUserIntoDB = async (payload) => {
  const { name, email, password, role } = payload;
  const hashPassword = await bcrypt.hash(password, 12);
  const result = await pool.query(
    `
        INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3, COALESCE($4,'contributor')) 
        RETURNING *
        `,
    [name, email, hashPassword, role]
  );
  delete result.rows[0].password;
  return result;
};
var userService = {
  registerUserIntoDB
};

// src/utility/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    errors: data.errors
  });
};
var sendResponse_default = sendResponse;

// src/modules/user/user.controller.ts
import status from "http-status";
var registerUser = async (req, res) => {
  try {
    const result = await userService.registerUserIntoDB(req.body);
    sendResponse_default(res, {
      statusCode: status.CREATED,
      success: true,
      message: "User registered successfull",
      data: result.rows[0]
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: status.BAD_REQUEST,
      success: false,
      message: error.message,
      errors: error.detail
    });
  }
};
var userController = {
  registerUser
};

// src/modules/user/user.route.ts
var router = Router();
router.post("/signup", userController.registerUser);
var userRoute = router;

// src/modules/auth/auth.route.ts
import { Router as Router2 } from "express";

// src/modules/auth/auth.service.ts
import bcrypt2 from "bcryptjs";
import jwt from "jsonwebtoken";
var loginUserIntoDB = async (payload) => {
  const { email, password } = payload;
  const userData = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [email]
  );
  if (userData.rows.length === 0) {
    throw new Error("Invalid Credential");
  }
  const user = userData.rows[0];
  const correctPassword = await bcrypt2.compare(password, user.password);
  if (!correctPassword) {
    throw new Error("Invalid Password Or Email Or Username");
  }
  const jwtpayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const token = jwt.sign(jwtpayload, config_default.secret, { expiresIn: "1d" });
  delete user.password;
  return { token, user };
};
var authService = {
  loginUserIntoDB
};

// src/modules/auth/auth.controller.ts
import status2 from "http-status";
var loginUser = async (req, res) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);
    const { token, user } = result;
    res.cookie("token", token, {
      secure: false,
      httpOnly: true,
      sameSite: "lax"
    });
    sendResponse_default(res, {
      statusCode: status2.OK,
      success: true,
      message: "Login successful",
      data: {
        token,
        user
      }
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: status2.UNAUTHORIZED,
      success: false,
      message: error.message,
      errors: error.error
    });
  }
};
var authController = {
  loginUser
};

// src/modules/auth/auth.route.ts
var router2 = Router2();
router2.post("/login", authController.loginUser);
var authRoute = router2;

// src/modules/issue/issue.route.ts
import { Router as Router3 } from "express";

// src/types/index.ts
var USER_ROLE = {
  maintainer: "maintainer",
  contributor: "contributor"
};
var ISSUE_STATUS = {
  open: "open",
  in_progress: "in_progress",
  resolved: "resolved"
};

// src/modules/issue/issue.service.ts
var createIssueIntoDB = async (payload, reporter_id) => {
  const { title, description, type, status: status6 } = payload;
  const result = await pool.query(
    `
      INSERT INTO issues
      (title, description, type, status,reporter_id)

      VALUES ($1, $2, $3, COALESCE($4, 'open'),$5)

      RETURNING *
    `,
    [title, description, type, status6, reporter_id]
  );
  return result;
};
var getAllIssuesFromDB = async (query) => {
  const { sort = "newest", type, status: status6 } = query;
  const allowedSort = ["newest", "oldest"];
  const allowedTypes = ["bug", "feature_request"];
  const allowedStatuses = ["open", "in_progress", "resolved"];
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
  if (status6 && !allowedStatuses.includes(status6)) {
    throw new Error(
      "Invalid status value. Allowed values: open, in_progress, resolved"
    );
  }
  const conditions = [];
  const values = [];
  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }
  if (status6) {
    values.push(status6);
    conditions.push(`status = $${values.length}`);
  }
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const orderClause = `
  ORDER BY created_at ${sort === "oldest" ? "ASC" : "DESC"}
  `;
  const sql = `
    SELECT * FROM issues ${whereClause} ${orderClause}
    `;
  const issuesResult = await pool.query(sql, values);
  const issues = issuesResult.rows;
  if (issues.length === 0) {
    throw Error("No issue found");
  }
  const reporterIds = [
    ...new Set(issues.map((issue) => issue.reporter_id))
  ];
  const usersResult = await pool.query(
    `
      SELECT id, name, role FROM users WHERE id = ANY($1)
    `,
    [reporterIds]
  );
  const usersMap = new Map(
    usersResult.rows.map((user) => [user.id, user])
  );
  const formattedIssues = issues.map((issue) => {
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
      updated_at: issue.updated_at
    };
  });
  return formattedIssues;
};
var getSingleIssueFromDB = async (id) => {
  const issueResult = await pool.query(
    `
    SELECT *
    FROM issues
    WHERE id = $1
    `,
    [id]
  );
  if (issueResult.rows.length === 0) {
    throw new Error("Issue not found");
  }
  const issue = issueResult.rows[0];
  const userResult = await pool.query(
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
  return {
    id: issue?.id,
    title: issue?.title,
    description: issue?.description,
    type: issue?.type,
    status: issue?.status,
    reporter,
    created_at: issue?.created_at,
    updated_at: issue?.updated_at
  };
};
var updateIssueIntoDB = async (payload, issueId, userId, role) => {
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
var deleteIssueFromDB = async (issueId) => {
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
  const result = await pool.query(
    `
    DELETE FROM issues WHERE id=$1
    RETURNING *
    `,
    [issueId]
  );
  return result;
};
var issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueIntoDB,
  deleteIssueFromDB
};

// src/modules/issue/issue.controller.ts
import status3 from "http-status";
import "jsonwebtoken";
var createIssue = async (req, res) => {
  try {
    const reporter_id = req.user.id;
    const result = await issueService.createIssueIntoDB(req.body, reporter_id);
    sendResponse_default(res, {
      statusCode: status3.CREATED,
      success: true,
      message: "Issue created successfully",
      data: result.rows[0]
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: status3.UNAUTHORIZED,
      success: false,
      message: error.message,
      errors: error.error
    });
  }
};
var getAllIssues = async (req, res) => {
  try {
    const result = await issueService.getAllIssuesFromDB(req.query);
    sendResponse_default(res, {
      statusCode: status3.OK,
      success: true,
      message: "Issues retrieved successfully",
      data: result
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: status3.BAD_REQUEST,
      success: false,
      message: error.message,
      errors: error.message
    });
  }
};
var getSingleIssue = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return sendResponse_default(res, {
        statusCode: status3.BAD_REQUEST,
        success: false,
        message: "Invalid issue id",
        errors: "ID must be a number"
      });
    }
    const result = await issueService.getSingleIssueFromDB(id);
    return sendResponse_default(res, {
      statusCode: status3.OK,
      success: true,
      message: "Issue retrieved successfully",
      data: result
    });
  } catch (error) {
    return sendResponse_default(res, {
      statusCode: status3.NOT_FOUND,
      success: false,
      message: error.message,
      errors: error.message
    });
  }
};
var updateIssue = async (req, res) => {
  try {
    const issueId = Number(req.params.id);
    const user = req.user;
    const result = await issueService.updateIssueIntoDB(
      req.body,
      issueId,
      user.id,
      user.role
    );
    sendResponse_default(res, {
      statusCode: status3.OK,
      success: true,
      message: "Issue updated successfully",
      data: result
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: status3.FORBIDDEN,
      success: false,
      message: error.message,
      errors: error.message
    });
  }
};
var deleteIssue = async (req, res) => {
  try {
    const issueId = Number(req.params.id);
    const result = await issueService.deleteIssueFromDB(issueId);
    sendResponse_default(res, {
      statusCode: status3.OK,
      success: true,
      message: "Issue deleted successfully"
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: status3.FORBIDDEN,
      success: false,
      message: error.message
    });
  }
};
var issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue
};

// src/middleware/auth.ts
import status4 from "http-status";
import jwt2 from "jsonwebtoken";
var auth = (...roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return sendResponse_default(res, {
          statusCode: status4.UNAUTHORIZED,
          success: false,
          message: "Unauthorized Access"
        });
      }
      ;
      try {
        const decoded2 = jwt2.verify(
          token,
          config_default.secret
        );
      } catch {
        return sendResponse_default(res, {
          statusCode: status4.UNAUTHORIZED,
          success: false,
          message: "Invalid token"
        });
      }
      const decoded = jwt2.verify(token, config_default.secret);
      const userData = await pool.query(
        `
                SELECT * FROM users WHERE email=$1

                `,
        [decoded.email]
      );
      const user = userData.rows[0];
      if (userData.rows.length === 0) {
        return sendResponse_default(res, {
          statusCode: status4.NOT_FOUND,
          success: false,
          message: "User not found"
        });
      }
      ;
      if (roles.length && !roles.includes(user.role)) {
        return sendResponse_default(res, {
          statusCode: status4.UNAUTHORIZED,
          success: false,
          message: "Unauthorized"
        });
      }
      ;
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth;

// src/modules/issue/issue.route.ts
var router3 = Router3();
router3.post("/issues", auth_default(USER_ROLE.maintainer, USER_ROLE.contributor), issueController.createIssue);
router3.get("/issues", issueController.getAllIssues);
router3.get("/issues/:id", issueController.getSingleIssue);
router3.patch("/issues/:id", auth_default(USER_ROLE.maintainer, USER_ROLE.contributor), issueController.updateIssue);
router3.delete("/issues/:id", auth_default(USER_ROLE.maintainer), issueController.deleteIssue);
var issueRouter = router3;

// src/app.ts
import cors from "cors";

// src/middleware/globalErrrorHnadler.ts
import status5 from "http-status";
var globalErrorHandler = (err, req, res, next) => {
  sendResponse_default(res, {
    statusCode: status5.INTERNAL_SERVER_ERROR,
    success: false,
    message: err.message || "Internal Server Error"
  });
};
var globalErrrorHnadler_default = globalErrorHandler;

// src/app.ts
var app = express();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.status(200).json({
    "message": "Assingnment 2",
    "author": "Touhid"
  });
});
app.use("/api/auth", userRoute);
app.use("/api/auth", authRoute);
app.use("/api", issueRouter);
app.use(
  cors({
    origin: "http://localhost:5000"
  })
);
app.use(globalErrrorHnadler_default);
var app_default = app;

// src/server.ts
var main = () => {
  initDB();
  app_default.listen(config_default.port, () => {
    console.log(`App listening from port ${config_default.port}`);
  });
};
main();
//# sourceMappingURL=server.js.map