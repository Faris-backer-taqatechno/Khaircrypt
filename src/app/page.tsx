'use client';

import { useState, useTransition, useEffect } from 'react';
import { encryptAction, decryptAction } from './actions';

const COMPANIES = [
  { name: 'Qatar', id: '5d330b978c1b41ef82d8c955ebb34d2a' },
  { name: 'Kenya', id: '8248ede4834544fe9d88191e61be8671' },
];

export default function Home() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [secretKey, setSecretKey] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [inputData, setInputData] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleAction = () => {
    setError(null);
    setResult(null);

    if (!secretKey.trim()) {
      setError('Secret Key is required');
      return;
    }
    if (!companyId.trim()) {
      setError('Company ID is required');
      return;
    }
    if (!inputData.trim()) {
      setError('Input data is required');
      return;
    }

    startTransition(async () => {
      let res;
      if (mode === 'encrypt') {
        res = await encryptAction(inputData, companyId, secretKey);
      } else {
        res = await decryptAction(inputData, companyId, secretKey);
      }

      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setError(res.error || 'An unknown error occurred');
      }
    });
  };

  const copyToClipboard = (text: string | null) => {
    if (text) {
      navigator.clipboard.writeText(text);
    }
  };

  const handleSwap = () => {
    // If we have a result, swap it to input and switch mode
    if (result && !error) {
      setInputData(result);
      setResult('');
      setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
    }
  };

  const syntaxHighlight = (json: string) => {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'syntax-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'syntax-key';
        } else {
          cls = 'syntax-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'syntax-boolean';
      } else if (/null/.test(match)) {
        cls = 'syntax-null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  };

  const getDetailedContentString = () => {
    if (!result) return '';
    if (mode === 'encrypt') {
      return JSON.stringify({ encryptedData: result }, null, 2);
    } else {
      try {
        const parsed = JSON.parse(result);
        return JSON.stringify(parsed, null, 2);
      } catch (e) {
        return `"${result}"`;
      }
    }
  };

  const getSidePanelContent = () => {
    if (!result) return 'No result generated yet...';

    const contentString = getDetailedContentString();

    return (
      <div
        dangerouslySetInnerHTML={{ __html: syntaxHighlight(contentString) }}
      />
    );
  };

  return (
    <main className="container">
      <button
        className="theme-toggle"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
        )}
      </button>
      <header style={{ textAlign: 'center' }}>
        <h1>KhairCrypt</h1>
        <p className="subtitle">
          Secure Transaction Encryption Utility using AES-256-CBC & PBKDF2
        </p>
      </header>

      <div className="tabs">
        <button
          className={`tab ${mode === 'encrypt' ? 'active' : ''}`}
          onClick={() => { setMode('encrypt'); setResult(null); setError(null); }}
        >
          Encryption
        </button>
        <button
          className={`tab ${mode === 'decrypt' ? 'active' : ''}`}
          onClick={() => { setMode('decrypt'); setResult(null); setError(null); }}
        >
          Decryption
        </button>
      </div>

      <div className="main-content">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              {mode === 'encrypt' ? 'Encrypt JSON' : 'Decrypt Payload'}
            </h2>
          </div>

          <div className="form-group">
            <label>Secret Key</label>
            <input
              type="text"
              placeholder="Enter secret key..."
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Company ID (Salt)</label>
            <select
              value={COMPANIES.some(c => c.id === companyId) ? companyId : ""}
              onChange={(e) => setCompanyId(e.target.value)}
              style={{ marginBottom: '0.5rem' }}
            >
              <option value="">Custom / Manual Entry</option>
              {COMPANIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="e.g. company_123"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              {mode === 'encrypt' ? 'JSON Payload' : 'Encrypted String (Base64)'}
            </label>
            <textarea
              placeholder={
                mode === 'encrypt'
                  ? '{"amount": 1000, "currency": "SAR"}'
                  : 'SGVsbG8gV29ybGQ...'
              }
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
            />
          </div>

          <button
            onClick={handleAction}
            disabled={isPending}
            style={{ opacity: isPending ? 0.7 : 1 }}
          >
            {isPending
              ? 'Processing...'
              : (mode === 'encrypt' ? 'Encrypt Data' : 'Decrypt Data')}
          </button>

          {error && (
            <div className="result-area">
              <div className="error-label">Error</div>
              <div style={{ color: 'var(--error)', fontSize: '0.9rem' }}>
                {error}
              </div>
            </div>
          )}

          {result && (
            <div className="result-area">
              <div className="result-label">
                <span>Raw Output</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="copy-btn" onClick={handleSwap} title="Swap input">
                    Swap
                  </button>
                  <button className="copy-btn" onClick={() => copyToClipboard(result)}>
                    Copy
                  </button>
                </div>
              </div>
              <textarea
                readOnly
                value={result}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderColor: 'var(--success)',
                  color: 'var(--success)'
                }}
              />
            </div>
          )}
        </div>

        <div className="side-panel">
          <div className="card-header" style={{ marginBottom: '1rem' }}>
            <h3>
              {mode === 'encrypt' ? 'Formatted Encryption Output' : 'Beautified JSON Output'}
            </h3>
            {result && (
              <button
                className="copy-btn"
                onClick={() => copyToClipboard(getDetailedContentString())}
                title="Copy formatted content"
              >
                Copy
              </button>
            )}
          </div>
          <pre className="json-view">
            {getSidePanelContent()}
          </pre>
        </div>
      </div>
    </main>
  );
}
