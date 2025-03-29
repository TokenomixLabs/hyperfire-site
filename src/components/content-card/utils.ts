
import { FileText, Play, Clock } from 'lucide-react';
import React from 'react';

export const getTypeIcon = (type: string): React.ReactNode => {
  switch (type) {
    case 'video':
      return <Play size={14} className="mr-1" />;
    case 'document':
      return <FileText size={14} className="mr-1" />;
    case 'livestream':
      return <Clock size={14} className="mr-1" />;
    default:
      return <FileText size={14} className="mr-1" />;
  }
};

export const getBrandColor = (brand: string): string => {
  switch (brand.toLowerCase()) {
    case 'insiderlife':
      return 'bg-insider-600 text-white';
    case 'tokenomix':
      return 'bg-blue-600 text-white';
    case 'insiderdao':
      return 'bg-purple-600 text-white';
    default:
      return 'bg-gray-600 text-white';
  }
};

export const getPlatformName = (platform: string): string => {
  switch (platform) {
    case 'insiderlife': return 'InsiderLife';
    case 'insiderdao': return 'InsiderDAO';
    case 'societi': return 'Societi';
    case 'aifc': return 'AI Freedom Code';
    default: return platform;
  }
};
