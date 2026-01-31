Codebase Overview & Data Flow
1. Architecture High-Level
LeetLab is a full-stack MERN application (MongoDB, Express, React, Node.js) designed as a competitive programming platform.

Frontend (Vite + React): Handles UI, Authentication state (Redux), and user interactions. Uses TailwindCSS for styling and Framer Motion for animations.
Backend (Express + Node.js): REST API that manages Users, Problems, and Submissions. Indexing and Redis are used for performance and session management.
Database (MongoDB): Stores structured data (Users, Problems, Submissions).
Execution Engine: Code execution logic (submitBatch in 
problem.utils.js
) allows users to run code against test cases.
2. Data Flow Breakdown
A. Authentication Flow
Goal: Securely register/login users and manage sessions.

Frontend: User enters credentials. 
authSlice.js
 (Redux Thunk) calls axiosClient.post('/user/login').
Backend Route: /user/login -> UserAuth.controller.ts.
Controller:
Validates input (using validator).
Checks DB for user.
Compares password (bcrypt).
Generates JWT Token and sets it as an httpOnly Cookie.
Authorized Requests: authMiddleware.js intercepts future requests, verifies the JWT token, and attaches req.userId to the request object.
B. Problem Creation (Admin)
Goal: Admins create problems with test cases.

Frontend: 
Adminpage.jsx
 collects form data (Title, Description, Test Cases) and sends POST /problem/create.
Backend: 
problem.controller.js
 validates the 
admin
 role.
Database: Saves the problem to problems collection.
C. Code Execution & Submission
Goal: Run user code against test cases.

Frontend: user types code in 
Problempage.jsx
 (Monaco Editor).
Throttling: Frontend checks 5s cooldown. Backend 
rateLimit.js
 checks IP limit (10 req/min).
API Call: POST /submission/run/:id
Controller (
submission.controller.js
):
Fetches Problem (Input/Output).
Prepares batch request for the Judge (Executor).
Calls submitBatch -> submitToken.
Execution: The code runs (sandboxed external API or local runner).
Results: Controller compares stdout with expected_output.
Storage: For "Submit", it saves the result to submissions collection and updates user.problemSolved.
3. Key Components Analysis
Frontend
App.jsx
: Main router. Handles protected routes (isAuthenticated ? ... : Navigate).
authSlice.js
: Centralized state for User info. Avoids prop-drilling user data.
Problempage.jsx
: Complex page managing conflicting states: Code, Result, Throttling, and Resizable Panels.
Backend
UserAuth.controller.js
: Monolithic controller for Auth. Recommendation: Split Profile logic into Profile.controller.js.
rateLimit.js
: Custom in-memory middleware. Simple and effective for single-instance apps.
problem.utils.js
: Abstraction layer for code execution service.
4. Recommendations & Improvements
Security & Performance
Redis for Rate Limiting: Your current 
rateLimit.js
 uses a Javascript Map. If the server restarts, limits reset. If you scale to multiple servers, the map isn't shared. Fix: Use Redis to store rate limit counters.
Input Sanitation: While you validate inputs, ensure aggressive sanitation on the Code Execution side to prevent RCE (Remote Code Execution) if you ever host your own runner.
Pagination: 
Problemset.jsx
 fetches ALL problems. As the DB grows, this will become slow. Fix: Implement cursor-based or offset-based pagination in getProblmes controller.
Code Quality
Separation of Concerns: 
submission.controller.js
 contains a lot of logic determining "Accepted/Wrong Answer". Move this "Grading Logic" to a separate service/utility function.
Error Handling: Create a global errorMiddleware. Currently, every controller has its own try/catch responding with 500. A global handler makes logs cleaner.
Frontend Components: 
Problempage.jsx
 is huge. Extract the "Run Code" logic and "Result Display" into a custom hook (e.g., useCodeRunner).
UX/UI
Skeleton Loading: Instead of text "Loading...", use Skeleton loaders (gray bars) for a smoother feel.
Toast Notifications: Replace alert() with a nice toast library (e.g., sonner or react-hot-toast) for "Too many requests" or "Login Failed".
Summary
The codebase is solid for a portfolio/MVP platform. The data flow is logical and standard for MERN apps. The biggest area for "Next Level" growth is handling Scale (Pagination, Redis) and Developer Experience (Refactoring large controllers/components).