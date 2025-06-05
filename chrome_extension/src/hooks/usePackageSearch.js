import { useState, useEffect } from 'react';
import { searchNpmPackages } from '../utils/api';

export function usePackageSearch(selectedText) {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function performSearch() {
      if (!selectedText || selectedText.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const results = await searchNpmPackages(selectedText.trim(), 10);
        setSearchResults(results);
      } catch (err) {
        setError(err.message);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }

    performSearch();
  }, [selectedText]);

  return {
    searchResults,
    loading,
    error
  };
}