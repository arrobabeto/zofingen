CREATE TABLE templates
(
  id varchar(255) DEFAULT uid() PRIMARY KEY,
  
  name text DEFAULT '...'::text,
  
  sections_before json DEFAULT '[
    {
      "height": 0,
      "_orbi": { "component": "SectionSpacer" }
    }
  ]'::json,
  
  sections_after json DEFAULT '[
    {
      "height": 0,
      "_orbi": { "component": "SectionSpacer" }
    }
  ]'::json
);
