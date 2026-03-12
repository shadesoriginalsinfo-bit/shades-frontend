import React from 'react';
import { BarLoader } from 'react-spinners';

const LoadingModal: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex flex-col items-center gap-4">
        <BarLoader color="#ffffff" />
        <p className="text-white text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingModal;
