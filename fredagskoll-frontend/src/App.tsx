import React, { useEffect, useState } from 'react';
import './App.css';
import carltonGif from './gifs/carlton.gif';
import mojoLogo from './mojo-logo.png';

function App() {
  const [isFriday, setIsFriday] = useState<boolean | null>(null);
  const [isTuesday, setIsTuesday] = useState<boolean | null>(null);
  const [isWednesday, setIsWednesday] = useState<boolean | null>(null);
  const [isThursday, setIsThursday] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5166/friday')
      .then((res) => res.json())
      .then((data) => {
        setIsFriday(data.isFriday);
        setIsTuesday(data.isTuesday);
        setIsWednesday(data.isWednesday);
        setIsThursday(data.isThursday);
        setLoading(false);
      })
      .catch(() => {
        setIsFriday(null);
        setIsTuesday(null);
        setIsWednesday(null);
        setIsThursday(null);
        setLoading(false);
      });
  }, []);

  return (
    <div className={`App${darkMode ? ' dark' : ''}`}>
      <header className="App-header">
        <button
          onClick={() => setDarkMode((d) => !d)}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            padding: '0.5rem 1.2rem',
            fontSize: 18,
            borderRadius: 8,
            border: 'none',
            background: darkMode ? '#fff' : '#222',
            color: darkMode ? '#222' : '#fff',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
        >
          {darkMode ? 'Ljust läge' : 'Mörkt läge'}
        </button>
        <img src={mojoLogo} alt="Mojo Logo" style={{ maxHeight: 320, marginBottom: 40 }} />
        {loading ? (
          <p>Laddar...</p>
        ) : isTuesday ? (
          <>
            <h1>Team Mojo... Idag är det FETTISDAG!</h1>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <img
                src="/semla-1.webp"
                alt="Semla"
                style={{ borderRadius: 12, maxHeight: 450, width: 'auto', objectFit: 'contain' }}
              />
              <img
                src="/520321381_10234349504453830_7039877959207209298_n.jpg"
                alt="Fettisdag"
                style={{ borderRadius: 12 }}
              />
            </div>
          </>
        ) : isWednesday ? (
          <>
            <h1>Team Mojo... idag är det KÖTTONSDAG!!!</h1>
            <img
              src="/meatwednesday.gif"
              alt="Kottsonsdag"
              style={{ borderRadius: 12, maxHeight: 450, width: 'auto', objectFit: 'contain' }}
            />
          </>
        ) : isFriday ? (
          <>
            <h1>Team Mojo... idag är det MARMELADFREDAG!!!</h1>
            <img
              src={carltonGif}
              alt="Carlton"
              style={{ borderRadius: 12, maxHeight: 450, width: 'auto', objectFit: 'contain' }}
            />
          </>
        ) : isThursday ? (
          <>
            <h1>Team Mojo... idag är det FISKTORSDAG!!!</h1>
            <img
              src="/fisktorsdag.gif"
              alt="Fisktorsdag"
              style={{ borderRadius: 12, maxHeight: 450, width: 'auto', objectFit: 'contain' }}
            />
          </>
        ) : (
          <p>nej, idag är det inte fredag :/</p>
        )}
      </header>
    </div>
  );
}

export default App;
