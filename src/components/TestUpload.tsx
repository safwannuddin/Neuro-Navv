import { useState } from 'react';
import { storage } from '@/lib/storage';
import { db } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export default function TestUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      console.log('File selected:', {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        lastModified: new Date(selectedFile.lastModified).toLocaleString()
      });
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      console.log('Starting upload process...');
      setUploading(true);
      setError(null);
      setSuccess(false);

      // Get current user
      console.log('Checking user authentication...');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Authentication error:', authError);
        throw new Error('Authentication failed');
      }
      
      if (!user) {
        console.error('No user found');
        throw new Error('No user logged in');
      }
      
      console.log('User authenticated:', {
        id: user.id,
        email: user.email
      });

      // Upload file to storage
      console.log('Uploading file to storage...');
      const { path, error: uploadError } = await storage.uploadScan(user.id, file);
      
      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error('Failed to upload file to storage');
      }
      
      console.log('File uploaded successfully to path:', path);

      // Create scan record in database
      console.log('Creating scan record in database...');
      const scanData = {
        user_id: user.id,
        original_filename: file.name,
        file_path: path,
        file_size: file.size,
        scan_type: file.name.toLowerCase().endsWith('.dcm') ? 'dicom' : 'nifti',
        status: 'uploading',
        metadata: {
          mime_type: file.type,
          last_modified: file.lastModified
        }
      };
      
      console.log('Scan data to be inserted:', scanData);
      
      const { error: dbError } = await db.createScan(scanData);
      
      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to create scan record');
      }

      console.log('Scan record created successfully');
      setSuccess(true);
    } catch (err) {
      console.error('Upload process failed:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      console.log('Upload process completed');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Test Upload</h2>
      
      <div className="space-y-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".dcm,.nii,.nii.gz"
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-white
            hover:file:bg-primary/90"
        />

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>

        {error && (
          <div className="text-red-500">
            Error: {error}
          </div>
        )}

        {success && (
          <div className="text-green-500">
            Upload successful!
          </div>
        )}
      </div>
    </div>
  );
} 