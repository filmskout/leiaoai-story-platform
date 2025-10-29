-- Generate incremental UPDATE templates for companies missing website
-- This DOES NOT update data; it only outputs suggested statements to copy/fill

WITH missing AS (
  SELECT id, name
  FROM companies
  WHERE website IS NULL OR website = ''
  ORDER BY name
)
SELECT '-- TODO: fill real URL and run below' AS note,
       CONCAT(
         'UPDATE companies SET website = ''https://',
         -- heuristic: basic slug, replace spaces and trailing " AI"
         lower(replace(regexp_replace(name, '\\s+AI$', ''), ' ', '')),
         '.com'' WHERE id = ''', id, ''';'
       ) AS update_sql
FROM missing;

-- To see list only:
-- SELECT name FROM companies WHERE website IS NULL OR website = '' ORDER BY name;
