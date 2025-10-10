-- Migration: add_user_preferences_columns
-- Created at: 1759632943

-- Add columns for user preferences and settings
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS language_preference TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS theme_preference TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_chat_model TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_image_model TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_region TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_base64 TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Add check constraints for theme and language preferences
ALTER TABLE profiles ADD CONSTRAINT IF NOT EXISTS theme_preference_check 
CHECK (theme_preference IN ('light', 'dark', 'auto') OR theme_preference IS NULL);

-- Create partial index for faster lookups on user preferences
CREATE INDEX IF NOT EXISTS idx_profiles_user_prefs ON profiles (user_id, language_preference, theme_preference);;