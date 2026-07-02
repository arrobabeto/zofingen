CREATE TABLE comments
(
    id         varchar(255) DEFAULT uid() PRIMARY KEY,
    text       text         DEFAULT '...'::text,
    post_id    varchar(255),
    created_at timestamptz  DEFAULT CURRENT_TIMESTAMP
);
