import type { Metadata } from "next"

interface SEOHeadProps {
  metadata?: Partial<Metadata>
  schema?: Record<string, any> | Record<string, any>[]
}

export function SEOHead({ metadata, schema }: SEOHeadProps) {
  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: Array.isArray(schema) ? JSON.stringify(schema) : JSON.stringify(schema),
          }}
        />
      )}
    </>
  )
}
