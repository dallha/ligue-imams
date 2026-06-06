'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { REGIONS_DATA, type RegionCode } from '@/lib/lips/types';
import { MapPin, Users, Building } from 'lucide-react';
import { useLanguage } from '@/lib/lips/i18n/language-context';

/* ------------------------------------------------------------------ */
/*  Region SVG paths — simplified but recognizable Senegal outline    */
/* ------------------------------------------------------------------ */
interface RegionPath {
  code: RegionCode;
  d: string;
  labelX: number;
  labelY: number;
}

const REGION_PATHS: RegionPath[] = [
  {
    code: 'SLG',
    d: 'M38,32 L62,14 L130,8 L195,20 L200,56 L170,70 L130,84 L108,92 L82,96 L56,80 L36,98 L24,74 Z',
    labelX: 120,
    labelY: 52,
  },
  {
    code: 'DKR',
    d: 'M18,102 L36,98 L56,80 L82,96 L78,120 L60,138 L38,132 L22,118 Z',
    labelX: 50,
    labelY: 112,
  },
  {
    code: 'THS',
    d: 'M38,132 L60,138 L78,120 L82,96 L108,92 L130,84 L140,112 L152,150 L120,170 L82,178 L50,168 Z',
    labelX: 98,
    labelY: 142,
  },
  {
    code: 'LGN',
    d: 'M130,84 L170,70 L200,56 L250,62 L295,72 L275,110 L240,128 L200,136 L170,140 L140,112 Z',
    labelX: 215,
    labelY: 98,
  },
  {
    code: 'DRL',
    d: 'M120,170 L152,150 L170,140 L200,136 L228,144 L238,178 L218,208 L180,218 L140,212 L108,200 Z',
    labelX: 178,
    labelY: 178,
  },
  {
    code: 'FTK',
    d: 'M82,178 L108,200 L140,212 L158,248 L135,268 L100,272 L68,258 L52,232 Z',
    labelX: 108,
    labelY: 236,
  },
  {
    code: 'KDHL',
    d: 'M140,212 L180,218 L218,208 L252,218 L262,258 L235,278 L198,282 L158,278 L158,248 L135,268 Z',
    labelX: 210,
    labelY: 250,
  },
  {
    code: 'KFR',
    d: 'M198,282 L235,278 L262,258 L298,268 L318,310 L288,332 L248,338 L218,328 L198,308 Z',
    labelX: 268,
    labelY: 302,
  },
  {
    code: 'MTM',
    d: 'M295,72 L345,58 L395,68 L415,95 L390,118 L345,128 L310,126 L275,110 Z',
    labelX: 348,
    labelY: 94,
  },
  {
    code: 'TMB',
    d: 'M275,110 L310,126 L345,128 L390,118 L415,95 L448,112 L462,165 L455,222 L430,262 L395,278 L352,268 L318,310 L298,268 L262,258 L252,218 L228,144 L240,128 Z',
    labelX: 360,
    labelY: 190,
  },
  {
    code: 'KDGN',
    d: 'M395,278 L430,262 L455,222 L462,165 L495,178 L525,222 L538,282 L520,330 L478,352 L435,348 L405,328 Z',
    labelX: 478,
    labelY: 272,
  },
  {
    code: 'ZG',
    d: 'M68,312 L98,295 L128,298 L158,278 L158,308 L178,338 L168,368 L142,388 L108,382 L78,365 Z',
    labelX: 122,
    labelY: 342,
  },
  {
    code: 'SED',
    d: 'M178,338 L198,308 L218,328 L248,338 L262,368 L240,392 L205,398 L178,385 Z',
    labelX: 222,
    labelY: 365,
  },
  {
    code: 'KLC',
    d: 'M248,338 L288,332 L318,310 L352,268 L395,278 L405,328 L435,348 L428,388 L388,402 L338,398 L288,385 L262,368 Z',
    labelX: 348,
    labelY: 358,
  },
];

/* ------------------------------------------------------------------ */
/*  Gambia gap shape (shows as a void / watermark)                    */
/* ------------------------------------------------------------------ */
const GAMBIA_GAP_D =
  'M82,278 L128,268 L178,278 L218,298 L262,348 L258,378 L218,368 L178,352 L128,342 L78,338 Z';

/* ------------------------------------------------------------------ */
/*  Computed stats                                                     */
/* ------------------------------------------------------------------ */
const TOTAL_POPULATION = REGIONS_DATA.reduce((s, r) => s + (r.population ?? 0), 0);
const TOTAL_MOSQUES = REGIONS_DATA.reduce((s, r) => s + (r.mosqueCount ?? 0), 0);
const POP_MILLIONS = (TOTAL_POPULATION / 1_000_000).toFixed(1);

/* ------------------------------------------------------------------ */
/*  Tooltip                                                            */
/* ------------------------------------------------------------------ */
interface TooltipData {
  code: RegionCode;
  x: number;
  y: number;
}

function MapTooltip({ data }: { data: TooltipData }) {
  const { p } = useLanguage();
  const region = REGIONS_DATA.find((r) => r.code === data.code);
  if (!region) return null;

  // Position tooltip — flip if near edges
  const tipX = data.x > 400 ? data.x - 190 : data.x + 20;
  const tipY = data.y > 320 ? data.y - 120 : data.y + 20;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 4 }}
      transition={{ duration: 0.18 }}
      className="absolute pointer-events-none z-50 w-52 rounded-xl bg-white/95 backdrop-blur-md border border-lips-green/20 shadow-lg shadow-lips-green/10 px-4 py-3"
      style={{ left: tipX, top: tipY }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[10px] font-mono font-bold bg-lips-green/10 text-lips-green px-1.5 py-0.5 rounded">
          {region.code}
        </span>
        <span className="font-arabic text-sm text-lips-gold leading-none">
          {region.nomAr}
        </span>
      </div>
      <h4 className="font-bold text-lips-green-dark text-sm">{region.nom}</h4>
      <div className="mt-2 space-y-1">
        {region.population && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3 w-3 text-lips-green-light" />
            <span>{region.population.toLocaleString()} {p.regionsPage.inhabitants}</span>
          </div>
        )}
        {region.mosqueCount && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Building className="h-3 w-3 text-lips-gold" />
            <span>{region.mosqueCount.toLocaleString()} {p.regionsPage.mosques}</span>
          </div>
        )}
        {region.coordinates && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 text-muted-foreground/40" />
            <span>
              {region.coordinates.lat.toFixed(2)}°N,{' '}
              {Math.abs(region.coordinates.lng).toFixed(2)}°W
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
interface SenegalMapProps {
  /** If true, clicking a region scrolls to the corresponding card */
  scrollToCard?: boolean;
  /** Optional compact mode — hides labels & stats */
  compact?: boolean;
  /** className for outer wrapper */
  className?: string;
}

export default function SenegalMap({
  scrollToCard = true,
  compact = false,
  className = '',
}: SenegalMapProps) {
  const { p } = useLanguage();
  const [hovered, setHovered] = useState<RegionCode | null>(null);
  const [selected, setSelected] = useState<RegionCode | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  /* ---- handlers ---- */
  const handleRegionEnter = useCallback(
    (code: RegionCode, e: React.MouseEvent | React.TouchEvent) => {
      setHovered(code);
      if (compact) return;

      // Get SVG-relative coordinates for tooltip
      const svg = svgRef.current;
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      let clientX: number, clientY: number;

      if ('touches' in e) {
        clientX = e.touches[0]?.clientX ?? rect.left + rect.width / 2;
        clientY = e.touches[0]?.clientY ?? rect.top + rect.height / 2;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const x = ((clientX - rect.left) / rect.width) * 600;
      const y = ((clientY - rect.top) / rect.height) * 450;

      setTooltip({ code, x, y });
    },
    [compact],
  );

  const handleRegionLeave = useCallback(() => {
    setHovered(null);
    if (!selected) setTooltip(null);
  }, [selected]);

  const handleRegionClick = useCallback(
    (code: RegionCode) => {
      if (selected === code) {
        setSelected(null);
        setTooltip(null);
      } else {
        setSelected(code);
        if (scrollToCard) {
          const el = document.getElementById(`region-${code}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Flash highlight
            el.classList.add('ring-2', 'ring-lips-gold', 'ring-offset-2');
            setTimeout(() => {
              el.classList.remove('ring-2', 'ring-lips-gold', 'ring-offset-2');
            }, 2000);
          }
        }
      }
    },
    [selected, scrollToCard],
  );

  const handleTouchEnd = useCallback(
    (code: RegionCode) => {
      // On mobile, toggle tooltip on tap
      if (selected === code) {
        setSelected(null);
        setTooltip(null);
      } else {
        setSelected(code);
        const pathData = REGION_PATHS.find((p) => p.code === code);
        if (pathData) {
          setTooltip({ code, x: pathData.labelX, y: pathData.labelY });
        }
      }
    },
    [selected],
  );

  /* ---- derived ---- */
  const isActive = (code: RegionCode) =>
    hovered === code || selected === code;

  return (
    <div className={`relative ${className}`}>
      {/* SVG Map */}
      <div className="relative mx-auto max-w-3xl">
        <svg
          ref={svgRef}
          viewBox="0 0 600 450"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          role="img"
          aria-label="Senegal interactive map — 14 regions"
        >
          {/* Ocean background */}
          <rect x="0" y="0" width="600" height="450" fill="transparent" />

          {/* Gambia gap (water) */}
          <path
            d={GAMBIA_GAP_D}
            fill="oklch(0.92 0.01 220 / 30%)"
            stroke="oklch(0.75 0.04 220 / 40%)"
            strokeWidth="0.8"
            strokeDasharray="4 2"
          />
          <text
            x="160"
            y="325"
            fontSize="7"
            fill="oklch(0.6 0.03 220 / 50%)"
            fontStyle="italic"
            textAnchor="middle"
          >
            Gambie
          </text>

          {/* Ocean label */}
          <text
            x="8"
            y="220"
            fontSize="8"
            fill="oklch(0.65 0.03 220 / 35%)"
            fontStyle="italic"
            writingMode="vertical-rl"
            textAnchor="middle"
          >
            Atlantique
          </text>

          {/* Region paths */}
          {REGION_PATHS.map((rp) => {
            const active = isActive(rp.code);
            const region = REGIONS_DATA.find((r) => r.code === rp.code);
            return (
              <g key={rp.code}>
                <motion.path
                  id={`map-${rp.code}`}
                  d={rp.d}
                  fill={active ? 'rgba(201,150,42,0.35)' : 'rgba(27,107,58,0.15)'}
                  stroke={active ? '#C9962A' : '#0D3B1F'}
                  strokeWidth={active ? 2 : 1.2}
                  strokeLinejoin="round"
                  className="cursor-pointer transition-[fill,stroke] duration-200"
                  whileHover={{
                    fill: 'rgba(201,150,42,0.45)',
                    stroke: '#C9962A',
                    strokeWidth: 2,
                  }}
                  onMouseEnter={(e) => handleRegionEnter(rp.code, e)}
                  onMouseLeave={handleRegionLeave}
                  onClick={() => handleRegionClick(rp.code)}
                  onTouchEnd={() => handleTouchEnd(rp.code)}
                />
                {/* Region label (only when not compact) */}
                {!compact && (
                  <text
                    x={rp.labelX}
                    y={rp.labelY}
                    fontSize={rp.code === 'DKR' ? 7 : 8}
                    fontWeight="600"
                    fill={active ? '#C9962A' : '#0D3B1F'}
                    textAnchor="middle"
                    pointerEvents="none"
                    className="select-none"
                    style={{ opacity: active ? 1 : 0.7 }}
                  >
                    {region?.nom ?? rp.code}
                  </text>
                )}
                {/* Compact: just show code */}
                {compact && (
                  <text
                    x={rp.labelX}
                    y={rp.labelY}
                    fontSize="6"
                    fontWeight="700"
                    fill={active ? '#C9962A' : '#0D3B1F'}
                    textAnchor="middle"
                    pointerEvents="none"
                    className="select-none"
                    style={{ opacity: active ? 1 : 0.5 }}
                  >
                    {rp.code}
                  </text>
                )}
              </g>
            );
          })}

          {/* Compass rose (decorative) */}
          <g transform="translate(555, 30)" opacity="0.35">
            <circle r="12" fill="none" stroke="#0D3B1F" strokeWidth="0.5" />
            <line x1="0" y1="-14" x2="0" y2="14" stroke="#0D3B1F" strokeWidth="0.5" />
            <line x1="-14" y1="0" x2="14" y2="0" stroke="#0D3B1F" strokeWidth="0.5" />
            <text y="-17" fontSize="6" textAnchor="middle" fill="#0D3B1F" fontWeight="700">
              N
            </text>
          </g>
        </svg>

        {/* Tooltip overlay */}
        {!compact && (
          <AnimatePresence>
            {tooltip && <MapTooltip data={tooltip} />}
          </AnimatePresence>
        )}
      </div>

      {/* Stats bar + Legend */}
      {!compact && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 bg-white/80 backdrop-blur-sm rounded-xl px-4 sm:px-8 py-4 border border-border/50 shadow-sm max-w-3xl mx-auto">
            {/* Stats */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-xl font-bold text-lips-green">14</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {p.regionsPage.summaryRegions}
                </div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <div className="text-xl font-bold text-lips-green">
                  {POP_MILLIONS}M
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {p.regionsPage.inhabitants}
                </div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <div className="text-xl font-bold text-lips-gold">
                  {TOTAL_MOSQUES.toLocaleString()}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {p.regionsPage.summaryMosques}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-10 bg-border" />

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block w-3 h-3 rounded-sm"
                  style={{ backgroundColor: 'rgba(27,107,58,0.15)', border: '1.2px solid #0D3B1F' }}
                />
                <span>{p.regionsPage.summaryRegions}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block w-3 h-3 rounded-sm"
                  style={{ backgroundColor: 'rgba(201,150,42,0.45)', border: '1.2px solid #C9962A' }}
                />
                <span>✓</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
