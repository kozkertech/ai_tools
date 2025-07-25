interface FormattedOutputProps {
  content: string
}

export function FormattedOutput({ content }: FormattedOutputProps) {
  // Handle different content formats
  const formatContent = (text: string) => {
    // If content looks like HTML, render it as HTML
    if (text.includes("<") && text.includes(">")) {
      return <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: text }} />
    }

    // Otherwise, format as plain text with basic formatting
    const lines = text.split("\n")
    return (
      <div className="space-y-2">
        {lines.map((line, index) => {
          // Handle headers (lines that end with :)
          if (line.trim().endsWith(":") && line.trim().length > 1) {
            return (
              <h3 key={index} className="font-semibold text-lg mt-4 mb-2 text-gray-900 dark:text-white">
                {line.trim()}
              </h3>
            )
          }

          // Handle bullet points
          if (line.trim().startsWith("•") || line.trim().startsWith("-") || line.trim().startsWith("*")) {
            return (
              <div key={index} className="ml-4 text-gray-700 dark:text-gray-300">
                {line.trim()}
              </div>
            )
          }

          // Handle numbered lists
          if (/^\d+\./.test(line.trim())) {
            return (
              <div key={index} className="ml-4 text-gray-700 dark:text-gray-300">
                {line.trim()}
              </div>
            )
          }

          // Handle empty lines
          if (line.trim() === "") {
            return <div key={index} className="h-2" />
          }

          // Regular paragraphs
          return (
            <p key={index} className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {line.trim()}
            </p>
          )
        })}
      </div>
    )
  }

  return <div className="formatted-output">{formatContent(content)}</div>
}
