import Link from "next/link";

export default function NotFound() {
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-dark-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-dark-900 mb-4">Page Not Found</h2>
        <p className="text-dark-700 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link href="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
}

