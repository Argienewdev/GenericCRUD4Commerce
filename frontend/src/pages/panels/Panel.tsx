import { type ReactNode } from 'react';

interface PanelLayoutProps {
  loading: boolean;
  error: Error | null;
  onRetry: () => void;
  children: ReactNode;
}

export function PanelLayout({ loading, error, onRetry, children }: PanelLayoutProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-red-500 text-lg font-medium">
          Error: {error.message}
        </div>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return <div className="p-6">{children}</div>;
}