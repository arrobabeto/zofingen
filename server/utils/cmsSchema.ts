export const CREATE_PAGES_TABLE_SQL = `CREATE TABLE pages (
  id text DEFAULT uid() PRIMARY KEY,
  title json DEFAULT '{
                    "en": "...",
                    "de": "..."
                }'::json,
  slug text DEFAULT '...'::text,
  sections json DEFAULT '[
                    {
                        "height": 0,
                        "_orbi": {
                            "component": "SectionSpacer"
                        }
                    }
                ]'::json,
  keywords json DEFAULT '[
                    "..."
                ]'::json,
  head json DEFAULT '{
                    "title": "..."
                }'::json,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);`

export const CREATE_POSTS_TABLE_SQL = `CREATE TABLE posts (
  id text DEFAULT uid() PRIMARY KEY,
  title json DEFAULT '{
                    "en": "...",
                    "de": "..."
                }'::json,
  lead json DEFAULT '{
                    "en": "<p>...</p>",
                    "de": "<p>...</p>"
                }'::json,
  img text DEFAULT 'https://localhost.com/bucket/media/undefined.png'::text,
  status json DEFAULT '{
                    "options": [
                        "draft",
                        "review",
                        "published"
                    ],
                    "value": "draft"
                }'::json,
  sections json DEFAULT '[
                    {
                        "title": {
                            "en": "...",
                            "de": "..."
                        },
                        "content": {
                            "en": "<p>...</p>",
                            "de": "<p>...</p>"
                        },
                        "_orbi": {
                            "component": "SectionProse"
                        }
                    }
                ]'::json,
  keywords json DEFAULT '[
                    "..."
                ]'::json,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);`

export const CREATE_SETTINGS_TABLE_SQL = `CREATE TABLE settings (
  id text DEFAULT uid() PRIMARY KEY,
  name text DEFAULT '...'::text,
  data json DEFAULT '{ "key": "value" }'::json
);`

function toIdempotentSql(sql: string) {
  return sql.replace("CREATE TABLE ", "CREATE TABLE IF NOT EXISTS ")
}

export const CMS_SCHEMA_SQL = {
  pages: CREATE_PAGES_TABLE_SQL,
  posts: CREATE_POSTS_TABLE_SQL,
  settings: CREATE_SETTINGS_TABLE_SQL,
} as const

export const CMS_SCHEMA_SQL_SAFE = {
  pages: toIdempotentSql(CREATE_PAGES_TABLE_SQL),
  posts: toIdempotentSql(CREATE_POSTS_TABLE_SQL),
  settings: toIdempotentSql(CREATE_SETTINGS_TABLE_SQL),
} as const

export type TCmsSchemaTable = keyof typeof CMS_SCHEMA_SQL
