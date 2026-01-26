- [x] Modify hirehelp-frontend/app/auth/login/page.tsx to implement role-based redirection:
  - If user role is COMPANY_ADMIN, redirect to /companyadmin
  - If user role is SUPER_ADMIN, redirect to /superadmin
  - Otherwise, redirect to /

# TODO: Implement Fetching Candidates on SuperAdmin Page

- [x] Add findByRole method to users service in backend
- [x] Add GET /users/by-role endpoint in users controller (protected for SUPER_ADMIN)
- [x] Create usersAPI in frontend for API calls
- [x] Update superadmin/candidates page to fetch real candidates data instead of mock data
=======
# TODO: Implement Role-Based Redirection After Login

- [x] Modify hirehelp-frontend/app/auth/login/page.tsx to implement role-based redirection:
  - If user role is COMPANY_ADMIN, redirect to /companyadmin
  - If user role is SUPER_ADMIN, redirect to /superadmin
  - Otherwise, redirect to /

# TODO: Implement Fetching Candidates on SuperAdmin Page

- [x] Add findByRole method to users service in backend
- [x] Add GET /users/by-role endpoint in users controller (protected for SUPER_ADMIN)
- [x] Create usersAPI in frontend for API calls
- [x] Update superadmin/candidates page to fetch real candidates data instead of mock data
- [x] Fix import errors in backend controller
- [x] Fix merge conflicts and update frontend page with proper loading/error states
