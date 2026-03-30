-- Pavanelli Arquitetura — Analytics Events Table
-- Fase 4: Track page views and user interactions

CREATE TABLE analytics_events (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type  text        NOT NULL,
  project_slug text,
  page        text        NOT NULL DEFAULT '/',
  session_id  text        NOT NULL,
  metadata    jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_analytics_events_event_type   ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_project_slug ON analytics_events(project_slug);
CREATE INDEX idx_analytics_events_created_at   ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_session_id   ON analytics_events(session_id);

-- Row Level Security
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Public can insert events (no auth required — anonymous tracking)
CREATE POLICY "Anyone can insert analytics events"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can read analytics data
CREATE POLICY "Authenticated users can read analytics events"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (true);

-- Cleanup function: delete events older than 90 days
CREATE OR REPLACE FUNCTION cleanup_old_analytics_events()
RETURNS void AS $$
BEGIN
  DELETE FROM analytics_events
  WHERE created_at < now() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;
