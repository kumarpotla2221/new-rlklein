import { useState } from 'react';
import Usa from '@react-map/usa';
import { STATE_DATA } from '../../data/services';
import { MapPin, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Grid-aligned and geographic SVG layout for the 50 US states
// Providing a high-fidelity, responsive interactive vector SVG map
interface StateCoord {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const STATE_NAME_TO_ID: Record<string, string> = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA', Colorado: 'CO', Connecticut: 'CT', Delaware: 'DE',
  Florida: 'FL', Georgia: 'GA', Hawaii: 'HI', Idaho: 'ID', Illinois: 'IL', Indiana: 'IN', Iowa: 'IA', Kansas: 'KS', Kentucky: 'KY',
  Louisiana: 'LA', Maine: 'ME', Maryland: 'MD', Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN', Mississippi: 'MS', Missouri: 'MO',
  Montana: 'MT', Nebraska: 'NE', Nevada: 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', Ohio: 'OH', Oklahoma: 'OK', Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI',
  'South Carolina': 'SC', 'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX', Utah: 'UT', Vermont: 'VT', Virginia: 'VA', Washington: 'WA',
  'West Virginia': 'WV', Wisconsin: 'WI', Wyoming: 'WY',
};

// Clean geographic representation for vector layout
const US_STATE_TILES: StateCoord[] = [
  // Row 1
  { id: 'AK', name: 'Alaska', x: 20, y: 30, w: 56, h: 48 },
  { id: 'ME', name: 'Maine', x: 860, y: 30, w: 56, h: 48 },

  // Row 2
  { id: 'WA', name: 'Washington', x: 90, y: 90, w: 64, h: 54 },
  { id: 'ID', name: 'Idaho', x: 164, y: 90, w: 56, h: 54 },
  { id: 'MT', name: 'Montana', x: 230, y: 90, w: 72, h: 54 },
  { id: 'ND', name: 'North Dakota', x: 312, y: 90, w: 68, h: 54 },
  { id: 'MN', name: 'Minnesota', x: 390, y: 90, w: 68, h: 54 },
  { id: 'WI', name: 'Wisconsin', x: 468, y: 90, w: 64, h: 54 },
  { id: 'MI', name: 'Michigan', x: 542, y: 90, w: 64, h: 54 },
  { id: 'NY', name: 'New York', x: 710, y: 90, w: 64, h: 54 },
  { id: 'VT', name: 'Vermont', x: 784, y: 70, w: 50, h: 44 },
  { id: 'NH', name: 'New Hampshire', x: 844, y: 90, w: 56, h: 44 },
  { id: 'MA', name: 'Massachusetts', x: 844, y: 140, w: 70, h: 40 },

  // Row 3
  { id: 'OR', name: 'Oregon', x: 80, y: 154, w: 68, h: 54 },
  { id: 'NV', name: 'Nevada', x: 158, y: 154, w: 60, h: 62 },
  { id: 'WY', name: 'Wyoming', x: 228, y: 154, w: 70, h: 54 },
  { id: 'SD', name: 'South Dakota', x: 308, y: 154, w: 70, h: 54 },
  { id: 'IA', name: 'Iowa', x: 388, y: 154, w: 66, h: 54 },
  { id: 'IL', name: 'Illinois', x: 464, y: 154, w: 56, h: 58 },
  { id: 'IN', name: 'Indiana', x: 530, y: 154, w: 54, h: 58 },
  { id: 'OH', name: 'Ohio', x: 594, y: 154, w: 56, h: 58 },
  { id: 'PA', name: 'Pennsylvania', x: 660, y: 154, w: 68, h: 54 },
  { id: 'NJ', name: 'New Jersey', x: 738, y: 154, w: 56, h: 48 },
  { id: 'CT', name: 'Connecticut', x: 804, y: 154, w: 54, h: 40 },
  { id: 'RI', name: 'Rhode Island', x: 868, y: 154, w: 46, h: 36 },

  // Row 4
  { id: 'CA', name: 'California', x: 70, y: 220, w: 76, h: 90 },
  { id: 'UT', name: 'Utah', x: 156, y: 226, w: 62, h: 64 },
  { id: 'CO', name: 'Colorado', x: 228, y: 218, w: 74, h: 58 },
  { id: 'NE', name: 'Nebraska', x: 312, y: 218, w: 70, h: 54 },
  { id: 'MO', name: 'Missouri', x: 392, y: 218, w: 66, h: 58 },
  { id: 'KY', name: 'Kentucky', x: 518, y: 222, w: 68, h: 50 },
  { id: 'WV', name: 'West Virginia', x: 596, y: 222, w: 60, h: 50 },
  { id: 'VA', name: 'Virginia', x: 666, y: 218, w: 68, h: 52 },
  { id: 'MD', name: 'Maryland', x: 744, y: 212, w: 58, h: 42 },
  { id: 'DE', name: 'Delaware', x: 812, y: 204, w: 46, h: 40 },

  // Row 5
  { id: 'AZ', name: 'Arizona', x: 156, y: 300, w: 66, h: 68 },
  { id: 'NM', name: 'New Mexico', x: 232, y: 286, w: 68, h: 68 },
  { id: 'KS', name: 'Kansas', x: 310, y: 282, w: 74, h: 54 },
  { id: 'AR', name: 'Arkansas', x: 394, y: 286, w: 62, h: 54 },
  { id: 'TN', name: 'Tennessee', x: 466, y: 282, w: 72, h: 48 },
  { id: 'NC', name: 'North Carolina', x: 598, y: 282, w: 78, h: 50 },
  { id: 'SC', name: 'South Carolina', x: 686, y: 280, w: 64, h: 50 },

  // Row 6
  { id: 'OK', name: 'Oklahoma', x: 308, y: 346, w: 76, h: 50 },
  { id: 'LA', name: 'Louisiana', x: 394, y: 350, w: 62, h: 54 },
  { id: 'MS', name: 'Mississippi', x: 466, y: 340, w: 56, h: 56 },
  { id: 'AL', name: 'Alabama', x: 532, y: 340, w: 56, h: 56 },
  { id: 'GA', name: 'Georgia', x: 598, y: 342, w: 64, h: 58 },

  // Row 7
  { id: 'TX', name: 'Texas', x: 270, y: 406, w: 96, h: 84 },
  { id: 'FL', name: 'Florida', x: 650, y: 396, w: 78, h: 72 },
  { id: 'HI', name: 'Hawaii', x: 150, y: 450, w: 60, h: 44 },
];

export function InteractiveUSMap() {
  const [selectedState, setSelectedState] = useState<string>('CA');
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const activeStateKey = hoveredState || selectedState;
  const currentInfo = STATE_DATA[activeStateKey] || {
    name: 'United States',
    status: 'inactive',
    notes: 'Select a highlighted state to view verified regional details.',
  };

  return (
    <div className="map-container" aria-label="Interactive United States Service Area Map">
      {/* Geographic map supplied by @react-map/usa */}
      <div className="map-svg-wrap">
        <div className="usa-map-library" role="img" aria-label="Map of the United States showing R.L. Klein operational presence">
          <Usa
            type="select-single"
            size={580}
            mapColor="#E8EBF0"
            strokeColor="#FFFFFF"
            strokeWidth={1.5}
            hoverColor="#BAC6D8"
            selectColor="#0D2240"
            cityColors={{ California: '#3D4F8C' }}
            hints
            onSelect={(state) => {
              const stateId = state ? STATE_NAME_TO_ID[state] : null;
              if (stateId) {
                setSelectedState(stateId);
                setHoveredState(null);
              }
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 16, fontSize: '13px', color: 'var(--color-gray-600)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--color-navy)', display: 'inline-block' }}></span>
            <span>Active Service / Corporate Presence</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 2, background: '#E8EBF0', display: 'inline-block' }}></span>
            <span>National Inquiries</span>
          </div>
        </div>
      </div>

      {/* State Detail Card */}
      <div className="map-info-card" role="region" aria-live="polite">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-violet)' }}>
          <MapPin size={20} />
          <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Regional Presence
          </span>
        </div>

        <h3 className="map-info-card__title">
          {currentInfo.name} ({activeStateKey})
        </h3>

        <div className="map-info-card__status">
          <span className={`map-status-dot ${currentInfo.status === 'active' ? '' : 'map-status-dot--inactive'}`} />
          <span>{currentInfo.status === 'active' ? 'Active Operational Presence' : 'Available for Inquiries'}</span>
        </div>

        <p className="map-info-card__notes">
          {currentInfo.notes || 'R.L. Klein & Associates connects qualified healthcare professionals and institutional facilities across the United States. Inquire directly for specific workforce requirements.'}
        </p>

        <div className="map-info-card__actions">
          {activeStateKey === 'CA' ? (
            <Link to="/cdcr-healthcare" className="btn btn--primary btn--sm">
              <span>View California Healthcare</span>
              <ArrowRight size={14} />
            </Link>
          ) : (
            <Link to="/contact" className="btn btn--secondary btn--sm">
              <span>Contact Regional Team</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
