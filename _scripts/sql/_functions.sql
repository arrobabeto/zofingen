CREATE
OR REPLACE FUNCTION uid() RETURNS text
  LANGUAGE sql AS
$$
SELECT STRING_AGG(SUBSTRING(
                          'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                          CEIL(RANDOM() * 62) ::integer, 1), '')
FROM GENERATE_SERIES(1, 6) $$;
