-- Drop existing policies first
DROP POLICY IF EXISTS "Allow public insert" ON scans;
DROP POLICY IF EXISTS "Allow public read" ON scans;
DROP POLICY IF EXISTS "Allow public access to scans" ON storage.objects;

-- Drop existing table with CASCADE to handle dependencies
DROP TABLE IF EXISTS scans CASCADE;

-- Create scans table
CREATE TABLE scans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type TEXT NOT NULL,
    public_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'uploaded',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create RLS policies
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert scans
CREATE POLICY "Allow public insert" ON scans
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Allow anyone to read scans
CREATE POLICY "Allow public read" ON scans
    FOR SELECT
    TO public
    USING (true);

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('scans', 'scans', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to scans bucket
CREATE POLICY "Allow public access to scans"
    ON storage.objects
    FOR ALL
    TO public
    USING (bucket_id = 'scans')
    WITH CHECK (bucket_id = 'scans');

-- Recreate foreign key constraints
ALTER TABLE analysis_results
    ADD CONSTRAINT analysis_results_scan_id_fkey
    FOREIGN KEY (scan_id)
    REFERENCES scans(id)
    ON DELETE CASCADE;

ALTER TABLE reports
    ADD CONSTRAINT reports_scan_id_fkey
    FOREIGN KEY (scan_id)
    REFERENCES scans(id)
    ON DELETE CASCADE;

-- Recreate policies for dependent tables
CREATE POLICY "Users can view their own analysis results"
    ON analysis_results
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Users can view their own reports"
    ON reports
    FOR SELECT
    TO public
    USING (true); 