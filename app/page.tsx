export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          Meeting Room Booking System
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
          <p className="text-gray-600 mb-4">
            This is a meeting room booking system with role-based access control.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-green-600">Admin</h3>
              <p className="text-sm text-gray-500">Manage users and roles</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-blue-600">Owner</h3>
              <p className="text-sm text-gray-500">View summaries and manage bookings</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-purple-600">User</h3>
              <p className="text-sm text-gray-500">Create and manage your bookings</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            💡 <strong>Tip:</strong> Start by creating a login page or seeding your database with users.
          </p>
        </div>
      </div>
    </main>
  );
}