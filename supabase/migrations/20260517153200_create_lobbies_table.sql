/*
  # Create lobbies table

  1. New Tables
    - `lobbies`
      - `id` (uuid, primary key)
      - `rank` (text) - Player rank (Iron, Bronze, Silver, Gold, Platinum, Diamond, Ascendant, Immortal, Radiant)
      - `game_mode` (text) - Game mode (Competitive, Unrated, Spike Rush, Deathmatch, Escalation, etc.)
      - `lobby_code` (text) - The lobby code to join
      - `description` (text) - Short description of the lobby
      - `players_needed` (integer) - How many more players are needed (1-4)
      - `created_at` (timestamptz) - When the lobby was created
      - `expires_at` (timestamptz) - Auto-expire lobbies after 2 hours

  2. Security
    - Enable RLS on `lobbies` table
    - Public can read all active lobbies
    - Anyone can insert a new lobby (no auth required)
    - No updates or deletes allowed from client

  3. Notes
    - Lobbies automatically expire after 2 hours via expires_at column
    - No authentication required to create or view lobbies
*/

CREATE TABLE IF NOT EXISTS lobbies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rank text NOT NULL,
  game_mode text NOT NULL,
  lobby_code text NOT NULL,
  description text NOT NULL DEFAULT '',
  players_needed integer NOT NULL DEFAULT 1 CHECK (players_needed >= 1 AND players_needed <= 4),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '2 hours')
);

ALTER TABLE lobbies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active lobbies"
  ON lobbies FOR SELECT
  USING (expires_at > now());

CREATE POLICY "Anyone can create a lobby"
  ON lobbies FOR INSERT
  WITH CHECK (
    length(rank) > 0 AND
    length(game_mode) > 0 AND
    length(lobby_code) > 0 AND
    players_needed >= 1 AND
    players_needed <= 4
  );

CREATE INDEX IF NOT EXISTS idx_lobbies_created_at ON lobbies (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lobbies_expires_at ON lobbies (expires_at);
