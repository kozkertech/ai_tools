"use client"

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Something went wrong!</h1>
          <p className="mt-4 text-xl text-gray-700 dark:text-gray-300">
            We're sorry, but something went wrong. Please try again later.
          </p>
          <div className="mt-8">
            <button
              onClick={() => reset()}
              className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
