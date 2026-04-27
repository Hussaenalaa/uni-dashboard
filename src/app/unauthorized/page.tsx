import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 gap-4">
      <div className="text-6xl">🔒</div>
      <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
      <p className="text-gray-500 text-sm">You do not have permission to view this page.</p>
      <Link
        href="/login"
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
      >
        Back to Login
      </Link>
    </div>
  );
}
