import Image from "next/image"

export function GhostPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
      <Image
        src="/placeholder-rduq3.png"
        alt="No content available"
        width={150}
        height={150}
        className="mb-4 opacity-70"
      />
      <p className="text-lg font-medium">No content available from Ghost CMS.</p>
      <p className="text-sm">
        Please ensure your `GHOST_URL` and `GHOST_CONTENT_API_KEY` environment variables are correctly configured.
      </p>
      <p className="text-sm mt-2">If configured, ensure you have published posts and tags in your Ghost instance.</p>
    </div>
  )
}
