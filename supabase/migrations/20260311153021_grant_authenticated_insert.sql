-- Allow authenticated users to also INSERT (covers case where
-- the Supabase JS client has an active auth session)
GRANT INSERT ON submissions TO authenticated;

-- Add RLS policy for authenticated INSERT
CREATE POLICY "authenticated_insert_submissions"
  ON submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
