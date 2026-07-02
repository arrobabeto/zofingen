CREATE TABLE settings
(
  id varchar(255) DEFAULT uid() PRIMARY KEY,
  name text       DEFAULT '...'::text,
  data json       DEFAULT '{
    "key": "value"
  }'::json
)
