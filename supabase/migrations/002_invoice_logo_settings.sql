-- Invoice logo settings for Creator Toolkit Invoice Builder
-- Bucket: creator-assets · Path: logos/{userId}/invoice-logo.{ext}

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS invoice_logo_url TEXT,
  ADD COLUMN IF NOT EXISTS invoice_logo_option TEXT
    DEFAULT 'ava'
    CHECK (invoice_logo_option IN ('creator', 'ava', 'none'));

-- Storage bucket for creator-uploaded assets (logos, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'creator-assets',
  'creator-assets',
  true,
  2097152,
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Users can read/write their own logo folder
CREATE POLICY IF NOT EXISTS "Users can upload own invoice logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'creator-assets'
    AND auth.uid()::text = (storage.foldername(name))[2]
    AND (storage.foldername(name))[1] = 'logos'
  );

CREATE POLICY IF NOT EXISTS "Users can update own invoice logos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'creator-assets'
    AND auth.uid()::text = (storage.foldername(name))[2]
    AND (storage.foldername(name))[1] = 'logos'
  );

CREATE POLICY IF NOT EXISTS "Users can delete own invoice logos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'creator-assets'
    AND auth.uid()::text = (storage.foldername(name))[2]
    AND (storage.foldername(name))[1] = 'logos'
  );

CREATE POLICY IF NOT EXISTS "Public read creator assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'creator-assets');
