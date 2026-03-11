-- Create submissions table
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  answers JSONB NOT NULL,
  results JSONB NOT NULL,
  phase INTEGER NOT NULL,
  average NUMERIC(3,1) NOT NULL,
  weakest_category TEXT,
  completed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_submissions_phase ON submissions(phase);
CREATE INDEX idx_submissions_company ON submissions(company);
CREATE INDEX idx_submissions_completed_at ON submissions(completed_at);

-- Enable RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- anon can INSERT only (public survey submissions)
CREATE POLICY "anon_insert_submissions"
  ON submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- authenticated can SELECT all (admin dashboard reads)
CREATE POLICY "authenticated_select_submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (true);
