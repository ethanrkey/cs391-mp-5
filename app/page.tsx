'use client';

import { useState } from 'react';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const checkDomainExists = async (hostname: string): Promise<boolean> => {
    try {
      const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(hostname)}`);
      const data = await response.json();
      return data.Answer && data.Answer.length > 0;
    } catch (error) {
      console.error("DNS lookup failed:", error);
      return false;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult('');
  
    // Basic protocol check
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setError("URL must start with http:// or https://");
      return;
    }
  
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      setError("Invalid URL format");
      return;
    }
  
    const domainExists = await checkDomainExists(parsed.hostname);
    if (!domainExists) {
      setError("This domain doesn't exist or isn't properly configured");
      return;
    }
  
    // Submit to backend if URL is valid
    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, alias }),
    });
  
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setResult(`${window.location.origin}${data.shortUrl}`);
    }
  };
  

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 pb-10 text-[#f5baba]">URL Shortener ✂️</h1>
      <form onSubmit={handleSubmit} className="space-y-4 border-2 p-5 rounded-lg bg-[#1e1c2e]">
        <input
          type="text"
          placeholder="Full URL (https://...)"
          className="w-full border p-2"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Custom alias"
          className="w-full border p-2"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Shorten
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {result && (
        <p className="mt-4 text-2xl">
          Short URL: <a className="text-blue-700 underline" href={result} target="_blank">{result}</a>
        </p>
      )}
    </main>
  );
}
