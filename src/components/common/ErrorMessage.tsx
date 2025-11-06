import React from 'react';
import { AppError } from '../../types/index';

interface ErrorMessageProps {
  error: AppError | null;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="mt-8 max-w-2xl mx-auto p-4 bg-red-50 border border-red-300 text-red-800 rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold">{error.message}</p>
          {error.details && <p className="text-sm mt-1 opacity-75">{error.details}</p>}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-600 hover:text-red-800 font-bold ml-4"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
