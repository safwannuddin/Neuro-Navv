import React from 'react';
import ImageUpload from '../components/ImageUpload';

const ImageAnalysis: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Brain MRI Analysis</h1>
      <p className="text-gray-600 mb-8 text-center">
        Upload a brain MRI image to analyze it for potential tumors and get detailed predictions.
      </p>
      <ImageUpload />
    </div>
  );
};

export default ImageAnalysis; 