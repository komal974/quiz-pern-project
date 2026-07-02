import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api';

export default function ResultsPage() {
  const { attemptId } = useParams();
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = await api.getResults();
        setResults(data.results || []);
        if (attemptId) {
          const detail = await api.getResultById(attemptId);
          setSelectedResult(detail);
        }
      } catch (err) {
        setError(err.message || 'Unable to load results');
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [attemptId]);

  if (loading) {
    return <div className="page-shell"><p>Loading results...</p></div>;
  }

  return (
    <div className="page-shell results-page">
      <div className="panel-card">
        <div className="quiz-header">
          <div>
            <p className="eyebrow">Result history</p>
            <h1>Your attempts</h1>
            <p>Review your scores and answers from past quiz sessions.</p>
          </div>
          <Link to="/" className="secondary-btn">Back home</Link>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="results-layout">
          <div className="results-list">
            {results.length === 0 && <p>No results yet.</p>}
            {results.map((result) => (
              <button key={result.id} type="button" className="result-item" onClick={() => api.getResultById(result.id).then((detail) => setSelectedResult(detail)).catch(() => setError('Unable to open result'))}>
                <strong>{result.title}</strong>
                <span>{result.score}/{result.total_questions}</span>
                <small>{new Date(result.submitted_at).toLocaleString()}</small>
              </button>
            ))}
          </div>

          <div className="result-details">
            {selectedResult ? (
              <>
                <h2>Attempt #{selectedResult.attempt?.id}</h2>
                <p>Score: {selectedResult.attempt?.score}/{selectedResult.attempt?.total_questions}</p>
                {selectedResult.answers?.map((answer, index) => (
                  <div key={`${answer.question}-${index}`} className="answer-card">
                    <h3>{answer.question}</h3>
                    <p>Your answer: {answer.selected_answer}</p>
                    <p>Correct answer: {answer.correct_answer}</p>
                    <p>Status: {answer.is_correct ? 'Correct' : 'Incorrect'}</p>
                  </div>
                ))}
              </>
            ) : (
              <p>Select an attempt to inspect the answers.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
