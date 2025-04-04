
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/lovable-uploads/b9d22a42-f61c-4dc2-84b3-6c4c0660df62.png" 
        alt="HyperFIRE Logo" 
        className="h-12 w-auto" 
      />
    </Link>
  );
};

export default Logo;
