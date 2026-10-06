import { useState } from 'react';
import './App.css';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

function Icon({ name, size = 20 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (name === 'search') return <svg {...common}><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></svg>;
  if (name === 'pin') return <svg {...common}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>;
  if (name === 'drop') return <svg {...common}><path d="M12 22a7 7 0 0 0 7-7c0-4-7-13-7-13S5 11 5 15a7 7 0 0 0 7 7Z"/><path d="M9 16a3 3 0 0 0 3 3"/></svg>;
  if (name === 'wind') return <svg {...common}><path d="M3 8h12a3 3 0 1 0-3-3"/><path d="M2 12h17a3 3 0 1 1-3 3"/><path d="M4 16h5a2 2 0 1 1-2 2"/></svg>;
  return <svg {...common}><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>;
}

export default function App() {
  const [oras, setOras] = useState('');
  const [vreme, setVreme] = useState(null);
  const [eroare, setEroare] = useState('');
  const [seIncarca, setSeIncarca] = useState(false);

  async function cautaVreme(event) {
    event?.preventDefault();
    const numeOras = oras.trim();
    if (!numeOras || seIncarca) return;

    setSeIncarca(true);
    setEroare('');
    setVreme(null);
    try {
      // The frontend calls only our Express proxy; API credentials stay on the server.
      const res = await fetch(`${API_BASE_URL}/api/vremea/${encodeURIComponent(numeOras)}`);
      const data = await res.json();
      if (!res.ok) setEroare(data.error || 'Something went wrong. Please try again.');
      else setVreme(data);
    } catch {
      setEroare('Could not reach the server. Check that it is running and try again.');
    } finally {
      setSeIncarca(false);
    }
  }

  return (
    <main className="weather-app">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Clima, home page">
          <span className="brand-mark"><Icon name="sun" size={19} /></span>
          <span>clima<span className="brand-dot">.</span></span>
        </a>
        <div className="topbar-note"><span className="live-dot" /> WEATHER AT A GLANCE</div>
      </header>

      <section className="main-content" id="home">
        <div className="intro">
          <p className="eyebrow">YOUR FORECAST, MADE SIMPLE</p>
          <h1>Your city,<br /><span>your forecast.</span></h1>
          <p className="intro-copy">Quickly check the temperature and weather conditions wherever you need them.</p>
        </div>

        <form className="search-box" onSubmit={cautaVreme}>
          <span className="search-icon"><Icon name="pin" size={20} /></span>
          <label className="sr-only" htmlFor="city-search">City name</label>
          <input id="city-search" type="text" value={oras} onChange={e => setOras(e.target.value)} placeholder="Search for a city..." autoComplete="off" />
          <button type="submit" disabled={seIncarca || !oras.trim()} aria-label="Search weather">
            {seIncarca ? <span className="loader" /> : <><span className="button-label">Search</span><Icon name="search" size={18} /></>}
          </button>
        </form>

        {eroare && <div className="error-message" role="alert">{eroare}</div>}

        {vreme ? (
          <section className="weather-card" aria-live="polite">
            <div className="weather-card-top">
              <div><p className="card-kicker">CURRENT WEATHER</p><h2><Icon name="pin" size={18} />{vreme.oras}</h2></div>
              <span className="weather-badge">JUST UPDATED</span>
            </div>
            <div className="weather-main">
              <div className="temperature">{Math.round(vreme.temperatura)}<span>°</span></div>
              <div className="conditions">
                <img src={`https://openweathermap.org/img/wn/${vreme.iconaCod}@2x.png`} alt="" />
                <span>{vreme.descriere}</span>
              </div>
            </div>
            <div className="weather-details">
              <div className="detail"><span className="detail-icon"><Icon name="sun" /></span><div><span className="detail-label">FEELS LIKE</span><strong>{Math.round(vreme.senzatieTermica)}°C</strong></div></div>
              <div className="detail"><span className="detail-icon"><Icon name="drop" /></span><div><span className="detail-label">HUMIDITY</span><strong>{vreme.umiditate}%</strong></div></div>
              <div className="detail"><span className="detail-icon"><Icon name="wind" /></span><div><span className="detail-label">WIND</span><strong>{vreme.vantKmH} <small>km/h</small></strong></div></div>
            </div>
          </section>
        ) : !eroare && (
          <div className="empty-state">
            <div className="weather-art" aria-hidden="true"><span className="sun-disc" /><span className="cloud cloud-back" /><span className="cloud cloud-front" /><span className="art-spark spark-one">✳</span><span className="art-spark spark-two">✳</span></div>
            <p>{seIncarca ? 'Getting your forecast…' : 'A better day starts with a forecast.'}</p>
            <span>{seIncarca ? 'Current conditions are on the way.' : 'Enter a city to see current weather conditions.'}</span>
          </div>
        )}
      </section>

      <footer className="footer"><span>NO GUESSWORK. JUST WEATHER.</span><span>Make plans with confidence <span className="footer-star">✳</span></span></footer>
    </main>
  );
}
