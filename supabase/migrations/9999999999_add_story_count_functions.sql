-- Create functions for incrementing/decrementing story counts
CREATE OR REPLACE FUNCTION increment_story_count(story_id UUID, column_name TEXT)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE stories SET %I = COALESCE(%I, 0) + 1 WHERE id = $1', column_name, column_name)
  USING story_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_story_count(story_id UUID, column_name TEXT)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE stories SET %I = GREATEST(COALESCE(%I, 0) - 1, 0) WHERE id = $1', column_name, column_name)
  USING story_id;
END;
$$ LANGUAGE plpgsql;

