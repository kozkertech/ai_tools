"use client"

import { useEffect } from "react"

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Something went wrong!</h1>
      <p className="mt-4 text-xl text-gray-700 dark:text-gray-300">
        We're sorry, but something went wrong. Please try again later.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
        <a
          href="/"
          className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Go back home
        </a>
      </div>
    </div>
  )
}
