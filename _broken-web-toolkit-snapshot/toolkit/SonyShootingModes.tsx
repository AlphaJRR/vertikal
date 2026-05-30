import React, { useState } from 'react';
import { SONY_SHOOTING_MODES, SHOOTING_SCENARIOS } from '../../data/presetsData';
import './toolkit.css';

interface SonyShootingModesProps {
  onBack: () => void;
}

export const SonyShootingModes: React.FC<SonyShootingModesProps> = ({ onBack }) => {
  const [expandedId, setExpandedId] = useState<string | null>(SONY_SHOOTING_MODES[0]?.id ?? null);
  const [scenarioId, setScenarioId] = useState<string | null>(null);

  const scenario = SHOOTING_SCENARIOS.find((s) => s.id === scenarioId);

  return (
    <div className="toolkit-screen">
      <header className="toolkit-header">
        <button type="button" className="toolkit-back" onClick={onBack}>
          ← Back
        </button>
        <div>
          <h1 className="toolkit-title">Sony Shooting Modes</h1>
          <p className="toolkit-subtitle">AUTO · P · S · A · M · MOVIE</p>
        </div>
      </header>

      <section className="toolkit-section">
        <h2>Mode reference</h2>
        {SONY_SHOOTING_MODES.map((mode) => {
          const open = expandedId === mode.id;
          return (
            <div key={mode.id} className="toolkit-mode-card">
              <button
                type="button"
                className="toolkit-mode-header"
                onClick={() => setExpandedId(open ? null : mode.id)}
              >
                <div>
                  <strong style={{ fontSize: '1.1rem' }}>{mode.shortName}</strong>
                  <div style={{ color: '#a3a3a3', fontSize: '0.8125rem' }}>{mode.name}</div>
                </div>
                <span style={{ color: '#ff006e', fontWeight: 700 }}>{open ? '−' : '+'}</span>
              </button>
              {open && (
                <div className="toolkit-mode-body">
                  <p style={{ lineHeight: 1.5, color: '#d4d4d4' }}>{mode.summary}</p>
                  <p style={{ fontSize: '0.8125rem', color: '#737373' }}>
                    Dial: <strong style={{ color: '#fff' }}>{mode.dialPosition}</strong>
                  </p>

                  <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#737373', marginTop: '0.75rem' }}>
                    Best for
                  </h3>
                  <ul>
                    {mode.bestFor.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#737373' }}>You control</h3>
                  <ul>
                    {mode.controls.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  {mode.shutterGuide && (
                    <div className="toolkit-list-item">
                      <strong>Shutter guide:</strong> {mode.shutterGuide}
                    </div>
                  )}
                  {mode.apertureGuide && (
                    <div className="toolkit-list-item">
                      <strong>Aperture guide:</strong> {mode.apertureGuide}
                    </div>
                  )}
                  <div className="toolkit-list-item">
                    <strong>ISO:</strong> {mode.isoRecommendation}
                  </div>

                  <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#737373' }}>Pro tips</h3>
                  <ul>
                    {mode.tips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>

                  <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#737373' }}>Avoid</h3>
                  <ul>
                    {mode.commonMistakes.map((mistake) => (
                      <li key={mistake}>{mistake}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </section>

      <section className="toolkit-section">
        <h2>Shooting scenarios</h2>
        {SHOOTING_SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            className="toolkit-menu-card"
            style={{ marginBottom: '0.5rem' }}
            onClick={() => setScenarioId(s.id)}
          >
            <div style={{ flex: 1 }}>
              <h3>{s.title}</h3>
              <p>{s.environment}</p>
              <p style={{ color: '#ff006e', fontSize: '0.8125rem', marginTop: '0.35rem' }}>
                Recommended: {s.recommendedMode}
              </p>
            </div>
          </button>
        ))}
      </section>

      {scenario && (
        <section className="toolkit-section">
          <h2>{scenario.title}</h2>
          <div className="toolkit-preset-card">
            <p>{scenario.environment}</p>
            <p style={{ marginTop: '0.5rem' }}>
              <strong>Mode:</strong> {scenario.recommendedMode}
            </p>
            {scenario.camera && (
              <>
                <h3 style={{ marginTop: '1rem', fontSize: '0.875rem' }}>Camera starting points</h3>
                <div className="toolkit-detail-grid">
                  {Object.entries(scenario.camera).map(([k, v]) => (
                    <div key={k} className="toolkit-detail-row">
                      <span>{k}</span>
                      <span>{String(v)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            <h3 style={{ marginTop: '1rem', fontSize: '0.875rem' }}>Checklist</h3>
            <ul>
              {scenario.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button
              type="button"
              className="toolkit-btn toolkit-btn-secondary"
              style={{ marginTop: '0.75rem' }}
              onClick={() => setScenarioId(null)}
            >
              Close scenario
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default SonyShootingModes;
