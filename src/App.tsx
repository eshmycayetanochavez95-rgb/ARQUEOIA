/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ModuleId,
  SiteRecord,
  AnyFichaRecord,
  SacredGeographyRecord,
  IncaStrategyRecord,
  ArchaeologicalReport,
  PhotoMaterialCategory,
  AIAnalysisResult,
  AssociationField,
} from './types/archaeology';
import {
  DEMO_IMAGES,
  INITIAL_DEMO_SITES,
  INITIAL_DEMO_FICHAS,
  INITIAL_DEMO_SACRED_GEOGRAPHY,
  INITIAL_DEMO_INCA_STRATEGIES,
  INITIAL_DEMO_REPORT,
} from './data/demoData';
import {
  AssociationSelector,
  PhotoUploader,
  AnalysisResultView,
} from './components/CommonBlocks';
import { InteractiveMap } from './components/InteractiveMap';
import { FichasModule } from './components/FichasModule';
import {
  SacredGeographyModule,
  IncaStrategyModule,
  ReportModule,
} from './components/LandscapeAndIncaModules';
import {
  Compass,
  MapPin,
  Search,
  Camera,
  FileSpreadsheet,
  Mountain,
  Landmark,
  FileText,
  Database,
  Home,
  Save,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
  Menu,
  X,
  ExternalLink,
  Trash2,
} from 'lucide-react';

const DEFAULT_ASSOCIATION: AssociationField = {
  items: [],
  tipoRelacion: 'Observada en superficie (Hipótesis espacial)',
  detalleAsociacion: '',
};

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('inicio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Persistent state with initial DEMO records clearly marked as DATOS DE DEMOSTRACIÓN
  const [sites, setSites] = useState<SiteRecord[]>(() => {
    try {
      const saved = localStorage.getItem('arqueoia_v3_sites');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_SITES;
    } catch {
      return INITIAL_DEMO_SITES;
    }
  });

  const [fichas, setFichas] = useState<AnyFichaRecord[]>(() => {
    try {
      const saved = localStorage.getItem('arqueoia_v3_fichas');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_FICHAS;
    } catch {
      return INITIAL_DEMO_FICHAS;
    }
  });

  const [sacredRecords, setSacredRecords] = useState<SacredGeographyRecord[]>(() => {
    try {
      const saved = localStorage.getItem('arqueoia_v3_sacred');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_SACRED_GEOGRAPHY;
    } catch {
      return INITIAL_DEMO_SACRED_GEOGRAPHY;
    }
  });

  const [incaRecords, setIncaRecords] = useState<IncaStrategyRecord[]>(() => {
    try {
      const saved = localStorage.getItem('arqueoia_v3_inca');
      return saved ? JSON.parse(saved) : INITIAL_DEMO_INCA_STRATEGIES;
    } catch {
      return INITIAL_DEMO_INCA_STRATEGIES;
    }
  });

  const [reports, setReports] = useState<ArchaeologicalReport[]>([INITIAL_DEMO_REPORT]);
  const [activeReport, setActiveReport] = useState<ArchaeologicalReport>(INITIAL_DEMO_REPORT);

  useEffect(() => {
    try {
      localStorage.setItem('arqueoia_v3_sites', JSON.stringify(sites));
    } catch {
      // Ignore storage quota errors for base64 photos
    }
  }, [sites]);

  useEffect(() => {
    try {
      localStorage.setItem('arqueoia_v3_fichas', JSON.stringify(fichas));
    } catch {
      // Ignore storage quota errors
    }
  }, [fichas]);

  useEffect(() => {
    try {
      localStorage.setItem('arqueoia_v3_sacred', JSON.stringify(sacredRecords));
    } catch {
      // Ignore
    }
  }, [sacredRecords]);

  useEffect(() => {
    try {
      localStorage.setItem('arqueoia_v3_inca', JSON.stringify(incaRecords));
    } catch {
      // Ignore
    }
  }, [incaRecords]);

  // ============================================================================
  // MODULE 2: REGISTRO DE SITIO ARQUEOLÓGICO STATE
  // ============================================================================
  const [siteForm, setSiteForm] = useState({
    nombreSitio: '',
    pais: 'Perú',
    region: '',
    provincia: '',
    distrito: '',
    coordenadas: '',
    altitud: '',
    periodo: '',
    cronologia: '',
    descripcion: '',
    contexto: '',
    observaciones: '',
    evidenciasAsociadas: '',
    asociadoA: { ...DEFAULT_ASSOCIATION },
    fotografia: '',
  });
  const [siteIsDemo, setSiteIsDemo] = useState(false);
  const [siteSaveNotice, setSiteSaveNotice] = useState<string | null>(null);
  const [siteAnalyzing, setSiteAnalyzing] = useState(false);
  const [siteAnalysis, setSiteAnalysis] = useState<AIAnalysisResult | null>(null);

  const handleLoadSiteDemo = () => {
    const demo = INITIAL_DEMO_SITES[0];
    setSiteForm({
      nombreSitio: demo.nombreSitio,
      pais: demo.pais,
      region: demo.region,
      provincia: demo.provincia,
      distrito: demo.distrito,
      coordenadas: demo.coordenadas,
      altitud: demo.altitud,
      periodo: demo.periodo,
      cronologia: demo.cronologia,
      descripcion: demo.descripcion,
      contexto: demo.contexto,
      observaciones: demo.observaciones,
      evidenciasAsociadas: demo.evidenciasAsociadas,
      asociadoA: demo.asociadoA,
      fotografia: demo.fotografia,
    });
    setSiteIsDemo(true);
    setSiteAnalysis(demo.analisisIA || null);
  };

  const parseLatLng = (coordStr: string): { lat: number | null; lng: number | null } => {
    const matches = coordStr.match(/-?\d+(\.\d+)?/g);
    if (matches && matches.length >= 2) {
      const lat = parseFloat(matches[0]);
      const lng = parseFloat(matches[1]);
      if (!isNaN(lat) && !isNaN(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
        return { lat, lng };
      }
    }
    return { lat: null, lng: null };
  };

  const handleSaveSiteRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const { lat, lng } = parseLatLng(siteForm.coordenadas);
    const newSite: SiteRecord = {
      id: `site-${Date.now()}`,
      isDemo: siteIsDemo || siteForm.nombreSitio.includes('DEMOSTRACIÓN'),
      createdAt: new Date().toISOString().split('T')[0],
      ...siteForm,
      latitud: lat,
      longitud: lng,
      analisisIA: siteAnalysis || undefined,
    };
    setSites((prev) => [newSite, ...prev]);
    setSiteSaveNotice(`Registro de sitio "${newSite.nombreSitio || 'Sin nombre'}" guardado correctamente.`);
    setTimeout(() => setSiteSaveNotice(null), 4000);
  };

  const handleAnalyzeSiteRecord = async () => {
    setSiteAnalyzing(true);
    setSiteSaveNotice(null);
    try {
      const { fotografia, ...cleanSite } = siteForm;
      const response = await fetch('/api/archaeology/analyze-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordType: 'Sitio Arqueológico',
          recordData: cleanSite,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al analizar el sitio.');
      setSiteAnalysis(data.result);
    } catch (err: any) {
      setSiteSaveNotice(`Error: ${err.message}`);
    } finally {
      setSiteAnalyzing(false);
    }
  };

  // ============================================================================
  // MODULE 3: BÚSQUEDA DE SITIOS STATE
  // ============================================================================
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCountry, setSearchCountry] = useState('');
  const [isSearchingSite, setIsSearchingSite] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [searchGroundingLinks, setSearchGroundingLinks] = useState<
    Array<{ title: string; uri: string }>
  >([]);

  const handleSearchSite = async (e?: React.FormEvent, presetName?: string) => {
    if (e) e.preventDefault();
    const queryToRun = presetName ?? searchQuery;
    if (!queryToRun.trim()) return;
    if (presetName) setSearchQuery(presetName);

    setIsSearchingSite(true);
    setSearchError(null);
    try {
      const response = await fetch('/api/archaeology/search-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteName: queryToRun.trim(),
          countryHint: searchCountry.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error en la búsqueda documental.');
      }
      setSearchResult(data.result);
      setSearchGroundingLinks(data.groundingLinks || []);
    } catch (err: any) {
      setSearchError(err.message || 'No se pudo completar la búsqueda.');
    } finally {
      setIsSearchingSite(false);
    }
  };

  // ============================================================================
  // MODULE 4: COORDENADAS Y UBICACIÓN STATE
  // ============================================================================
  const [coordLatInput, setCoordLatInput] = useState<string>('-13.6528');
  const [coordLngInput, setCoordLngInput] = useState<string>('-73.9542');
  const [coordAltInput, setCoordAltInput] = useState<string>('3470 m s.n.m.');
  const [coordRefName, setCoordRefName] = useState<string>(
    'Punto de Control Sector Kancha-Pampa (Demostración)'
  );
  const [coordNotes, setCoordNotes] = useState<string>(
    'Terraza alta sobre confluencia de quebradas con visibilidad hacia el valle.'
  );
  const [isAnalyzingCoords, setIsAnalyzingCoords] = useState(false);
  const [coordAnalysisResult, setCoordAnalysisResult] = useState<any | null>(null);
  const [coordGroundingLinks, setCoordGroundingLinks] = useState<
    Array<{ title: string; uri: string }>
  >([]);
  const [coordError, setCoordError] = useState<string | null>(null);

  const handleAnalyzeCoordinates = async (e: React.FormEvent) => {
    e.preventDefault();
    const latNum = parseFloat(coordLatInput);
    const lngNum = parseFloat(coordLngInput);
    if (isNaN(latNum) || isNaN(lngNum)) {
      setCoordError('Por favor ingrese valores numéricos válidos para Latitud y Longitud.');
      return;
    }
    setIsAnalyzingCoords(true);
    setCoordError(null);
    try {
      const response = await fetch('/api/archaeology/analyze-coordinates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: latNum,
          longitude: lngNum,
          altitude: coordAltInput,
          referenceName: coordRefName,
          landscapeNotes: coordNotes,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al analizar coordenadas.');
      setCoordAnalysisResult(data.result);
      setCoordGroundingLinks(data.groundingLinks || []);
    } catch (err: any) {
      setCoordError(err.message || 'Error al procesar las coordenadas.');
    } finally {
      setIsAnalyzingCoords(false);
    }
  };

  // ============================================================================
  // MODULE 5: ANÁLISIS FOTOGRÁFICO STATE
  // ============================================================================
  const [photoBase64, setPhotoBase64] = useState<string>(DEMO_IMAGES.ceramicAryballos);
  const [photoMimeType, setPhotoMimeType] = useState<string>('image/jpeg');
  const [photoCategory, setPhotoCategory] = useState<PhotoMaterialCategory>('Cerámica');
  const [photoContextNotes, setPhotoContextNotes] = useState<string>(
    'Fragmento diagnóstico con engobe rojo y pintura geométrica sobre superficie limpia [DATOS DE DEMOSTRACIÓN].'
  );
  const [photoAssociation, setPhotoAssociation] = useState<AssociationField>({
    items: ['cerámica', 'arquitectura'],
    tipoRelacion: 'Documentada en contexto estratigráfico',
    detalleAsociacion: 'Muestra fotográfica de referencia en catálogo.',
  });
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [photoAnalysisResult, setPhotoAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const handleAnalyzePhotograph = async () => {
    if (!photoBase64) {
      setPhotoError('Por favor suba o seleccione una fotografía antes de iniciar el análisis.');
      return;
    }
    setIsAnalyzingPhoto(true);
    setPhotoError(null);
    try {
      // Ensure if photoBase64 is a local asset path (e.g., /src/assets/...), we convert it to base64 first
      let base64ToSend = photoBase64;
      let mimeToSend = photoMimeType;
      if (!photoBase64.startsWith('data:image')) {
        const fetched = await fetch(photoBase64);
        const blob = await fetched.blob();
        mimeToSend = blob.type || 'image/jpeg';
        base64ToSend = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

      const response = await fetch('/api/archaeology/analyze-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64ToSend,
          mimeType: mimeToSend,
          materialType: photoCategory,
          contextNotes: photoContextNotes,
          associatedTo: `${photoAssociation.items.join(', ')} (${photoAssociation.tipoRelacion})`,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error en el análisis fotográfico.');
      setPhotoAnalysisResult(data.result);
    } catch (err: any) {
      setPhotoError(err.message || 'No se pudo analizar la fotografía.');
    } finally {
      setIsAnalyzingPhoto(false);
    }
  };

  // ============================================================================
  // REPORT GENERATOR BUILDER (MODULE 12)
  // ============================================================================
  const createAndOpenReport = (newReport: ArchaeologicalReport) => {
    setReports((prev) => [newReport, ...prev.filter((r) => r.id !== newReport.id)]);
    setActiveReport(newReport);
    setActiveModule('informe');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const buildReportFromFicha = (ficha: AnyFichaRecord) => {
    const ai = ficha.analisisIA;
    const report: ArchaeologicalReport = {
      id: `REP-${ficha.codigo || Date.now()}`,
      titulo: `Informe de Ficha Arqueológica: ${ficha.tipoFicha} (${ficha.codigo})`,
      subtituloModulo: `Módulo 06 · Fichas Arqueológicas Especializadas (${ficha.tipoFicha})`,
      fechaGeneracion: new Date().toLocaleDateString('es-PE'),
      isDemo: Boolean(ficha.isDemo),
      identificacion: {
        Código: ficha.codigo,
        'Categoría Material': ficha.tipoFicha,
        'Sitio Arqueológico': ficha.sitio || 'Información insuficiente para establecer esta afirmación.',
        Contexto: ficha.contexto || 'Información insuficiente para establecer esta afirmación.',
        Conservación: ficha.conservacion || 'No especificada',
        ...(ficha.tipoFicha === 'Restos óseos'
          ? {
              'Identificación Preliminar (Taxón)':
                ficha.identificacionPreliminarEspecie ||
                'Identificación preliminar pendiente de evaluación especializada',
            }
          : {}),
      },
      datosObservables: ai?.datosObservables?.length
        ? ai.datosObservables
        : [
            `Registro directo de ${ficha.tipoFicha} con código ${ficha.codigo}.`,
            `Estado de conservación reportado: ${ficha.conservacion || 'No especificado'}.`,
          ],
      informacionDocumentada: ai?.informacionDocumentada?.length
        ? ai.informacionDocumentada
        : ['Sujeto a contrastación con catálogos regionales verificados.'],
      analisis:
        ai?.analisisTecnico ||
        'Ficha registrada en catálogo. Ejecute el botón "Analizar Ficha con IA" para incorporar inferencias técnicas automatizadas.',
      interpretacion: ai?.interpretacion?.length
        ? ai.interpretacion
        : ['Información insuficiente para establecer esta afirmación sin análisis completo.'],
      hipotesis: ai?.hipotesis?.length
        ? ai.hipotesis
        : [
            'posibleFuncion' in ficha && ficha.posibleFuncion
              ? `Hipótesis funcional registrada: ${ficha.posibleFuncion}`
              : 'Sin hipótesis funcional formulada.',
          ],
      informacionInsuficiente: ai?.informacionInsuficiente?.length
        ? ai.informacionInsuficiente
        : ['Requiere verificación arqueométrica y contextual en laboratorio.'],
      asociacion: ficha.asociadoA,
      preguntasEvidencia: ai?.preguntasEvidencia || {
        evidenciaSostener:
          '¿Qué atributos diagnósticos registrados en la ficha permiten sostener la adscripción funcional o estilística?',
        informacionFalta:
          '¿Qué mediciones morfométricas, estratigráficas o arqueométricas faltan completar?',
        otrosMateriales:
          '¿Qué otros restos materiales asociados en la misma unidad estratigráfica deben contrastarse?',
        relacionEspacial:
          '¿Cuál es la distribución tridimensional del hallazgo respecto a estructuras o rasgos?',
        asociacionEstado: `Estado registrado: ${ficha.asociadoA.tipoRelacion}.`,
        analisisEspecializado:
          'Análisis arqueométrico, traceológico, osteológico comparativo o datación radiométrica según corresponda.',
      },
      referencias: ai?.referenciasAPA || [],
      fotografia: ficha.fotografia || undefined,
    };
    createAndOpenReport(report);
  };

  // Navigation items
  const NAV_ITEMS: Array<{
    id: ModuleId;
    label: string;
    shortLabel: string;
    num: string;
    icon: React.FC<{ className?: string }>;
  }> = [
    { id: 'inicio', label: 'Inicio y Presentación', shortLabel: 'Inicio', num: '01', icon: Home },
    { id: 'registro-sitio', label: 'Registro de Sitio Arqueológico', shortLabel: 'Registro Sitio', num: '02', icon: MapPin },
    { id: 'busqueda-sitios', label: 'Búsqueda de Sitios', shortLabel: 'Búsqueda', num: '03', icon: Search },
    { id: 'coordenadas', label: 'Coordenadas y Ubicación', shortLabel: 'Coordenadas', num: '04', icon: Compass },
    { id: 'analisis-foto', label: 'Análisis Fotográfico', shortLabel: 'Fotografía', num: '05', icon: Camera },
    { id: 'fichas', label: 'Fichas Arqueológicas', shortLabel: 'Fichas', num: '06', icon: FileSpreadsheet },
    { id: 'geografia-sagrada', label: 'Geografía Sagrada', shortLabel: 'Geografía Sagrada', num: '08', icon: Mountain },
    { id: 'estrategias-inca', label: 'Estrategias de Dominación Inca', shortLabel: 'Horizonte Tardío', num: '09', icon: Landmark },
    { id: 'informe', label: 'Informe y Exportación', shortLabel: 'Informe', num: '12', icon: FileText },
    { id: 'demostracion', label: 'Datos de Demostración', shortLabel: 'Demostración', num: '13', icon: Database },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE] text-[#1C1917]">
      {/* =====================================================================
          TOP BAR CONTRACT: 3 Zones (1. Wordmark | 2. 5 Nav Links | 3. Primary Action)
         ===================================================================== */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-[#1C1917] text-[#FBF9F5] border-b border-[#44403C] no-print">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#inicio"
          onClick={(e) => {
            e.preventDefault();
            setActiveModule('inicio');
          }}
          className="text-xl font-display font-bold tracking-wide text-[#FBF9F5] whitespace-nowrap"
        >
          ArqueoIA 3.0
        </a>

        {/* Zone 2: 5 Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-[#D6CEBE]">
          <button
            type="button"
            onClick={() => setActiveModule('inicio')}
            className={`hover:text-[#FBF9F5] py-1 transition-colors whitespace-nowrap ${
              activeModule === 'inicio' ? 'text-[#FBF9F5] underline underline-offset-4' : ''
            }`}
          >
            Inicio
          </button>
          <button
            type="button"
            onClick={() => setActiveModule('registro-sitio')}
            className={`hover:text-[#FBF9F5] py-1 transition-colors whitespace-nowrap ${
              activeModule === 'registro-sitio' ? 'text-[#FBF9F5] underline underline-offset-4' : ''
            }`}
          >
            Registro de Sitio
          </button>
          <button
            type="button"
            onClick={() => setActiveModule('busqueda-sitios')}
            className={`hover:text-[#FBF9F5] py-1 transition-colors whitespace-nowrap ${
              activeModule === 'busqueda-sitios' ? 'text-[#FBF9F5] underline underline-offset-4' : ''
            }`}
          >
            Búsqueda Documental
          </button>
          <button
            type="button"
            onClick={() => setActiveModule('analisis-foto')}
            className={`hover:text-[#FBF9F5] py-1 transition-colors whitespace-nowrap ${
              activeModule === 'analisis-foto' ? 'text-[#FBF9F5] underline underline-offset-4' : ''
            }`}
          >
            Análisis Fotográfico
          </button>
          <button
            type="button"
            onClick={() => setActiveModule('fichas')}
            className={`hover:text-[#FBF9F5] py-1 transition-colors whitespace-nowrap ${
              activeModule === 'fichas' ? 'text-[#FBF9F5] underline underline-offset-4' : ''
            }`}
          >
            Fichas Arqueológicas
          </button>
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveModule('informe')}
            className="px-3.5 py-1.5 text-xs font-semibold bg-[#9A3412] text-[#FBF9F5] rounded hover:bg-[#78350F] transition-colors whitespace-nowrap"
          >
            Ver Informe ({reports.length})
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-[#D6CEBE] hover:text-[#FBF9F5]"
            aria-label="Abrir menú de módulos"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#292524] text-[#FBF9F5] border-b border-[#44403C] px-4 py-3 space-y-1 no-print">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveModule(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-medium rounded flex items-center justify-between ${
                activeModule === item.id
                  ? 'bg-[#78350F] text-[#FBF9F5]'
                  : 'text-[#D6CEBE] hover:bg-[#44403C]/50'
              }`}
            >
              <span>
                {item.num}. {item.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main Workspace Container (Sidebar + Main Viewport) */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1440px] w-full mx-auto">
        {/* Left Sidebar Navigation (Desktop) */}
        <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-[#D6CEBE] bg-[#EBE6DF]/70 p-5 justify-between no-print">
          <div className="space-y-6">
            <div>
              <div className="text-xs font-semibold text-[#78350F] mb-1">
                Módulos Metodológicos
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Asistente inteligente para el análisis arqueológico
              </p>
            </div>

            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const IconComp = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveModule(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium rounded text-left transition-colors ${
                      isActive
                        ? 'bg-[#78350F] text-[#FBF9F5] font-semibold'
                        : 'text-[#292524] hover:bg-[#D6CEBE]/60'
                    }`}
                  >
                    <IconComp className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      {item.num}. {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Anti-Hallucination & Epistemological Protocol Box */}
          <div className="mt-8 p-3.5 bg-[#FBF9F5] border border-[#D6CEBE] rounded text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-[#1C1917]">
              <ShieldCheck className="w-4 h-4 text-[#14532D] shrink-0" />
              <span>Seguridad Anti-Alucinación</span>
            </div>
            <p className="text-[11px] text-[#57534E] leading-relaxed">
              ArqueoIA 3.0 no inventa coordenadas, cronologías, autores, funciones ni especies. Separa estrictamente evidencia observada, interpretación e hipótesis.
            </p>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
          {/* =================================================================
              1. MÓDULO INICIO
             ================================================================= */}
          {activeModule === 'inicio' && (
            <div className="space-y-10">
              {/* Hero Banner */}
              <section className="relative rounded overflow-hidden border border-[#D6CEBE] bg-[#1C1917] text-[#FBF9F5]">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-7 p-8 md:p-10 flex flex-col justify-center space-y-5">
                    <div className="text-xs text-[#D6CEBE] tracking-wide">
                      Plataforma Científica de Registro y Análisis · Versión 3.0
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-[#FBF9F5] leading-tight">
                      ArqueoIA 3.0
                    </h1>
                    <p className="text-lg font-display italic text-[#E7E0D6]">
                      Asistente inteligente para el análisis arqueológico
                    </p>
                    <p className="text-sm text-[#D6CEBE] leading-relaxed max-w-2xl">
                      Diseñado para estudiantes, investigadores y profesionales de la arqueología. Facilita la sistematización de sitios, el análisis fotográfico, la catalogación de fichas técnicas, el estudio de la geografía cultural y la evaluación de estrategias territoriales del Horizonte Tardío bajo estrictos estándares epistemológicos.
                    </p>

                    {/* Mandatory Epistemological Notice */}
                    <div className="p-4 bg-[#292524] border-l-4 border-[#B45309] text-xs text-[#E7E0D6] leading-relaxed">
                      <strong className="text-[#FBF9F5] block mb-0.5">
                        Principio Metodológico Fundamental:
                      </strong>
                      ArqueoIA 3.0 es una <strong>herramienta de apoyo técnico y metodológico</strong> y <strong>no reemplaza el criterio científico, la excavación estratigráfica ni la evaluación presencial del arqueólogo</strong>. Ninguna hipótesis generada debe asumirse como un hecho verificado.
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveModule('registro-sitio')}
                        className="px-5 py-2.5 text-xs font-semibold bg-[#9A3412] text-[#FBF9F5] rounded hover:bg-[#78350F] transition-colors whitespace-nowrap"
                      >
                        Registrar Sitio Arqueológico
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveModule('fichas')}
                        className="px-5 py-2.5 text-xs font-semibold bg-[#FBF9F5] text-[#1C1917] rounded hover:bg-[#EBE6DF] transition-colors whitespace-nowrap"
                      >
                        Abrir Fichas de Materiales
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveModule('analisis-foto')}
                        className="px-4 py-2.5 text-xs font-medium border border-[#78716C] text-[#E7E0D6] rounded hover:bg-[#292524] transition-colors whitespace-nowrap"
                      >
                        Análisis Fotográfico
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 relative min-h-[280px] bg-[#292524]">
                    <img
                      src={DEMO_IMAGES.heroExcavation}
                      alt="Excavación arqueológica en mampostería prehispánica y perfil estratigráfico"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#1C1917] lg:via-transparent lg:to-transparent" />
                    <div className="absolute bottom-3 right-4 text-[11px] text-[#E7E0D6] bg-[#1C1917]/80 px-2.5 py-1 rounded">
                      Registro estratigráfico y arquitectura en piedra
                    </div>
                  </div>
                </div>
              </section>

              {/* Module Cards Grid */}
              <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#D6CEBE] pb-3">
                  <h2 className="text-2xl font-display font-semibold text-[#1C1917]">
                    Módulos de Trabajo Arqueológico
                  </h2>
                  <span className="text-xs text-[#57534E]">
                    Seleccione un módulo para iniciar el registro, consulta o análisis
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-5 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-[#78350F] font-semibold mb-1">
                        02 · Trabajo de Campo
                      </div>
                      <h3 className="text-lg font-display font-semibold text-[#1C1917]">
                        Registro de Sitio Arqueológico
                      </h3>
                      <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                        Formulario normalizado con ubicación política, coordenadas, altitud, cronología, contexto, evidencias, fotografía y asociaciones.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModule('registro-sitio')}
                      className="mt-4 w-full py-2 px-3 text-xs font-semibold bg-[#EBE6DF] hover:bg-[#78350F] hover:text-[#FBF9F5] text-[#1C1917] rounded transition-colors"
                    >
                      Abrir Registro de Sitio →
                    </button>
                  </div>

                  <div className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-5 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-[#78350F] font-semibold mb-1">
                        03 · Consulta Verificada
                      </div>
                      <h3 className="text-lg font-display font-semibold text-[#1C1917]">
                        Búsqueda de Sitios Arqueológicos
                      </h3>
                      <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                        Consulta documental con ubicación, coordenadas, cronología, estructuras y materiales asociados. Sin invención de datos.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModule('busqueda-sitios')}
                      className="mt-4 w-full py-2 px-3 text-xs font-semibold bg-[#EBE6DF] hover:bg-[#78350F] hover:text-[#FBF9F5] text-[#1C1917] rounded transition-colors"
                    >
                      Buscar Sitios Documentados →
                    </button>
                  </div>

                  <div className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-5 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-[#78350F] font-semibold mb-1">
                        04 · Cartografía y Paisaje
                      </div>
                      <h3 className="text-lg font-display font-semibold text-[#1C1917]">
                        Coordenadas y Ubicación
                      </h3>
                      <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                        Ingreso manual de latitud, longitud y altitud con mapa topográfico/satelital interactivo y análisis de emplazamiento.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModule('coordenadas')}
                      className="mt-4 w-full py-2 px-3 text-xs font-semibold bg-[#EBE6DF] hover:bg-[#78350F] hover:text-[#FBF9F5] text-[#1C1917] rounded transition-colors"
                    >
                      Abrir Mapa y Coordenadas →
                    </button>
                  </div>

                  <div className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-5 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-[#78350F] font-semibold mb-1">
                        05 · Inspección Visual
                      </div>
                      <h3 className="text-lg font-display font-semibold text-[#1C1917]">
                        Análisis Fotográfico
                      </h3>
                      <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                        Inspección de cerámica, textil, lítico, óseo, arquitectura o metal separando Datos Observables, Interpretación e Hipótesis.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModule('analisis-foto')}
                      className="mt-4 w-full py-2 px-3 text-xs font-semibold bg-[#EBE6DF] hover:bg-[#78350F] hover:text-[#FBF9F5] text-[#1C1917] rounded transition-colors"
                    >
                      Analizar Fotografía →
                    </button>
                  </div>

                  <div className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-5 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-[#78350F] font-semibold mb-1">
                        06 y 07 · Gabinete y Asociaciones
                      </div>
                      <h3 className="text-lg font-display font-semibold text-[#1C1917]">
                        Fichas Arqueológicas (5 Categorías)
                      </h3>
                      <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                        Formularios técnicos para Cerámica, Textil, Lítico, Restos Óseos (identificación preliminar) y Arquitectura con campo "¿A qué está asociado?".
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModule('fichas')}
                      className="mt-4 w-full py-2 px-3 text-xs font-semibold bg-[#EBE6DF] hover:bg-[#78350F] hover:text-[#FBF9F5] text-[#1C1917] rounded transition-colors"
                    >
                      Abrir Fichas Arqueológicas →
                    </button>
                  </div>

                  <div className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-5 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-[#78350F] font-semibold mb-1">
                        08 y 09 · Paisaje y Horizonte Tardío
                      </div>
                      <h3 className="text-lg font-display font-semibold text-[#1C1917]">
                        Geografía Sagrada y Estrategias Inca
                      </h3>
                      <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                        Análisis prudente de apus, huacas y fuentes de agua, junto al estudio de vialidad, qullqas y control territorial en el Horizonte Tardío.
                      </p>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveModule('geografia-sagrada')}
                        className="py-2 px-2 text-xs font-semibold bg-[#EBE6DF] hover:bg-[#78350F] hover:text-[#FBF9F5] text-[#1C1917] rounded transition-colors truncate"
                      >
                        Geografía Sagrada
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveModule('estrategias-inca')}
                        className="py-2 px-2 text-xs font-semibold bg-[#EBE6DF] hover:bg-[#78350F] hover:text-[#FBF9F5] text-[#1C1917] rounded transition-colors truncate"
                      >
                        Estrategias Inca
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Anti-Hallucination & Report Summary Bar */}
              <section className="border border-[#D6CEBE] bg-[#F3EFE6] rounded p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-2">
                  <div className="text-xs font-semibold text-[#14532D]">
                    14 · Seguridad contra Alucinaciones y Rigor Científico
                  </div>
                  <h3 className="text-xl font-display font-semibold text-[#1C1917]">
                    Compromiso de Integridad Epistemológica
                  </h3>
                  <p className="text-xs text-[#44403C] leading-relaxed">
                    ArqueoIA 3.0 aplica restricciones estrictas: nunca inventa coordenadas, cronologías, autores, publicaciones, páginas, enlaces, nombres de sitios, funciones de estructuras, identificaciones de especies ni asociaciones culturales. Cuando la evidencia es insuficiente, declara explícitamente:{' '}
                    <strong className="text-[#1C1917]">
                      "Información insuficiente para establecer esta afirmación."
                    </strong>
                  </p>
                </div>
                <div className="flex flex-col justify-center items-start lg:items-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModule('demostracion')}
                    className="px-4 py-2 text-xs font-semibold bg-[#1C1917] text-[#FBF9F5] rounded hover:bg-[#292524] transition-colors whitespace-nowrap"
                  >
                    Explorar Datos de Demostración →
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModule('informe')}
                    className="px-4 py-2 text-xs font-semibold border border-[#78350F] text-[#78350F] rounded hover:bg-[#78350F] hover:text-[#FBF9F5] transition-colors whitespace-nowrap"
                  >
                    Abrir Generador de Informes APA 7 →
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* =================================================================
              2. MÓDULO REGISTRO DE SITIO ARQUEOLÓGICO
             ================================================================= */}
          {activeModule === 'registro-sitio' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D6CEBE] pb-5">
                <div>
                  <div className="text-xs text-[#78350F] font-medium mb-1">
                    Módulo 02 · Prospección y Registro de Asentamientos
                  </div>
                  <h2 className="text-3xl font-display font-semibold text-[#1C1917]">
                    Registro de Sitio Arqueológico
                  </h2>
                  <p className="text-sm text-[#57534E] mt-1 max-w-2xl">
                    Documente la ubicación, coordenadas, altitud, secuencia cronológica, contexto y asociaciones materiales del sitio.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLoadSiteDemo}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#EBE6DF] hover:bg-[#D6CEBE] text-[#292524] rounded transition-colors whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#78350F]" />
                  Cargar sitio de demostración
                </button>
              </div>

              <form
                onSubmit={handleSaveSiteRecord}
                className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-6 space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      Nombre del sitio *
                    </label>
                    <input
                      type="text"
                      required
                      value={siteForm.nombreSitio}
                      onChange={(e) => setSiteForm({ ...siteForm, nombreSitio: e.target.value })}
                      placeholder="Ej. Sector Kancha-Pampa"
                      className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      País
                    </label>
                    <input
                      type="text"
                      value={siteForm.pais}
                      onChange={(e) => setSiteForm({ ...siteForm, pais: e.target.value })}
                      placeholder="Ej. Perú, Bolivia, Ecuador, Chile..."
                      className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      Región / Departamento
                    </label>
                    <input
                      type="text"
                      value={siteForm.region}
                      onChange={(e) => setSiteForm({ ...siteForm, region: e.target.value })}
                      placeholder="Ej. Ayacucho, Cusco, Ancash..."
                      className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      Provincia
                    </label>
                    <input
                      type="text"
                      value={siteForm.provincia}
                      onChange={(e) => setSiteForm({ ...siteForm, provincia: e.target.value })}
                      placeholder="Provincia"
                      className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      Distrito / Localidad
                    </label>
                    <input
                      type="text"
                      value={siteForm.distrito}
                      onChange={(e) => setSiteForm({ ...siteForm, distrito: e.target.value })}
                      placeholder="Distrito o comunidad"
                      className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      Coordenadas (No inventar; usar GPS de campo)
                    </label>
                    <input
                      type="text"
                      value={siteForm.coordenadas}
                      onChange={(e) => setSiteForm({ ...siteForm, coordenadas: e.target.value })}
                      placeholder="Ej. -13.6528, -73.9542 o UTM"
                      className="w-full px-3 py-2 text-sm font-mono-tabular bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      Altitud (m s.n.m.)
                    </label>
                    <input
                      type="text"
                      value={siteForm.altitud}
                      onChange={(e) => setSiteForm({ ...siteForm, altitud: e.target.value })}
                      placeholder="Ej. 3470 m s.n.m."
                      className="w-full px-3 py-2 text-sm font-mono-tabular bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      Periodo Cultural
                    </label>
                    <input
                      type="text"
                      value={siteForm.periodo}
                      onChange={(e) => setSiteForm({ ...siteForm, periodo: e.target.value })}
                      placeholder="Ej. Formativo, Horizonte Medio, Horizonte Tardío..."
                      className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      Cronología (Relativa o Absoluta)
                    </label>
                    <input
                      type="text"
                      value={siteForm.cronologia}
                      onChange={(e) => setSiteForm({ ...siteForm, cronologia: e.target.value })}
                      placeholder="Indicar si es estimación tipológica o datación C14"
                      className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      Descripción del sitio
                    </label>
                    <textarea
                      rows={3}
                      value={siteForm.descripcion}
                      onChange={(e) => setSiteForm({ ...siteForm, descripcion: e.target.value })}
                      placeholder="Componentes arquitectónicos, extensión, emplazamiento geomorfológico..."
                      className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      Contexto Arqueológico
                    </label>
                    <textarea
                      rows={3}
                      value={siteForm.contexto}
                      onChange={(e) => setSiteForm({ ...siteForm, contexto: e.target.value })}
                      placeholder="Prospección superficial, corte de prueba, trinchera, estado estratigráfico..."
                      className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      Evidencias asociadas
                    </label>
                    <textarea
                      rows={2}
                      value={siteForm.evidenciasAsociadas}
                      onChange={(e) =>
                        setSiteForm({ ...siteForm, evidenciasAsociadas: e.target.value })
                      }
                      placeholder="Fragmentería cerámica, artefactos líticos, estructuras, canales..."
                      className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      Observaciones (Conservación y factores de afectación)
                    </label>
                    <textarea
                      rows={2}
                      value={siteForm.observaciones}
                      onChange={(e) => setSiteForm({ ...siteForm, observaciones: e.target.value })}
                      placeholder="Erosión, huaqueo, reutilización moderna, limitaciones de visibilidad..."
                      className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
                    />
                  </div>
                </div>

                <AssociationSelector
                  value={siteForm.asociadoA}
                  onChange={(asociadoA) => setSiteForm({ ...siteForm, asociadoA })}
                />

                <PhotoUploader
                  value={siteForm.fotografia}
                  onChange={(fotografia) => setSiteForm({ ...siteForm, fotografia })}
                  label="Fotografía general del sitio arqueológico"
                />

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#D6CEBE]">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#1C1917] text-[#FBF9F5] rounded hover:bg-[#292524] transition-colors whitespace-nowrap"
                    >
                      <Save className="w-4 h-4" />
                      Guardar registro
                    </button>
                    <button
                      type="button"
                      disabled={siteAnalyzing}
                      onClick={handleAnalyzeSiteRecord}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#78350F] text-[#FBF9F5] rounded hover:bg-[#5C280B] disabled:opacity-50 transition-colors whitespace-nowrap"
                    >
                      <Sparkles className="w-4 h-4" />
                      {siteAnalyzing
                        ? 'Analizando registro de sitio...'
                        : 'Analizar Sitio con IA + Preguntas a la Evidencia'}
                    </button>
                  </div>
                  {siteSaveNotice && (
                    <span className="text-xs font-medium text-[#14532D]">
                      {siteSaveNotice}
                    </span>
                  )}
                </div>
              </form>

              {siteAnalysis && (
                <AnalysisResultView
                  analysis={siteAnalysis}
                  title={`Evaluación Metodológica: ${siteForm.nombreSitio || 'Sitio Registrado'}`}
                  isDemo={siteIsDemo}
                  onGenerateReport={() => {
                    const rep: ArchaeologicalReport = {
                      id: `REP-SITIO-${Date.now()}`,
                      titulo: `Informe de Sitio Arqueológico: ${siteForm.nombreSitio}`,
                      subtituloModulo: 'Módulo 02 · Registro de Sitio Arqueológico',
                      fechaGeneracion: new Date().toLocaleDateString('es-PE'),
                      isDemo: siteIsDemo,
                      identificacion: {
                        'Nombre del Sitio': siteForm.nombreSitio,
                        Ubicación: `${siteForm.distrito}, ${siteForm.provincia}, ${siteForm.region}, ${siteForm.pais}`,
                        Coordenadas: siteForm.coordenadas || 'Información insuficiente para establecer esta afirmación.',
                        Altitud: siteForm.altitud || 'No especificada',
                        Periodo: siteForm.periodo || 'No especificado',
                        Cronología: siteForm.cronologia || 'Información insuficiente para establecer esta afirmación.',
                      },
                      datosObservables: siteAnalysis.datosObservables,
                      informacionDocumentada: siteAnalysis.informacionDocumentada,
                      analisis: siteAnalysis.analisisTecnico || siteForm.descripcion,
                      interpretacion: siteAnalysis.interpretacion,
                      hipotesis: siteAnalysis.hipotesis,
                      informacionInsuficiente: siteAnalysis.informacionInsuficiente,
                      asociacion: siteForm.asociadoA,
                      preguntasEvidencia: siteAnalysis.preguntasEvidencia,
                      referencias: siteAnalysis.referenciasAPA,
                      fotografia: siteForm.fotografia || undefined,
                    };
                    createAndOpenReport(rep);
                  }}
                />
              )}

              {/* Registered Sites List */}
              <div className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-6">
                <h3 className="text-xl font-display font-semibold text-[#1C1917] mb-4">
                  Sitios Arqueológicos Guardados ({sites.length})
                </h3>
                <div className="space-y-3">
                  {sites.map((s) => (
                    <div
                      key={s.id}
                      className="p-4 bg-[#F3EFE6]/70 border border-[#D6CEBE] rounded flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#57534E]">
                          <span>{s.pais}</span>
                          <span aria-hidden="true">·</span>
                          <span>{s.region}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-tabular">{s.coordenadas}</span>
                          <span aria-hidden="true">·</span>
                          <span className={s.isDemo ? 'text-[#9A3412] font-semibold' : 'text-[#14532D] font-medium'}>
                            {s.isDemo ? 'DATOS DE DEMOSTRACIÓN' : 'Registro Verificado por Usuario'}
                          </span>
                        </div>
                        <h4 className="text-lg font-display font-semibold text-[#1C1917]">
                          {s.nombreSitio}
                        </h4>
                        <p className="text-xs text-[#44403C] max-w-3xl">{s.descripcion}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {s.latitud && s.longitud && (
                          <button
                            type="button"
                            onClick={() => {
                              setCoordLatInput(String(s.latitud));
                              setCoordLngInput(String(s.longitud));
                              setCoordAltInput(s.altitud);
                              setCoordRefName(s.nombreSitio);
                              setActiveModule('coordenadas');
                            }}
                            className="px-3 py-1.5 text-xs font-medium bg-[#EBE6DF] hover:bg-[#D6CEBE] text-[#1C1917] rounded transition-colors whitespace-nowrap"
                          >
                            Ver en Mapa
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setSites((prev) => prev.filter((item) => item.id !== s.id))
                          }
                          className="p-1.5 text-[#9A3412] hover:bg-[#EBE6DF] rounded"
                          title="Eliminar sitio"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              3. MÓDULO BÚSQUEDA DE SITIOS
             ================================================================= */}
          {activeModule === 'busqueda-sitios' && (
            <div className="space-y-8">
              <div className="border-b border-[#D6CEBE] pb-5">
                <div className="text-xs text-[#78350F] font-medium mb-1">
                  Módulo 03 · Consulta Documental con Control Anti-Alucinaciones
                </div>
                <h2 className="text-3xl font-display font-semibold text-[#1C1917]">
                  Búsqueda de Sitios Arqueológicos
                </h2>
                <p className="text-sm text-[#57534E] mt-1 max-w-2xl">
                  Introduzca el nombre de un sitio arqueológico para consultar su ubicación, coordenadas, descripción, cronología, estructuras conocidas, materiales asociados y observaciones. Cuando no exista respaldo documental suficiente, el sistema indicará explícitamente:{' '}
                  <em>"Información insuficiente para establecer esta afirmación."</em>
                </p>
              </div>

              <form
                onSubmit={(e) => handleSearchSite(e)}
                className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-6 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      Nombre del sitio arqueológico
                    </label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ej. Chavín de Huántar, Huánuco Pampa, Caral, Tiwanaku, Pachacamac..."
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      País o región (Opcional)
                    </label>
                    <input
                      type="text"
                      value={searchCountry}
                      onChange={(e) => setSearchCountry(e.target.value)}
                      placeholder="Ej. Perú, Bolivia, México..."
                      className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-[#57534E]">Consultas rápidas verificadas:</span>
                    {['Huánuco Pampa', 'Chavín de Huántar', 'Caral', 'Sacsayhuamán', 'Incahuasi'].map(
                      (sample) => (
                        <button
                          key={sample}
                          type="button"
                          onClick={() => handleSearchSite(undefined, sample)}
                          className="px-2.5 py-1 text-xs bg-[#EBE6DF] hover:bg-[#D6CEBE] text-[#292524] rounded transition-colors whitespace-nowrap"
                        >
                          {sample}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSearchingSite}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#78350F] text-[#FBF9F5] rounded hover:bg-[#5C280B] disabled:opacity-50 transition-colors whitespace-nowrap"
                  >
                    <Search className="w-4 h-4" />
                    {isSearchingSite ? 'Consultando fuentes documentadas...' : 'Buscar Sitio Arqueológico'}
                  </button>
                </div>
              </form>

              {searchError && (
                <div className="p-4 bg-[#FEE2E2] border-l-4 border-[#9A3412] text-xs text-[#9A3412]">
                  {searchError}
                </div>
              )}

              {searchResult && (
                <div className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-6 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D6CEBE] pb-4">
                    <div>
                      <div className="text-xs text-[#78350F] font-semibold">
                        Ficha de Consulta Documental · Verificación Anti-Alucinaciones
                      </div>
                      <h3 className="text-2xl font-display font-bold text-[#1C1917]">
                        {searchResult.nombreSitio || searchQuery}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {typeof searchResult.latitudNumerica === 'number' &&
                        typeof searchResult.longitudNumerica === 'number' && (
                          <button
                            type="button"
                            onClick={() => {
                              setCoordLatInput(String(searchResult.latitudNumerica));
                              setCoordLngInput(String(searchResult.longitudNumerica));
                              setCoordAltInput(searchResult.altitud || '');
                              setCoordRefName(searchResult.nombreSitio || searchQuery);
                              setActiveModule('coordenadas');
                            }}
                            className="px-3.5 py-2 text-xs font-semibold bg-[#EBE6DF] text-[#1C1917] rounded hover:bg-[#D6CEBE] transition-colors whitespace-nowrap"
                          >
                            Ver Coordenadas en Mapa
                          </button>
                        )}
                      <button
                        type="button"
                        onClick={() => {
                          const rep: ArchaeologicalReport = {
                            id: `REP-BUSQ-${Date.now()}`,
                            titulo: `Informe Documental de Sitio: ${searchResult.nombreSitio || searchQuery}`,
                            subtituloModulo: 'Módulo 03 · Búsqueda Documental de Sitios Arqueológicos',
                            fechaGeneracion: new Date().toLocaleDateString('es-PE'),
                            isDemo: false,
                            identificacion: {
                              'Sitio Consultado': searchResult.nombreSitio || searchQuery,
                              Ubicación: searchResult.ubicacion || 'Información insuficiente para establecer esta afirmación.',
                              Coordenadas: searchResult.coordenadas || 'Información insuficiente para establecer esta afirmación.',
                              Altitud: searchResult.altitud || 'Información insuficiente para establecer esta afirmación.',
                              Cronología: searchResult.cronologia || 'Información insuficiente para establecer esta afirmación.',
                            },
                            datosObservables: [
                              `Estructuras conocidas: ${searchResult.estructurasConocidas || 'Información insuficiente para establecer esta afirmación.'}`,
                              `Materiales asociados: ${searchResult.materialesAsociados || 'Información insuficiente para establecer esta afirmación.'}`,
                            ],
                            informacionDocumentada: [
                              searchResult.descripcion || 'Información insuficiente para establecer esta afirmación.',
                            ],
                            analisis: searchResult.observaciones || '',
                            interpretacion: [
                              searchResult.interpretacion || 'Información insuficiente para establecer esta afirmación.',
                            ],
                            hipotesis: [
                              searchResult.hipotesis || 'Información insuficiente para establecer esta afirmación.',
                            ],
                            informacionInsuficiente: [
                              'Cualquier atribución micro-contextual requiere consulta de los informes técnicos de excavación originales.',
                            ],
                            asociacion: {
                              items: ['arquitectura', 'cerámica', 'estructuras'],
                              tipoRelacion: 'Documentada en contexto estratigráfico',
                              detalleAsociacion: searchResult.materialesAsociados || '',
                            },
                            preguntasEvidencia: searchResult.preguntasEvidencia || {
                              evidenciaSostener: '¿Qué informes de excavación respaldan la secuencia ocupacional del sitio?',
                              informacionFalta: '¿Qué sectores del asentamiento carecen aún de excavación extensiva?',
                              otrosMateriales: '¿Qué indicadores bioarqueológicos o arqueométricos han sido reportados?',
                              relacionEspacial: '¿Cómo se articula el sitio con su cuenca y red vial regional?',
                              asociacionEstado: 'Documentado en bibliografía arqueológica.',
                              analisisEspecializado: 'Revisión de informes de campo y fechados radiométricos publicados.',
                            },
                            referencias: searchResult.referenciasAPA || [],
                          };
                          createAndOpenReport(rep);
                        }}
                        className="px-4 py-2 text-xs font-semibold bg-[#78350F] text-[#FBF9F5] rounded hover:bg-[#5C280B] transition-colors whitespace-nowrap"
                      >
                        Generar Informe de Consulta
                      </button>
                    </div>
                  </div>

                  {/* Required 7 Core Fields of Module 3 */}
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="p-4 bg-[#F3EFE6]/70 border border-[#D6CEBE] rounded">
                      <dt className="text-xs font-semibold text-[#78350F] mb-1">
                        01. Ubicación
                      </dt>
                      <dd className="text-[#1C1917] leading-relaxed">
                        {searchResult.ubicacion || 'Información insuficiente para establecer esta afirmación.'}
                      </dd>
                    </div>

                    <div className="p-4 bg-[#F3EFE6]/70 border border-[#D6CEBE] rounded">
                      <dt className="text-xs font-semibold text-[#78350F] mb-1">
                        02. Coordenadas y Altitud
                      </dt>
                      <dd className="text-[#1C1917] font-mono-tabular leading-relaxed">
                        {searchResult.coordenadas || 'Información insuficiente para establecer esta afirmación.'}
                        {searchResult.altitud ? ` · Altitud: ${searchResult.altitud}` : ''}
                      </dd>
                    </div>

                    <div className="p-4 bg-[#F3EFE6]/70 border border-[#D6CEBE] rounded md:col-span-2">
                      <dt className="text-xs font-semibold text-[#78350F] mb-1">
                        03. Descripción
                      </dt>
                      <dd className="text-[#1C1917] leading-relaxed">
                        {searchResult.descripcion || 'Información insuficiente para establecer esta afirmación.'}
                      </dd>
                    </div>

                    <div className="p-4 bg-[#F3EFE6]/70 border border-[#D6CEBE] rounded">
                      <dt className="text-xs font-semibold text-[#78350F] mb-1">
                        04. Cronología
                      </dt>
                      <dd className="text-[#1C1917] leading-relaxed">
                        {searchResult.cronologia || 'Información insuficiente para establecer esta afirmación.'}
                      </dd>
                    </div>

                    <div className="p-4 bg-[#F3EFE6]/70 border border-[#D6CEBE] rounded">
                      <dt className="text-xs font-semibold text-[#78350F] mb-1">
                        05. Estructuras conocidas
                      </dt>
                      <dd className="text-[#1C1917] leading-relaxed">
                        {searchResult.estructurasConocidas || 'Información insuficiente para establecer esta afirmación.'}
                      </dd>
                    </div>

                    <div className="p-4 bg-[#F3EFE6]/70 border border-[#D6CEBE] rounded">
                      <dt className="text-xs font-semibold text-[#78350F] mb-1">
                        06. Materiales asociados
                      </dt>
                      <dd className="text-[#1C1917] leading-relaxed">
                        {searchResult.materialesAsociados || 'Información insuficiente para establecer esta afirmación.'}
                      </dd>
                    </div>

                    <div className="p-4 bg-[#F3EFE6]/70 border border-[#D6CEBE] rounded">
                      <dt className="text-xs font-semibold text-[#78350F] mb-1">
                        07. Observaciones
                      </dt>
                      <dd className="text-[#1C1917] leading-relaxed">
                        {searchResult.observaciones || 'Información insuficiente para establecer esta afirmación.'}
                      </dd>
                    </div>
                  </dl>

                  {/* Preguntas a la Evidencia & Referencias APA 7 */}
                  <AnalysisResultView
                    analysis={{
                      datosObservables: [
                        searchResult.estructurasConocidas || 'Información insuficiente para establecer esta afirmación.',
                        searchResult.materialesAsociados || 'Información insuficiente para establecer esta afirmación.',
                      ],
                      informacionDocumentada: [
                        searchResult.descripcion || 'Información insuficiente para establecer esta afirmación.',
                      ],
                      interpretacion: [
                        searchResult.interpretacion || 'Información insuficiente para establecer esta afirmación.',
                      ],
                      hipotesis: [
                        searchResult.hipotesis || 'Información insuficiente para establecer esta afirmación.',
                      ],
                      informacionInsuficiente: [
                        'Datos micro-estratigráficos requieren revisión de publicaciones primarias de excavación.',
                      ],
                      preguntasEvidencia: searchResult.preguntasEvidencia,
                      referenciasAPA: searchResult.referenciasAPA || [],
                      groundingLinks: searchGroundingLinks,
                    }}
                    title={`Síntesis Crítica y Referencias APA 7: ${searchResult.nombreSitio || searchQuery}`}
                  />
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              4. MÓDULO COORDENADAS Y UBICACIÓN
             ================================================================= */}
          {activeModule === 'coordenadas' && (
            <div className="space-y-8">
              <div className="border-b border-[#D6CEBE] pb-5">
                <div className="text-xs text-[#78350F] font-medium mb-1">
                  Módulo 04 · Georreferenciación y Emplazamiento en el Paisaje
                </div>
                <h2 className="text-3xl font-display font-semibold text-[#1C1917]">
                  Coordenadas y Ubicación Arqueológica
                </h2>
                <p className="text-sm text-[#57534E] mt-1 max-w-2xl">
                  Introduzca coordenadas manualmente o seleccione un punto en el visor cartográfico. ArqueoIA 3.0 nunca inventa coordenadas: analiza estrictamente los valores ingresados y su relación con elementos del paisaje.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <form
                  onSubmit={handleAnalyzeCoordinates}
                  className="lg:col-span-5 border border-[#D6CEBE] bg-[#FBF9F5] rounded p-6 space-y-4"
                >
                  <h3 className="text-lg font-display font-semibold text-[#1C1917] border-b border-[#D6CEBE] pb-2">
                    Ingreso Manual de Coordenadas
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#44403C] mb-1">
                        Latitud (Grados decimales) *
                      </label>
                      <input
                        type="number"
                        step="any"
                        required
                        value={coordLatInput}
                        onChange={(e) => setCoordLatInput(e.target.value)}
                        placeholder="-13.6528"
                        className="w-full px-3 py-2 text-sm font-mono-tabular bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#44403C] mb-1">
                        Longitud (Grados decimales) *
                      </label>
                      <input
                        type="number"
                        step="any"
                        required
                        value={coordLngInput}
                        onChange={(e) => setCoordLngInput(e.target.value)}
                        placeholder="-73.9542"
                        className="w-full px-3 py-2 text-sm font-mono-tabular bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      Altitud (Si está disponible en GPS / altímetro)
                    </label>
                    <input
                      type="text"
                      value={coordAltInput}
                      onChange={(e) => setCoordAltInput(e.target.value)}
                      placeholder="Ej. 3470 m s.n.m. (Dejar vacío si no está disponible)"
                      className="w-full px-3 py-2 text-sm font-mono-tabular bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      Etiqueta o Punto de Control
                    </label>
                    <input
                      type="text"
                      value={coordRefName}
                      onChange={(e) => setCoordRefName(e.target.value)}
                      placeholder="Ej. Vértice A / Unidad 01"
                      className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#44403C] mb-1">
                      Elementos del paisaje observados desde el punto
                    </label>
                    <textarea
                      rows={2}
                      value={coordNotes}
                      onChange={(e) => setCoordNotes(e.target.value)}
                      placeholder="Ríos, quebradas, cerros, terrazas o caminos visibles..."
                      className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAnalyzingCoords}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#78350F] text-[#FBF9F5] rounded hover:bg-[#5C280B] disabled:opacity-50 transition-colors"
                  >
                    <Compass className="w-4 h-4" />
                    {isAnalyzingCoords
                      ? 'Analizando ubicación y paisaje...'
                      : 'Analizar Coordenadas y Relación con el Paisaje'}
                  </button>

                  {coordError && (
                    <div className="text-xs text-[#9A3412] font-medium">{coordError}</div>
                  )}

                  {/* Summary Card of Entered Coordinates */}
                  <div className="p-3.5 bg-[#F3EFE6] border border-[#D6CEBE] rounded text-xs space-y-1">
                    <div className="font-semibold text-[#1C1917]">
                      Resumen de Georreferenciación Activa:
                    </div>
                    <div className="font-mono-tabular text-[#292524]">
                      Latitud: {coordLatInput || 'No ingresada'} · Longitud:{' '}
                      {coordLngInput || 'No ingresada'}
                    </div>
                    <div className="font-mono-tabular text-[#57534E]">
                      Altitud: {coordAltInput || 'No disponible en este registro'}
                    </div>
                  </div>
                </form>

                <div className="lg:col-span-7">
                  <InteractiveMap
                    latitude={parseFloat(coordLatInput)}
                    longitude={parseFloat(coordLngInput)}
                    altitude={coordAltInput}
                    label={coordRefName}
                    sites={sites}
                    onSelectCoordinates={(lat, lng) => {
                      setCoordLatInput(String(lat));
                      setCoordLngInput(String(lng));
                    }}
                  />
                </div>
              </div>

              {coordAnalysisResult && (
                <div className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-6 space-y-6">
                  <h3 className="text-2xl font-display font-semibold text-[#1C1917] border-b border-[#D6CEBE] pb-3">
                    Resultado de Ubicación y Relación con el Paisaje
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-4 bg-[#F3EFE6] border border-[#D6CEBE] rounded">
                      <div className="text-xs font-semibold text-[#78350F] mb-1">
                        Latitud / Longitud / Altitud
                      </div>
                      <div className="font-mono-tabular text-[#1C1917]">
                        Lat: {coordAnalysisResult.latitud} · Lng: {coordAnalysisResult.longitud}
                      </div>
                      <div className="text-xs text-[#44403C] mt-1">
                        Altitud: {coordAnalysisResult.altitud}
                      </div>
                    </div>

                    <div className="p-4 bg-[#F3EFE6] border border-[#D6CEBE] rounded">
                      <div className="text-xs font-semibold text-[#78350F] mb-1">
                        Ubicación Aproximada
                      </div>
                      <div className="text-[#1C1917]">
                        {coordAnalysisResult.ubicacionAproximada}
                      </div>
                    </div>

                    <div className="p-4 bg-[#F3EFE6] border border-[#D6CEBE] rounded">
                      <div className="text-xs font-semibold text-[#78350F] mb-1">
                        Unidad Geomorfológica / Cuenca
                      </div>
                      <div className="text-[#1C1917]">
                        {coordAnalysisResult.unidadGeomorfologica || 'Información insuficiente para establecer esta afirmación.'}
                      </div>
                    </div>

                    <div className="p-4 bg-[#F3EFE6] border border-[#D6CEBE] rounded md:col-span-2">
                      <div className="text-xs font-semibold text-[#78350F] mb-1">
                        Relación con otros elementos del paisaje
                      </div>
                      <div className="text-[#1C1917] leading-relaxed">
                        {coordAnalysisResult.relacionElementosPaisaje}
                      </div>
                    </div>

                    <div className="p-4 bg-[#F3EFE6] border border-[#D6CEBE] rounded">
                      <div className="text-xs font-semibold text-[#78350F] mb-1">
                        Contexto Arqueológico Regional Documentado
                      </div>
                      <div className="text-[#1C1917] leading-relaxed">
                        {coordAnalysisResult.contextoArqueologicoRegional}
                      </div>
                    </div>
                  </div>

                  {coordAnalysisResult.preguntasEvidencia && (
                    <AnalysisResultView
                      analysis={{
                        datosObservables: [
                          `Coordenadas analizadas: Latitud ${coordAnalysisResult.latitud}, Longitud ${coordAnalysisResult.longitud}`,
                          `Altitud: ${coordAnalysisResult.altitud}`,
                        ],
                        informacionDocumentada: [
                          coordAnalysisResult.ubicacionAproximada,
                          coordAnalysisResult.contextoArqueologicoRegional,
                        ],
                        interpretacion: [coordAnalysisResult.relacionElementosPaisaje],
                        hipotesis: [
                          'Las relaciones de intervisibilidad y articulación vial propuestas deben verificarse en terreno.',
                        ],
                        informacionInsuficiente: [
                          coordAnalysisResult.informacionInsuficiente ||
                            'Requiere verificación presencial mediante prospección arqueológica pedestre.',
                        ],
                        preguntasEvidencia: coordAnalysisResult.preguntasEvidencia,
                        referenciasAPA: coordAnalysisResult.referenciasAPA || [],
                        groundingLinks: coordGroundingLinks,
                      }}
                      title={`Evaluación Espacial del Punto (${coordAnalysisResult.latitud}, ${coordAnalysisResult.longitud})`}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              5. MÓDULO ANÁLISIS FOTOGRÁFICO
             ================================================================= */}
          {activeModule === 'analisis-foto' && (
            <div className="space-y-8">
              <div className="border-b border-[#D6CEBE] pb-5">
                <div className="text-xs text-[#78350F] font-medium mb-1">
                  Módulo 05 · Inspección Visual Multimodal Controlada
                </div>
                <h2 className="text-3xl font-display font-semibold text-[#1C1917]">
                  Análisis Fotográfico Arqueológico
                </h2>
                <p className="text-sm text-[#57534E] mt-1 max-w-2xl">
                  Suba una fotografía arqueológica y seleccione la categoría material. ArqueoIA 3.0 analizará <strong>solamente lo que pueda observar en la fotografía</strong>, separando rigurosamente Datos Observables, Interpretación, Hipótesis, Información Documentada e Información Insuficiente.
                </p>
              </div>

              <div className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-6 space-y-6">
                {/* Category Selector */}
                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-2">
                    01. Seleccione la categoría del material fotografiado
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        'Cerámica',
                        'Textil',
                        'Lítico',
                        'Restos óseos',
                        'Arquitectura',
                        'Metal',
                        'Otro',
                      ] as PhotoMaterialCategory[]
                    ).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setPhotoCategory(cat)}
                        className={`px-4 py-2 text-xs font-semibold rounded border transition-colors whitespace-nowrap ${
                          photoCategory === cat
                            ? 'bg-[#78350F] text-[#FBF9F5] border-[#78350F]'
                            : 'bg-[#FBF9F5] text-[#292524] border-[#D6CEBE] hover:bg-[#EBE6DF]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {photoCategory === 'Restos óseos' && (
                  <div className="p-3.5 bg-[#FEF3C7]/70 border-l-4 border-[#B45309] text-xs text-[#78350F]">
                    <strong>Advertencia para Restos Óseos:</strong> Cualquier identificación taxonómica o anatómica derivada de la imagen se mostrará únicamente como <strong>"Identificación preliminar"</strong> y requiere evaluación especializada en laboratorio.
                  </div>
                )}

                {/* Photo Uploader */}
                <PhotoUploader
                  value={photoBase64}
                  onChange={(dataUrl, mime) => {
                    setPhotoBase64(dataUrl);
                    if (mime) setPhotoMimeType(mime);
                  }}
                  label="02. Fotografía arqueológica a analizar"
                />

                {/* Optional Context Notes */}
                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    03. Notas contextuales del investigador (Opcional)
                  </label>
                  <input
                    type="text"
                    value={photoContextNotes}
                    onChange={(e) => setPhotoContextNotes(e.target.value)}
                    placeholder="Ej. Hallado en superficie del Sector B, escala métrica en cm..."
                    className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
                  />
                </div>

                <AssociationSelector
                  value={photoAssociation}
                  onChange={setPhotoAssociation}
                />

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#D6CEBE]">
                  <button
                    type="button"
                    disabled={isAnalyzingPhoto}
                    onClick={handleAnalyzePhotograph}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold bg-[#78350F] text-[#FBF9F5] rounded hover:bg-[#5C280B] disabled:opacity-50 transition-colors whitespace-nowrap"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isAnalyzingPhoto
                      ? 'Inspeccionando atributos visibles en la fotografía...'
                      : `Analizar Fotografía (${photoCategory}) con Separación Epistemológica`}
                  </button>

                  {photoError && (
                    <span className="text-xs font-medium text-[#9A3412]">{photoError}</span>
                  )}
                </div>
              </div>

              {photoAnalysisResult && (
                <AnalysisResultView
                  analysis={photoAnalysisResult}
                  title={`Análisis Fotográfico: ${photoCategory}`}
                  isDemo={photoContextNotes.includes('DEMOSTRACIÓN')}
                  onGenerateReport={() => {
                    const rep: ArchaeologicalReport = {
                      id: `REP-FOTO-${Date.now()}`,
                      titulo: `Informe de Análisis Fotográfico (${photoCategory})`,
                      subtituloModulo: 'Módulo 05 · Análisis Fotográfico Arqueológico',
                      fechaGeneracion: new Date().toLocaleDateString('es-PE'),
                      isDemo: photoContextNotes.includes('DEMOSTRACIÓN'),
                      identificacion: {
                        'Categoría Material': photoCategory,
                        'Identificación Preliminar':
                          photoAnalysisResult.identificacionPreliminar || 'Ver detalle',
                        'Notas de Contexto': photoContextNotes || 'Ninguna',
                      },
                      datosObservables: photoAnalysisResult.datosObservables,
                      informacionDocumentada: photoAnalysisResult.informacionDocumentada,
                      analisis:
                        photoAnalysisResult.advertenciaMetodologica ||
                        'Análisis visual basado exclusivamente en atributos observables en imagen 2D.',
                      interpretacion: photoAnalysisResult.interpretacion,
                      hipotesis: photoAnalysisResult.hipotesis,
                      informacionInsuficiente: photoAnalysisResult.informacionInsuficiente,
                      asociacion: photoAssociation,
                      preguntasEvidencia: photoAnalysisResult.preguntasEvidencia,
                      referencias: photoAnalysisResult.referenciasAPA,
                      fotografia: photoBase64,
                    };
                    createAndOpenReport(rep);
                  }}
                />
              )}
            </div>
          )}

          {/* =================================================================
              6 & 7. MÓDULO FICHAS ARQUEOLÓGICAS Y "¿A QUÉ ESTÁ ASOCIADO?"
             ================================================================= */}
          {activeModule === 'fichas' && (
            <FichasModule
              fichas={fichas}
              onSaveFicha={(newFicha) => setFichas((prev) => [newFicha, ...prev])}
              onDeleteFicha={(id) =>
                setFichas((prev) => prev.filter((item) => item.id !== id))
              }
              onCreateReportFromFicha={buildReportFromFicha}
            />
          )}

          {/* =================================================================
              8. MÓDULO GEOGRAFÍA SAGRADA
             ================================================================= */}
          {activeModule === 'geografia-sagrada' && (
            <SacredGeographyModule
              records={sacredRecords}
              onSaveRecord={(rec) => setSacredRecords((prev) => [rec, ...prev])}
              onGenerateReport={(rec) => {
                const ai = rec.analisisIA;
                const rep: ArchaeologicalReport = {
                  id: `REP-GEO-${Date.now()}`,
                  titulo: `Informe de Geografía Cultural: ${rec.nombrePaisajeOSitio}`,
                  subtituloModulo: 'Módulo 08 · Geografía Sagrada y Paisaje Cultural',
                  fechaGeneracion: new Date().toLocaleDateString('es-PE'),
                  isDemo: Boolean(rec.isDemo),
                  identificacion: {
                    'Sector / Paisaje': rec.nombrePaisajeOSitio,
                    'Cerros o Apus': rec.cerrosOApus,
                    Huacas: rec.huacas,
                    'Fuentes de Agua / Ríos': `${rec.fuentesAgua} / ${rec.rios}`,
                    Orientación: rec.orientacion,
                    Visibilidad: rec.visibilidad,
                  },
                  datosObservables: ai?.datosObservables || [
                    `Cerros/Apus registrados: ${rec.cerrosOApus}`,
                    `Huacas/Afloramientos: ${rec.huacas}`,
                    `Fuentes de agua: ${rec.fuentesAgua}`,
                    `Orientación medida: ${rec.orientacion}`,
                  ],
                  informacionDocumentada: ai?.informacionDocumentada || [
                    'Las relaciones espaciales del paisaje requieren contrastación arqueológica y etnohistórica.',
                  ],
                  analisis:
                    ai?.analisisTecnico ||
                    `Se observa una posible relación espacial entre los elementos registrados (${rec.relacionElementosPaisaje}). No se afirma automáticamente su carácter sagrado.`,
                  interpretacion: ai?.interpretacion || [
                    'Podría estar relacionado con prácticas de observación topográfica o articulación simbólica del paisaje, sujeto a verificación material.',
                  ],
                  hipotesis: ai?.hipotesis || [
                    'Hipótesis espacial: Se observa una posible relación visual y de emplazamiento que requiere evidencia arqueológica o documental.',
                  ],
                  informacionInsuficiente: ai?.informacionInsuficiente || [
                    'Información insuficiente para afirmar sacralidad sin evidencia de excavación o fuentes etnohistóricas.',
                  ],
                  asociacion: rec.asociadoA,
                  preguntasEvidencia: ai?.preguntasEvidencia || {
                    evidenciaSostener:
                      '¿Qué evidencia material in situ permite sostener que la orientación observada fue intencional?',
                    informacionFalta:
                      '¿Faltan excavaciones en la plataforma o análisis de visibilidad (viewshed) estadísticamente controlados?',
                    otrosMateriales:
                      '¿Existen ofrendas, cerámica ceremonial o modificaciones antrópicas en los afloramientos?',
                    relacionEspacial: rec.relacionElementosPaisaje,
                    asociacionEstado: rec.asociadoA.tipoRelacion,
                    analisisEspecializado:
                      'Arqueoastronomía de precisión, SIG (cuenca visual) y excavación estratigráfica.',
                  },
                  referencias: ai?.referenciasAPA || [],
                };
                createAndOpenReport(rep);
              }}
            />
          )}

          {/* =================================================================
              9. MÓDULO ESTRATEGIAS DE DOMINACIÓN INCA
             ================================================================= */}
          {activeModule === 'estrategias-inca' && (
            <IncaStrategyModule
              records={incaRecords}
              onSaveRecord={(rec) => setIncaRecords((prev) => [rec, ...prev])}
              onGenerateReport={(rec) => {
                const ai = rec.analisisIA;
                const rep: ArchaeologicalReport = {
                  id: `REP-INCA-${Date.now()}`,
                  titulo: `Informe de Estrategias Territoriales (Horizonte Tardío): ${rec.nombreSitioORegion}`,
                  subtituloModulo: 'Módulo 09 · Estrategias de Dominación Inca (Horizonte Tardío)',
                  fechaGeneracion: new Date().toLocaleDateString('es-PE'),
                  isDemo: Boolean(rec.isDemo),
                  identificacion: {
                    'Sitio o Región': rec.nombreSitioORegion,
                    'Red Vial (Caminos)': rec.caminos,
                    Arquitectura: rec.arquitectura,
                    Almacenamiento: rec.almacenamiento,
                    'Ubicación Estratégica': rec.ubicacionEstrategica,
                  },
                  datosObservables: ai?.datosObservables || [
                    `Caminos observados: ${rec.caminos}`,
                    `Arquitectura registrada: ${rec.arquitectura}`,
                    `Almacenamiento: ${rec.almacenamiento}`,
                    `Relación con poblaciones locales: ${rec.relacionesPoblacionesLocales}`,
                  ],
                  informacionDocumentada: ai?.informacionDocumentada || [
                    'El control territorial del Tawantinsuyu combinó infraestructura vial (Qhapaq Ñan), centros administrativos, almacenamiento estatal y alianzas asimétricas con élites locales.',
                  ],
                  analisis:
                    ai?.analisisTecnico ||
                    `Evaluación de control territorial considerando movilidad (${rec.movilidad}), recursos (${rec.recursos}) y espacios ceremoniales (${rec.espaciosCeremoniales}).`,
                  interpretacion: ai?.interpretacion || [
                    'La articulación de arquitectura ortogonal, depósitos y vialidad sugiere inversión estatal en la administración de la cuenca.',
                  ],
                  hipotesis: ai?.hipotesis || [
                    'Hipótesis de trabajo: El asentamiento habría operado como nodo logístico y ceremonial para integrar mano de obra local.',
                  ],
                  informacionInsuficiente: ai?.informacionInsuficiente || [
                    'Información insuficiente para cuantificar el volumen exacto de tributo o establecer el carácter pacífico o coercitivo de la anexión sin excavar contextos domésticos locales.',
                  ],
                  asociacion: rec.asociadoA,
                  preguntasEvidencia: ai?.preguntasEvidencia || {
                    evidenciaSostener:
                      '¿Qué evidencia estratigráfica demuestra que las estructuras de almacenamiento y la cerámica local son estrictamente contemporáneas?',
                    informacionFalta:
                      'Falta análisis paleobotánico del interior de las posibles qullqas y excavación en sectores residenciales locales.',
                    otrosMateriales:
                      'Aríbalos, platos pato, quipus, pesas o bienes suntuarios de redistribución.',
                    relacionEspacial: rec.visibilidad,
                    asociacionEstado: rec.asociadoA.tipoRelacion,
                    analisisEspecializado:
                      'Análisis de paleobotánica en pisos de qullqas, INAA en cerámica provincial e imperial, y modelado de rutas de menor costo (Least-Cost Path).',
                  },
                  referencias: ai?.referenciasAPA || [],
                };
                createAndOpenReport(rep);
              }}
            />
          )}

          {/* =================================================================
              12. MÓDULO INFORME Y EXPORTACIÓN
             ================================================================= */}
          {activeModule === 'informe' && (
            <ReportModule
              report={activeReport}
              savedReports={reports}
              onSelectReport={setActiveReport}
            />
          )}

          {/* =================================================================
              13. MÓDULO DEMOSTRACIÓN
             ================================================================= */}
          {activeModule === 'demostracion' && (
            <div className="space-y-8">
              <div className="border-b border-[#D6CEBE] pb-5">
                <div className="text-xs text-[#9A3412] font-semibold mb-1">
                  Módulo 13 · Conjunto de Prueba Pedagógica y Metodológica
                </div>
                <h2 className="text-3xl font-display font-semibold text-[#1C1917]">
                  Registros de Ejemplo — DATOS DE DEMOSTRACIÓN
                </h2>
                <p className="text-sm text-[#57534E] mt-1 max-w-2xl">
                  Explore los registros precargados para comprobar el funcionamiento de los formularios, preguntas a la evidencia, referencias APA 7 y generación de informes.
                </p>
              </div>

              <div className="p-4 bg-[#FEF3C7]/80 border-l-4 border-[#B45309] text-xs text-[#78350F] flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 text-[#B45309] mt-0.5" />
                <div>
                  <strong className="font-semibold block text-sm mb-0.5">
                    ADVERTENCIA OBLIGATORIA: DATOS DE DEMOSTRACIÓN
                  </strong>
                  Todos los registros listados en esta sección son <strong>ejemplos demostrativos creados exclusivamente para probar los módulos de ArqueoIA 3.0</strong>. Nunca deben presentarse ni citarse como información arqueológica de campo verificada.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Demo Site Card */}
                <div className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-5 space-y-3">
                  <div className="text-xs font-semibold text-[#9A3412]">
                    DATOS DE DEMOSTRACIÓN · Registro de Sitio
                  </div>
                  <h3 className="text-xl font-display font-semibold text-[#1C1917]">
                    {INITIAL_DEMO_SITES[0].nombreSitio}
                  </h3>
                  <p className="text-xs text-[#44403C] leading-relaxed">
                    {INITIAL_DEMO_SITES[0].descripcion}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleLoadSiteDemo();
                        setActiveModule('registro-sitio');
                      }}
                      className="px-3.5 py-2 text-xs font-semibold bg-[#78350F] text-[#FBF9F5] rounded hover:bg-[#5C280B] transition-colors"
                    >
                      Probar en Módulo Registro de Sitio →
                    </button>
                  </div>
                </div>

                {/* Demo Fichas Card */}
                <div className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-5 space-y-3">
                  <div className="text-xs font-semibold text-[#9A3412]">
                    DATOS DE DEMOSTRACIÓN · Fichas Arqueológicas (Cerámica, Lítico, Óseo)
                  </div>
                  <h3 className="text-xl font-display font-semibold text-[#1C1917]">
                    3 Fichas Materiales Precargadas
                  </h3>
                  <p className="text-xs text-[#44403C] leading-relaxed">
                    Incluye el fragmento policromo DEMO-CER-2026-001, la punta de obsidiana DEMO-LIT-2026-002 y el elemento óseo DEMO-OSE-2026-003 (con protocolo de identificación preliminar).
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveModule('fichas')}
                      className="px-3.5 py-2 text-xs font-semibold bg-[#78350F] text-[#FBF9F5] rounded hover:bg-[#5C280B] transition-colors"
                    >
                      Abrir Catálogo de Fichas Demo →
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveReport(INITIAL_DEMO_REPORT);
                        setActiveModule('informe');
                      }}
                      className="px-3.5 py-2 text-xs font-semibold bg-[#EBE6DF] text-[#1C1917] rounded hover:bg-[#D6CEBE] transition-colors"
                    >
                      Ver Informe Demo Completo →
                    </button>
                  </div>
                </div>

                {/* Demo Sacred Geography Card */}
                <div className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-5 space-y-3">
                  <div className="text-xs font-semibold text-[#9A3412]">
                    DATOS DE DEMOSTRACIÓN · Geografía Sagrada
                  </div>
                  <h3 className="text-xl font-display font-semibold text-[#1C1917]">
                    {INITIAL_DEMO_SACRED_GEOGRAPHY[0].nombrePaisajeOSitio}
                  </h3>
                  <p className="text-xs text-[#44403C] leading-relaxed">
                    Ejemplo de análisis de relaciones espaciales entre cumbre nevada, afloramiento tallado y manantial canalizado usando lenguaje condicional prudente.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveModule('geografia-sagrada')}
                    className="px-3.5 py-2 text-xs font-semibold bg-[#78350F] text-[#FBF9F5] rounded hover:bg-[#5C280B] transition-colors"
                  >
                    Probar en Geografía Sagrada →
                  </button>
                </div>

                {/* Demo Inca Strategy Card */}
                <div className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-5 space-y-3">
                  <div className="text-xs font-semibold text-[#9A3412]">
                    DATOS DE DEMOSTRACIÓN · Estrategias del Horizonte Tardío
                  </div>
                  <h3 className="text-xl font-display font-semibold text-[#1C1917]">
                    {INITIAL_DEMO_INCA_STRATEGIES[0].nombreSitioORegion}
                  </h3>
                  <p className="text-xs text-[#44403C] leading-relaxed">
                    Ejemplo de evaluación de vialidad, kallankas, qullqas en ladera e interacción con poblaciones locales diferenciando evidencia observada e interpretación.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveModule('estrategias-inca')}
                    className="px-3.5 py-2 text-xs font-semibold bg-[#78350F] text-[#FBF9F5] rounded hover:bg-[#5C280B] transition-colors"
                  >
                    Probar en Estrategias Inca →
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Quiet Institutional Footer */}
      <footer className="border-t border-[#D6CEBE] bg-[#EBE6DF] px-6 py-4 text-xs text-[#57534E] no-print">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>ArqueoIA 3.0</strong> — Asistente inteligente para el análisis arqueológico · Herramienta de apoyo que no reemplaza el criterio del arqueólogo.
          </div>
          <div>
            Separación estricta: Datos Observables · Interpretación · Hipótesis · Información Documentada · Formato APA 7
          </div>
        </div>
      </footer>
    </div>
  );
}
