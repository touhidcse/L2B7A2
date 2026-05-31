1. # Project Name:

2. # Live URL:

3. Features: Authenticatin module has User Registration and User Login features,  Issues Module
   has Create Issue,  Get All Issues, Get Single Issue, Update Issue and Delete Issue features.

4. # Tech stack:

   a. Node.js version v24.15.0
   b. TypeScript  6.0.3
   c.Express.js (Modular Router Architecture) version 5.0.6
   d. PostgreSQL
   e.Raw SQL (Direct pool.query)
   f.bcrypt for password hashing
   g.jsonwebtoken for JWT generation & verification

5. # Setup steps: Commands are given below one by one

   npm init --y  // For set all question to YES

   npm i -D typescript  // For using typeScript in development


   npx tsc --init // For fetching typescript's configaration file (tsconfig.json)

   npm install express

   npm i --save-dev @types/express // express do not support typeScript inbuilt, so this package 

   npm i -D tsx  // package for writing script

   npm install pg  // to install pg, a pool between local and neon db

   npm i --save-dev @types/pg  // pg do not support typeScript inbuilt, so this package 

   npx neonctl@latest init  // neon db connection 

   .env   // after creating .env file put connection string, secret token, port number etc

   npm i dotenv       // for .env file
   
   After if under src folder I created a config folder, in config folder took a index.ts file for config and path setting
  
   npm i bcryptjs // for hash

   npm i jsonwebtoken   /// for generating token

   npm i cors   // only specific URL allowed

   npm i --save-dev @types/cors //cors do not support typeScript inbuilt, so this package 
  

6. # API endpoints:

   a. POST /api/auth/signup
   b. POST /api/auth/login
   c. POST /api/issues
   d. GET /api/issues?sort=newest
   e. GET /api/issues/:id
   f. PATCH /api/issues/:id
   g. DELETE /api/issues/:id

7. Database schema Summary:
##  Database Schema Summary

###  Table: users

This table stores all system users including contributors and maintainers.

| Field | Description |
|------|-------------|
| id | Auto-incrementing unique identifier for each account |
| name | Full display name of the team member, required |
| email | Unique login email address, required |
| password | Encrypted password stored securely, never returned in API responses |
| role | User role for access control. Default: `contributor`. Allowed values: `contributor`, `maintainer` |
| created_at | Timestamp when account was created (auto-generated) |
| updated_at | Timestamp when account was last updated (auto-updated) |

---

### 🐛 Table: issues

This table stores bug reports and feature requests submitted by users.

| Field | Description |
|------|-------------|
| id | Auto-incrementing unique identifier for each issue |
| title | Short headline of the issue, required, maximum 150 characters |
| description | Detailed explanation of the issue, required, minimum 20 characters |
| type | Category of issue. Allowed values: `bug`, `feature_request` |
| status | Current workflow state. Default: `open`. Allowed values: `open`, `in_progress`, `resolved` |
| reporter_id | ID of the user who created the issue (handled in application logic, not foreign key constrained) |
| created_at | Timestamp when the issue was created (auto-generated) |
| updated_at | Timestamp when the issue was last updated (auto-updated) |


