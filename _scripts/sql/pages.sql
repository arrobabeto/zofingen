CREATE TABLE pages
(
  id varchar(255) DEFAULT uid() PRIMARY KEY,
    
  title json DEFAULT '{
    "en": "...",
    "de": "..."
  }'::json,
    
  slug text DEFAULT '...'::text,

  lead json DEFAULT '{
    "en": "<p>...</p>",
    "de": "<p>...</p>"
  }'::json,

  img text DEFAULT 'https://localhost.com/bucket/media/img.png'::text,

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

  head json DEFAULT '{
    "title": "..."
  }'::json
);
