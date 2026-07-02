CREATE TABLE posts
(
    id varchar(255) DEFAULT uid() PRIMARY KEY,

    title json DEFAULT '{
      "en": "...",
      "de": "..."
    }'::json,

    lead json DEFAULT '{
      "en": "<p>...</p>",
      "de": "<p>...</p>"
    }'::json,

    img text DEFAULT 'https://localhost.com/bucket/media/img.png'::text,

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

    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,

    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);
