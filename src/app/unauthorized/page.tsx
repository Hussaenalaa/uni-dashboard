export default function Unauthorized() {
  return (
    <div className="h-screen flex items-center justify-center">
      <h1 className="text-2xl text-red-600">
        Access Denied - You are not allowed to view this page
      </h1>
    </div>
  );
}