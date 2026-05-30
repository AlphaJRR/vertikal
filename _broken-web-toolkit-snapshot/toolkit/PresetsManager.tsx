import React, { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_PRESETS,
  PRESET_STORAGE_KEY,
  PresetConfig,
  createEmptyPreset,
  duplicatePreset,
} from '../../data/presetsData';
import './toolkit.css';

interface PresetsManagerProps {
  onBack: () => void;
}

function loadPresets(): PresetConfig[] {
  try {
    const raw = localStorage.getItem(PRESET_STORAGE_KEY);
    if (!raw) return [...DEFAULT_PRESETS];
    const parsed = JSON.parse(raw) as PresetConfig[];
    return parsed.length ? parsed : [...DEFAULT_PRESETS];
  } catch {
    return [...DEFAULT_PRESETS];
  }
}

function savePresets(presets: PresetConfig[]) {
  localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets));
}

export const PresetsManager: React.FC<PresetsManagerProps> = ({ onBack }) => {
  const [presets, setPresets] = useState<PresetConfig[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<PresetConfig | null>(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    setPresets(loadPresets());
  }, []);

  const persist = useCallback((next: PresetConfig[]) => {
    setPresets(next);
    savePresets(next);
  }, []);

  const selected = presets.find((p) => p.id === selectedId) ?? null;

  const handleCreate = () => {
    const name = newName.trim() || 'New Preset';
    const preset = createEmptyPreset(name);
    persist([preset, ...presets]);
    setNewName('');
    setSelectedId(preset.id);
    setEditing(preset);
  };

  const handleDuplicate = (preset: PresetConfig) => {
    const copy = duplicatePreset(preset);
    persist([copy, ...presets]);
    setSelectedId(copy.id);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this preset?')) return;
    const next = presets.filter((p) => p.id !== id);
    persist(next.length ? next : [...DEFAULT_PRESETS]);
    if (selectedId === id) {
      setSelectedId(null);
      setEditing(null);
    }
  };

  const handleSaveEdit = () => {
    if (!editing) return;
    const next = presets.map((p) =>
      p.id === editing.id ? { ...editing, updatedAt: new Date().toISOString() } : p
    );
    persist(next);
    setEditing(null);
  };

  const updateEditing = (field: keyof PresetConfig, value: string) => {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  };

  const updateCamera = (field: keyof PresetConfig['camera'], value: string) => {
    if (!editing) return;
    setEditing({ ...editing, camera: { ...editing.camera, [field]: value } });
  };

  const updateAudio = (field: keyof PresetConfig['audio'], value: string | boolean) => {
    if (!editing) return;
    setEditing({ ...editing, audio: { ...editing.audio, [field]: value } });
  };

  return (
    <div className="toolkit-screen">
      <header className="toolkit-header">
        <button type="button" className="toolkit-back" onClick={onBack}>
          ← Back
        </button>
        <div>
          <h1 className="toolkit-title">Equipment Presets</h1>
          <p className="toolkit-subtitle">Camera + audio configurations</p>
        </div>
      </header>

      <section className="toolkit-section">
        <h2>New preset</h2>
        <input
          className="toolkit-input"
          placeholder="Preset name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="button" className="toolkit-btn toolkit-btn-primary" onClick={handleCreate}>
          Create preset
        </button>
      </section>

      {editing && (
        <section className="toolkit-section">
          <h2>Edit — {editing.name}</h2>
          <input
            className="toolkit-input"
            value={editing.name}
            onChange={(e) => updateEditing('name', e.target.value)}
          />
          <textarea
            className="toolkit-textarea"
            value={editing.description}
            onChange={(e) => updateEditing('description', e.target.value)}
            placeholder="Description"
          />
          <select
            className="toolkit-select"
            value={editing.category}
            onChange={(e) => updateEditing('category', e.target.value)}
          >
            <option value="interview">Interview</option>
            <option value="run-gun">Run & Gun</option>
            <option value="cinematic">Cinematic</option>
            <option value="event">Event</option>
            <option value="podcast">Podcast</option>
            <option value="custom">Custom</option>
          </select>

          <h2 style={{ marginTop: '1rem' }}>Camera</h2>
          {(
            Object.keys(editing.camera) as Array<keyof PresetConfig['camera']>
          ).map((key) => (
            <input
              key={key}
              className="toolkit-input"
              placeholder={key}
              value={editing.camera[key]}
              onChange={(e) => updateCamera(key, e.target.value)}
            />
          ))}

          <h2>Audio</h2>
          <input
            className="toolkit-input"
            placeholder="Input level"
            value={editing.audio.inputLevel}
            onChange={(e) => updateAudio('inputLevel', e.target.value)}
          />
          <input
            className="toolkit-input"
            placeholder="Mic type"
            value={editing.audio.micType}
            onChange={(e) => updateAudio('micType', e.target.value)}
          />
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
            <input
              type="checkbox"
              checked={editing.audio.windCut}
              onChange={(e) => updateAudio('windCut', e.target.checked)}
            />
            Wind cut
          </label>
          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
            <input
              type="checkbox"
              checked={editing.audio.limiter}
              onChange={(e) => updateAudio('limiter', e.target.checked)}
            />
            Limiter on
          </label>

          <textarea
            className="toolkit-textarea"
            value={editing.notes}
            onChange={(e) => updateEditing('notes', e.target.value)}
            placeholder="Notes"
          />

          <div className="toolkit-actions-row">
            <button type="button" className="toolkit-btn toolkit-btn-primary" onClick={handleSaveEdit}>
              Save changes
            </button>
            <button type="button" className="toolkit-btn toolkit-btn-secondary" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </section>
      )}

      <section className="toolkit-section">
        <h2>Saved presets ({presets.length})</h2>
        {presets.map((preset) => (
          <div key={preset.id} className="toolkit-preset-card">
            <h3>{preset.name}</h3>
            <p style={{ color: '#a3a3a3', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              {preset.description || 'No description'}
            </p>
            <span className="toolkit-tag">{preset.category}</span>
            {preset.tags.map((tag) => (
              <span key={tag} className="toolkit-tag">
                {tag}
              </span>
            ))}

            {selectedId === preset.id && selected && (
              <div className="toolkit-detail-grid" style={{ marginTop: '0.75rem' }}>
                <div className="toolkit-detail-row">
                  <span>Mode</span>
                  <span>{selected.camera.mode}</span>
                </div>
                <div className="toolkit-detail-row">
                  <span>Shutter</span>
                  <span>{selected.camera.shutter}</span>
                </div>
                <div className="toolkit-detail-row">
                  <span>Aperture</span>
                  <span>{selected.camera.aperture}</span>
                </div>
                <div className="toolkit-detail-row">
                  <span>ISO</span>
                  <span>{selected.camera.iso}</span>
                </div>
                <div className="toolkit-detail-row">
                  <span>Audio</span>
                  <span>{selected.audio.micType}</span>
                </div>
              </div>
            )}

            <div className="toolkit-actions-row">
              <button
                type="button"
                className="toolkit-btn toolkit-btn-secondary"
                onClick={() => setSelectedId(selectedId === preset.id ? null : preset.id)}
              >
                {selectedId === preset.id ? 'Hide' : 'View'}
              </button>
              <button type="button" className="toolkit-btn toolkit-btn-secondary" onClick={() => setEditing(preset)}>
                Edit
              </button>
              <button type="button" className="toolkit-btn toolkit-btn-secondary" onClick={() => handleDuplicate(preset)}>
                Duplicate
              </button>
              <button type="button" className="toolkit-btn toolkit-btn-danger" onClick={() => handleDelete(preset.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default PresetsManager;
