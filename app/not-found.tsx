import Link from "next/link"
import { Suspense } from "react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <Suspense fallback={<div>Loading...</div>}>
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
        <h2 className="mt-4 text-2xl font-medium text-gray-700 dark:text-gray-300">Page Not Found</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link href="/" className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
            Go back home
          </Link>
        </div>
      </Suspense>
    </div>
  )
}
