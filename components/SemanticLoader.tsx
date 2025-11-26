
import React, { useState, useEffect } from 'react';
import { LoadingIcon } from './Icons';

interface SemanticLoaderProps {
  messages: string[];
  interval?: number;
}

const SemanticLoader: React.FC<SemanticLoaderProps> = ({ messages, interval = 2000 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, interval);
    return () => clearInterval(timer);
  }, [messages.length, interval]);

  return (
    <div className="flex flex-col items-center justify-center p-12 animate-fade-in bg-white rounded-lg h-full min-h-[300px]">
      <LoadingIcon className="w-12 h-12 animate-spin text-primary mb-6" />
      <p className="text-xl font-semibold text-secondary transition-all duration-500 ease-in-out text-center min-h-[3.5rem] max-w-md">
        {messages[index]}
      </p>
      <p className="text-sm text-gray-500 mt-2">This ensures your document is accurate and tailored to your needs.</p>
    </div>
  );
};

export default SemanticLoader;
