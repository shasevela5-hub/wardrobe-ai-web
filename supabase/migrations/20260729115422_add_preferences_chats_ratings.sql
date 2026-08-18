/*
# Wardrobe AI - Additional tables (preferences, stylist chat, outfit ratings)

1. New Tables
- `user_preferences`: Per-user style, size, and color preferences.
  - id (uuid, pk)
  - user_id (uuid, defaults to auth.uid(), references auth.users)
  - style_preferences (text[] - e.g. casual, formal, trendy, minimal, sporty)
  - body_type (text - petite, average, tall, curvy)
  - favorite_colors (text[] - hex colors)
  - avoid_colors (text[] - hex colors)
  - top_size, bottom_size, shoe_size (text)
  - weather_sensitivity (text - cold, neutral, warm)
  - occasion_frequency (jsonb - {work: 5, casual: 3, ...})
  - created_at, updated_at (timestamptz)

- `stylist_chats`: AI stylist chat messages.
  - id (uuid, pk)
  - user_id (uuid, defaults to auth.uid(), references auth.users)
  - role (text - user or assistant)
  - message (text)
  - context (jsonb)
  - created_at (timestamptz)

- `outfit_ratings`: User ratings for suggested outfits.
  - id (uuid, pk)
  - user_id (uuid, defaults to auth.uid(), references auth.users)
  - outfit_id (uuid, references saved_outfits, cascade delete)
  - rating (integer 1-5)
  - created_at (timestamptz)

2. Security
- RLS enabled on all tables, owner-scoped CRUD.
- user_id defaults to auth.uid() on all tables.
*/

CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  style_preferences text[] DEFAULT '{}',
  body_type text,
  favorite_colors text[] DEFAULT '{}',
  avoid_colors text[] DEFAULT '{}',
  top_size text,
  bottom_size text,
  shoe_size text,
  weather_sensitivity text DEFAULT 'neutral',
  occasion_frequency jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_prefs" ON user_preferences;
CREATE POLICY "select_own_prefs" ON user_preferences FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_prefs" ON user_preferences;
CREATE POLICY "insert_own_prefs" ON user_preferences FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_prefs" ON user_preferences;
CREATE POLICY "update_own_prefs" ON user_preferences FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_prefs" ON user_preferences;
CREATE POLICY "delete_own_prefs" ON user_preferences FOR DELETE
  TO authenticated USING (auth.uid() = user_id);


CREATE TABLE IF NOT EXISTS stylist_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  message text NOT NULL,
  context jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stylist_chats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_chats" ON stylist_chats;
CREATE POLICY "select_own_chats" ON stylist_chats FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_chats" ON stylist_chats;
CREATE POLICY "insert_own_chats" ON stylist_chats FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_chats" ON stylist_chats;
CREATE POLICY "delete_own_chats" ON stylist_chats FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_stylist_chats_user ON stylist_chats(user_id);


CREATE TABLE IF NOT EXISTS outfit_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  outfit_id uuid REFERENCES saved_outfits(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, outfit_id)
);

ALTER TABLE outfit_ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_ratings" ON outfit_ratings;
CREATE POLICY "select_own_ratings" ON outfit_ratings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_ratings" ON outfit_ratings;
CREATE POLICY "insert_own_ratings" ON outfit_ratings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_ratings" ON outfit_ratings;
CREATE POLICY "delete_own_ratings" ON outfit_ratings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
