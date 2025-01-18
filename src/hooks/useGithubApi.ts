import { useState } from 'react';
import { Release, SearchParams } from '../types';

export function useGithubApi() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReleases = async ({ username, repository, page, perPage }: SearchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repository}/releases?page=${page}&per_page=${perPage}`
      );

      if (!response.ok) {
        throw new Error(
          response.status === 404 
            ? 'Project not found' 
            : response.status === 403 
              ? "You've exceeded GitHub's rate limiting. Please try again in about an hour."
              : 'Failed to fetch releases'
        );
      }

      const data = await response.json();
      if (data.length === 0) {
        throw new Error(page > 1 ? 'No more releases' : 'No releases found for this project');
      }

      setReleases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { releases, loading, error, fetchReleases };
} 