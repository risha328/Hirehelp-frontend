export default function CompanyAdminPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Company Admin</h2>
        <p className="text-gray-600">
          Manage your company's hiring process, view analytics, and oversee team activities from this dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Jobs</h3>
          <p className="text-3xl font-bold text-blue-600">12</p>
          <p className="text-sm text-gray-500 mt-1">Posted this month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Applications</h3>
          <p className="text-3xl font-bold text-green-600">156</p>
          <p className="text-sm text-gray-500 mt-1">Across all jobs</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Members</h3>
          <p className="text-3xl font-bold text-purple-600">8</p>
          <p className="text-sm text-gray-500 mt-1">Active recruiters</p>
        </div>
      </div>
    </div>
  );
}
