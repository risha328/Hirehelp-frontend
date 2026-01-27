# TODO: Update Company Admin Dashboard

## Task: Modify company admin dashboard to show different content based on verification status

### Steps:
1. [x] Update hirehelp-frontend/app/companyadmin/page.tsx to conditionally render content based on verification status
   - [x] For 'pending': Show "Your Registered your company but still now not verified" with basic company info
   - [x] For 'verified': Show all company details as currently implemented
   - [x] For 'rejected': Handle appropriately (possibly show rejection message)

### Files to Edit:
- [x] hirehelp-frontend/app/companyadmin/page.tsx

### Followup Steps:
- Test the dashboard after changes
- Ensure proper display for all verification statuses
