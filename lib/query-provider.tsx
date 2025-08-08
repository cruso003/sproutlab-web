'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, ReactNode } from 'react';

// Create a client factory function to avoid sharing state between requests
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time - how long data is considered fresh
        staleTime: 60 * 1000, // 1 minute
        // Cache time - how long inactive data stays in cache
        gcTime: 5 * 60 * 1000, // 5 minutes (was cacheTime in v4)
        // Retry configuration
        retry: (failureCount, error: any) => {
          // Don't retry on 401, 403, 404
          if (error?.response?.status === 401 || 
              error?.response?.status === 403 || 
              error?.response?.status === 404) {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        // Refetch on window focus for important data
        refetchOnWindowFocus: false,
        // Refetch on reconnect
        refetchOnReconnect: true,
      },
      mutations: {
        // Global error handling can be added here
        onError: (error: any) => {
          console.error('Mutation error:', error);
          // You could add global error handling here
          // like showing a toast notification
        },
      },
    },
  });
};

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Create query client instance once per provider
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position="bottom"
        />
      )}
    </QueryClientProvider>
  );
}

// Export a function to get the query client for use in server actions
export { createQueryClient };
