import React from 'react';
import './toolkit.css';

interface ModuleProps {
  onBack: () => void;
}

export const TrainingModule: React.FC<ModuleProps> = ({ onBack }) => (
  <div className="toolkit-screen">
    <header className="toolkit-header">
      <button type="button" className="toolkit-back" onClick={onBack}>← Back</button>
      <div>
        <h1 className="toolkit-title">Creator Training</h1>
        <p className="toolkit-subtitle">Workflow fundamentals</p>
      </div>
    </header>
    <div className="toolkit-placeholder">
      <p><strong>Module 1:</strong> Client intake — scope, deliverables, timeline, usage rights.</p>
      <p><strong>Module 2:</strong> Pre-production — shot list, gear prep, location scout.</p>
      <p><strong>Module 3:</strong> On-set — slate, audio checks, exposure consistency.</p>
      <p><strong>Module 4:</strong> Post — proxy workflow, color, delivery specs for social vs broadcast.</p>
    </div>
  </div>
);

export const ChecklistsModule: React.FC<ModuleProps> = ({ onBack }) => (
  <div className="toolkit-screen">
    <header className="toolkit-header">
      <button type="button" className="toolkit-back" onClick={onBack}>← Back</button>
      <div>
        <h1 className="toolkit-title">Production Checklists</h1>
      </div>
    </header>
    {[
      'Batteries charged (camera, grip, audio)',
      'Cards formatted & labeled',
      'Lens cloth, ND filters, rain cover',
      'Lav + boom + headphones test',
      'White balance + picture profile confirmed',
      'Client brief reviewed on set',
      'Backup audio recorder rolling',
      'Room tone captured (30s)',
    ].map((item) => (
      <div key={item} className="toolkit-list-item">☐ {item}</div>
    ))}
  </div>
);

export const ShortcutsModule: React.FC<ModuleProps> = ({ onBack }) => (
  <div className="toolkit-screen">
    <header className="toolkit-header">
      <button type="button" className="toolkit-back" onClick={onBack}>← Back</button>
      <div>
        <h1 className="toolkit-title">Camera Shortcuts</h1>
      </div>
    </header>
  <div className="toolkit-preset-card">
      <h3>Suggested custom buttons (Sony)</h3>
      <div className="toolkit-detail-row"><span>C1</span><span>AF/MF toggle</span></div>
      <div className="toolkit-detail-row"><span>C2</span><span>Focus peaking on/off</span></div>
      <div className="toolkit-detail-row"><span>C3</span><span>Zebra display toggle</span></div>
      <div className="toolkit-detail-row"><span>C4</span><span>S&Q / slow motion quick</span></div>
      <div className="toolkit-detail-row"><span>Fn</span><span>White balance picker</span></div>
    </div>
  </div>
);

export const InvoiceModule: React.FC<ModuleProps> = ({ onBack }) => (
  <div className="toolkit-screen">
    <header className="toolkit-header">
      <button type="button" className="toolkit-back" onClick={onBack}>← Back</button>
      <div>
        <h1 className="toolkit-title">Invoice Builder</h1>
      </div>
    </header>
    <div className="toolkit-placeholder">
      <p>Standard line items for AVA creators:</p>
      <div className="toolkit-list-item">Production day — $X / 10hr</div>
      <div className="toolkit-list-item">Half day — $X / 5hr</div>
      <div className="toolkit-list-item">Edit / color — $X per minute delivered</div>
      <div className="toolkit-list-item">Travel — mileage + per diem</div>
      <div className="toolkit-list-item">Rush fee — +25% under 48hr turnaround</div>
      <p style={{ marginTop: '1rem' }}>Export full invoices from the client portal after booking.</p>
    </div>
  </div>
);
