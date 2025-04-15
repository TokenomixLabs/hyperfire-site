
import React from 'react';

interface BrandPreviewProps {
  font: string;
  primaryColor: string;
}

const BrandPreview: React.FC<BrandPreviewProps> = ({ font, primaryColor }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
      <div 
        className="border p-4 rounded-lg" 
        style={{
          fontFamily: font,
          backgroundColor: primaryColor,
          color: 'white'
        }}
      >
        Preview Area
      </div>
    </div>
  );
};

export default BrandPreview;
