import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
  const [transcript, setTranscript] = useState('');
  const [prompt, setPrompt] = useState('');
  const [summary, setSummary] = useState('');
  const [editableSummary, setEditableSummary] = useState('');
  const [emails, setEmails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTranscript(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError(null);
    console.log("Transcript value being sent:", transcript);

    try {
      const response = await axios.post('https://ai-mail-summarizer-backend.vercel.app/api/summarize', {
        transcript,
        prompt
      });
      setSummary(response.data.summary);
      setEditableSummary(response.data.summary);
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post('https://ai-mail-summarizer-backend.vercel.app/api/share', {
        summary: editableSummary,
        recipients: emails.split(',').map(email => email.trim())
      });
      alert('Summary shared successfully!');
    } catch (err) {
      setError('Failed to share summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Meeting Notes Summarizer</h1>
      </header>
      <main>
        <section>
          <h2>1. Upload Transcript</h2>
          <input
            type="file"
            accept=".txt"
            onChange={handleFileChange}
          />
        </section>
        <section>
          <h2>2. Input Custom Prompt</h2>
          <textarea
            rows="4"
            cols="50"
            placeholder="e.g., 'Summarize it in points' or 'give the specific highlights'."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
        </section>
        <section>
          <button onClick={handleGenerateSummary} disabled={!transcript || isLoading}>
            {isLoading ? 'Generating...' : 'Generate Summary'}
          </button>
        </section>
        <section>
          <h2>3. Generated Summary (Editable)</h2>
          <textarea
            rows="10"
            cols="50"
            value={editableSummary}
            onChange={(e) => setEditableSummary(e.target.value)}
          ></textarea>
        </section>
        <section>
          <h2>4. Share Summary via Email</h2>
          <input
            type="text"
            placeholder="Enter recipient emails, separated by commas"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          />
          <button onClick={handleShareSummary} disabled={!editableSummary || !emails}>
            Share
          </button>
        </section>
      </main>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;
