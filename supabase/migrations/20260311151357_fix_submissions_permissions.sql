-- Grant table-level permissions (required in addition to RLS policies)
GRANT INSERT ON submissions TO anon;
GRANT SELECT ON submissions TO authenticated;
