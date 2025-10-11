-- Migration: Create Storage Policies for BMC Images
-- Created: 2025-10-11
-- Purpose: Set up RLS policies for bmc-images storage bucket

-- Note: This migration assumes the 'bmc-images' bucket has been created
-- If the bucket doesn't exist, these policies will be created but won't take effect until the bucket is created

-- 1. Allow authenticated users to upload their own BMC images
-- Files are stored with path: {user_id}/{filename}
CREATE POLICY "Users can upload their own BMC images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'bmc-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 2. Allow anyone to view BMC images (public bucket)
CREATE POLICY "Anyone can view BMC images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'bmc-images');

-- 3. Allow users to update their own BMC images
CREATE POLICY "Users can update their own BMC images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'bmc-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'bmc-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Allow users to delete their own BMC images
CREATE POLICY "Users can delete their own BMC images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'bmc-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. Grant permissions to authenticated users
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;

