-- Allow authenticated users (admin) full access to services table
CREATE POLICY "Authenticated users full access"
  ON services
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
