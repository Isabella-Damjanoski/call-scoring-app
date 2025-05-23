import { useState, useEffect } from 'react'
import './App.css'

interface Transcript {
  id: string;
  call_id: string;
  transcript: string;
  datetime?: string;
  _rid?: string;
  _self?: string;
  _etag?: string;
  _attachments?: string;
  _ts?: number;
}

// Back arrow SVG component
const BackArrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
)

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null)
  const [isTranscriptView, setIsTranscriptView] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isTranscriptView) {
      setLoading(true)
      fetch("http://localhost:7071/api/transcripts", {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to fetch transcripts: ${res.status} ${res.statusText}. ${errorText}`);
          }
          return res.json()
        })
        .then((data: Transcript[]) => {
          console.log('Received data:', data);
          setTranscripts(data)
          setError(null)
        })
        .catch((err) => {
          console.error('Error fetching transcripts:', err)
          setError(err.message || 'Failed to load transcripts. Please try again later.')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [isTranscriptView])

  const filteredTranscripts = transcripts.filter(transcript =>
    transcript.call_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transcript.transcript.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedTranscript = selectedCallId 
    ? transcripts.find(t => t.call_id === selectedCallId)
    : null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getPreviewText = (text: string) => {
    return text.length > 100 ? text.substring(0, 100) + '...' : text
  }

  const formatJson = (transcript: any) => {
    const jsonObj = {
      id: transcript.id,
      call_id: transcript.call_id,
      transcript: transcript.transcript,
      _rid: transcript._rid,
      _self: transcript._self,
      _etag: transcript._etag,
      _attachments: transcript._attachments,
      _ts: transcript._ts
    }
    return JSON.stringify(jsonObj, null, 4)
  }

  const handleHomeNavigation = () => {
    setIsTranscriptView(false)
    setSelectedCallId(null)
    setSearchQuery('')
  }

  if (!isTranscriptView) {
    return (
      <div className="app">
        <header className="header home-header">
          <h1>Call Center Agent Scorer</h1>
        </header>
        <div className="home-screen">
          <div className="home-content">
            <p className="slogan">Elevate Your Customer Service Through Intelligent Call Analysis</p>
            <div className="features">
              <div className="feature">
                <div className="feature-icon">📊</div>
                <h3>Score Calls</h3>
                <p>Evaluate agent performance with comprehensive scoring metrics</p>
              </div>
              <div className="feature">
                <div className="feature-icon">🔍</div>
                <h3>Search Transcripts</h3>
                <p>Quickly find and analyze specific customer interactions</p>
              </div>
              <div className="feature">
                <div className="feature-icon">📈</div>
                <h3>Track Progress</h3>
                <p>Monitor improvements and identify training opportunities</p>
              </div>
            </div>
            <button 
              className="primary-button"
              onClick={() => setIsTranscriptView(true)}
            >
              View Transcripts
            </button>
          </div>
          <div className="call-center-images">
            <img 
              src="./images/call-center-1.jpg" 
              alt="Modern call center workspace"
              className="call-center-image"
            />
            <img 
              src="./images/call-center-2.jpg" 
              alt="Call center team collaboration"
              className="call-center-image"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Call Transcripts</h1>
      </header>
      
      <div className="main-content">
        <div className="list-container">
          <div className="search-container">
            <button 
              className="back-button"
              onClick={handleHomeNavigation}
            >
              <BackArrow /> Home
            </button>
            <input
              type="text"
              placeholder="Search by Call ID or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="transcripts-container">
            <div className="table-header">
              <div className="table-header-cell">ID</div>
              <div className="table-header-cell">Call ID</div>
              <div className="table-header-cell">Transcript</div>
            </div>
            <div className="transcripts-scroll">
              {loading ? (
                <div className="loading-state">Loading transcripts...</div>
              ) : error ? (
                <div className="error-state">{error}</div>
              ) : filteredTranscripts.length === 0 ? (
                <div className="empty-state">No transcripts found</div>
              ) : (
                filteredTranscripts.map((transcript) => (
                  <div 
                    key={transcript.id} 
                    className={`transcript-card ${selectedCallId === transcript.call_id ? 'selected' : ''}`}
                    onClick={() => setSelectedCallId(
                      selectedCallId === transcript.call_id ? null : transcript.call_id
                    )}
                  >
                    <div className="date-cell">{transcript.id}</div>
                    <div className="call-id-cell">{transcript.call_id}</div>
                    <div className="preview-cell">{getPreviewText(transcript.transcript)}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className={`expanded-view ${!selectedTranscript ? 'hidden' : ''}`}>
          {selectedTranscript && (
            <pre className="json-view">{formatJson(selectedTranscript)}</pre>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
