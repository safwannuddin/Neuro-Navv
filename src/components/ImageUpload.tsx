import React, { useState } from 'react';
import axios from 'axios';

interface PredictionResult {
  predicted_class: string;
  confidence: number;
  all_probabilities: {
    [key: string]: number;
  };
}

const ImageUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPrediction(response.data);
    } catch (err) {
      setError('Error processing image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {preview && (
        <div className="mb-4">
          <img
            src={preview}
            alt="Preview"
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        className={`px-4 py-2 rounded-lg ${
          !selectedFile || loading
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {loading ? 'Processing...' : 'Analyze Image'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {prediction && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Analysis Results:</h3>
          <p className="mb-2">
            <span className="font-medium">Predicted Class:</span>{' '}
            {prediction.predicted_class}
          </p>
          <p className="mb-2">
            <span className="font-medium">Confidence:</span>{' '}
            {(prediction.confidence * 100).toFixed(2)}%
          </p>
          <div className="mt-4">
            <h4 className="font-medium mb-2">All Probabilities:</h4>
            <div className="space-y-2">
              {Object.entries(prediction.all_probabilities).map(([class_name, prob]) => (
                <div key={class_name} className="flex justify-between">
                  <span className="capitalize">{class_name}:</span>
                  <span>{(prob * 100).toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 