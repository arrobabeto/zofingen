CREATE TABLE contacts
(
    id         varchar(255) DEFAULT uid() PRIMARY KEY,
    first_name text         DEFAULT '...'::text,
    last_name  text         DEFAULT '...'::text,
    email      text         DEFAULT '...'::text,
    phone      text         DEFAULT '...'::text,
    created_at timestamptz  DEFAULT CURRENT_TIMESTAMP
);
