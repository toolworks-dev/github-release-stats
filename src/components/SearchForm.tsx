import { useState, FormEvent } from 'react';
import { SearchParams } from '../types';

interface Props {
  onSearch: (params: SearchParams) => void;
}

export function SearchForm({ onSearch }: Props) {
  const [username, setUsername] = useState('');
  const [repository, setRepository] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username && repository) {
      onSearch({
        username,
        repository,
        page: 1,
        perPage: 5
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 space-y-4">
      <div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Github username"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <input
          type="text"
          value={repository}
          onChange={(e) => setRepository(e.target.value)}
          placeholder="Repository name"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        disabled={!username || !repository}
        className="w-full p-2 text-white bg-blue-500 rounded disabled:opacity-50"
      >
        Get Release Stats
      </button>
    </form>
  );
} 