import React from 'react';
import { LoadingIcon } from './Icons';

const FullPageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-light flex flex-col items-center justify-center z-50">
      <img 
        src="https://i.postimg.cc/DyvJchrf/edited-image-11.png" 
        alt="Ingcweti Logo" 
        className="h-16 mb-6"
      />
      <LoadingIcon className="w-12 h-12 text-primary" />
      <p className="mt-4 text-secondary font-semibold">Loading...</p>
    </div>
  );
};

export default FullPageLoader;
