import React, { useState } from 'react';
import {
  SacredGeographyRecord,
  IncaStrategyRecord,
  ArchaeologicalReport,
  AssociationField,
  AIAnalysisResult,
} from '../types/archaeology';
import { AssociationSelector, AnalysisResultView } from './CommonBlocks';
import { INITIAL_DEMO_SACRED_GEOGRAPHY, INITIAL_DEMO_INCA_STRATEGIES } from '../data/demoData';
import {
  Save,
  Sparkles,
  RotateCcw,
  FileText,
  Download,
  Printer,
  AlertTriangle,
  Compass,
  Landmark,
  BookOpen,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

const DEFAULT_ASSOC: AssociationField = {
  items: [],
  tipoRelacion: 'Observada en superficie (Hipótesis espacial)',
  detalleAsociacion: '',
};

// ============================================================================
// 8. MÓDULO DE GEOGRAFÍA SAGRADA
// ============================================================================
interface SacredGeographyModuleProps {
  records: SacredGeographyRecord[];
  onSaveRecord: (rec: SacredGeographyRecord) => void;
  onGenerateReport: (rec: SacredGeographyRecord) => void;
}

export const SacredGeographyModule: React.FC<SacredGeographyModuleProps> = ({
  records,
  onSaveRecord,
  onGenerateReport,
}) => {
  const [form, setForm] = useState<Omit<SacredGeographyRecord, 'id' | 'createdAt'>>({
    nombrePaisajeOSitio: '',
    cerrosOApus: '',
    huacas: '',
    fuentesAgua: '',
    rios: '',
    lagunas: '',
    quebradas: '',
    cuevas: '',
    caminos: '',
    plazas: '',
    estructurasCeremoniales: '',
    asentamientos: '',
    orientacion: '',
    visibilidad: '',
    accesibilidad: '',
    relacionElementosPaisaje: '',
    asociadoA: { ...DEFAULT_ASSOC },
  });

  const [isDemoLoaded, setIsDemoLoaded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const loadDemo = () => {
    const demo = INITIAL_DEMO_SACRED_GEOGRAPHY[0];
    setForm({
      nombrePaisajeOSitio: demo.nombrePaisajeOSitio,
      cerrosOApus: demo.cerrosOApus,
      huacas: demo.huacas,
      fuentesAgua: demo.fuentesAgua,
      rios: demo.rios,
      lagunas: demo.lagunas,
      quebradas: demo.quebradas,
      cuevas: demo.cuevas,
      caminos: demo.caminos,
      plazas: demo.plazas,
      estructurasCeremoniales: demo.estructurasCeremoniales,
      asentamientos: demo.asentamientos,
      orientacion: demo.orientacion,
      visibilidad: demo.visibilidad,
      accesibilidad: demo.accesibilidad,
      relacionElementosPaisaje: demo.relacionElementosPaisaje,
      asociadoA: demo.asociadoA,
    });
    setIsDemoLoaded(true);
    setStatusMsg('Datos de demostración cargados. Recuerde que no constituyen un registro verificado.');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newRec: SacredGeographyRecord = {
      id: `geo-${Date.now()}`,
      isDemo: isDemoLoaded || form.nombrePaisajeOSitio.includes('DEMOSTRACIÓN'),
      createdAt: new Date().toISOString().split('T')[0],
      ...form,
      analisisIA: analysisResult || undefined,
    };
    onSaveRecord(newRec);
    setStatusMsg('Registro de paisaje y geografía cultural guardado correctamente.');
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setStatusMsg(null);
    try {
      const response = await fetch('/api/archaeology/analyze-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordType: 'Geografía Sagrada',
          recordData: form,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error en el análisis.');
      setAnalysisResult(data.result);
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderInput = (label: string, key: keyof typeof form, placeholder: string) => (
    <div>
      <label className="block text-xs font-semibold text-[#44403C] mb-1">
        {label}
      </label>
      <input
        type="text"
        value={form[key] as string}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
      />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D6CEBE] pb-5">
        <div>
          <div className="text-xs text-[#78350F] font-medium mb-1">
            Módulo 08 · Arqueología del Paisaje y Relaciones Espaciales
          </div>
          <h2 className="text-3xl font-display font-semibold text-[#1C1917]">
            Geografía Sagrada y Paisaje Cultural
          </h2>
          <p className="text-sm text-[#57534E] mt-1 max-w-2xl">
            Registro sistemático de elementos topográficos, hidrográficos y arquitectónicos para evaluar posibles relaciones espaciales y visuales.
          </p>
        </div>
        <button
          type="button"
          onClick={loadDemo}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#EBE6DF] hover:bg-[#D6CEBE] text-[#292524] rounded transition-colors whitespace-nowrap"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#78350F]" />
          Cargar ejemplo de demostración
        </button>
      </div>

      {/* Cautionary Epistemological Banner */}
      <div className="p-4 bg-[#F3EFE6] border-l-4 border-[#78350F] text-xs text-[#292524] flex items-start gap-3">
        <Compass className="w-5 h-5 shrink-0 text-[#78350F] mt-0.5" />
        <div>
          <strong className="font-semibold block text-sm text-[#1C1917] mb-0.5">
            Criterio de Prudencia Interpretativa en Geografía Sagrada
          </strong>
          ArqueoIA 3.0 <strong>no afirma automáticamente que un lugar era sagrado</strong> por su sola prominencia topográfica. El análisis emplea formulaciones condicionales (<em>"podría estar relacionado"</em>, <em>"se observa una posible relación"</em>, <em>"requiere evidencia arqueológica o documental"</em>) hasta contar con indicadores materiales o etnohistóricos verificables.
        </div>
      </div>

      <form onSubmit={handleSave} className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderInput('Nombre del sector o paisaje estudiado', 'nombrePaisajeOSitio', 'Ej. Cuenca Alta / Sector Ushnu-Pata')}
          {renderInput('Cerros o Apus (Cumbres prominentes)', 'cerrosOApus', 'Nombre, azimut, altitud o prominencia visual')}
          {renderInput('Huacas (Afloramientos tallados / hitos)', 'huacas', 'Rocas labradas, monolitos, wankas registradas')}
          {renderInput('Fuentes de agua (Manantiales / Puquios)', 'fuentesAgua', 'Ubicación, canalización o proximidad')}
          {renderInput('Ríos (Cursos fluviales y confluencias / Tinkuy)', 'rios', 'Ríos principales, tributarios o confluencias')}
          {renderInput('Lagunas (Qochas altoandinas)', 'lagunas', 'Lagunas permanentes o estacionales asociadas')}
          {renderInput('Quebradas', 'quebradas', 'Quebradas que delimitan o articulan el sitio')}
          {renderInput('Cuevas / Abrigos rocosos (Machay)', 'cuevas', 'Oquedades, abrigos o contextos funerarios en roca')}
          {renderInput('Caminos (Rutas de acceso o procesionales)', 'caminos', 'Calzadas, escalinatas, senderos asociados')}
          {renderInput('Plazas (Espacios abiertos de congregación)', 'plazas', 'Dimensiones, nivelación y posición respecto al relieve')}
          {renderInput('Estructuras ceremoniales', 'estructurasCeremoniales', 'Plataformas, ushnus, recintos de doble jamba')}
          {renderInput('Asentamientos asociados', 'asentamientos', 'Áreas domésticas o aldeas vinculadas')}
          {renderInput('Orientación astronómica o topográfica', 'orientacion', 'Azimut en grados (ej. 42° NE hacia cumbre)')}
          {renderInput('Visibilidad (Cuenca visual / Intervisibilidad)', 'visibilidad', 'Alcance visual desde y hacia los elementos')}
          {renderInput('Accesibilidad', 'accesibilidad', 'Grado de restricción, pendientes, portadas de control')}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#44403C] mb-1">
            Relación entre elementos del paisaje (Observaciones de campo)
          </label>
          <textarea
            rows={3}
            value={form.relacionElementosPaisaje}
            onChange={(e) => setForm({ ...form, relacionElementosPaisaje: e.target.value })}
            placeholder="Describa las alineaciones visuales, conexiones hidráulicas o articulaciones espaciales observadas en terreno..."
            className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
          />
        </div>

        <AssociationSelector
          value={form.asociadoA}
          onChange={(asociadoA) => setForm({ ...form, asociadoA })}
        />

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#D6CEBE]">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#1C1917] text-[#FBF9F5] rounded hover:bg-[#292524] transition-colors whitespace-nowrap"
            >
              <Save className="w-4 h-4" />
              Guardar Registro de Paisaje
            </button>
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={handleAnalyze}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#78350F] text-[#FBF9F5] rounded hover:bg-[#5C280B] disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              {isAnalyzing
                ? 'Analizando relaciones espaciales...'
                : 'Analizar Relaciones del Paisaje con IA'}
            </button>
          </div>
          {statusMsg && <span className="text-xs text-[#78350F] font-medium">{statusMsg}</span>}
        </div>
      </form>

      {analysisResult && (
        <AnalysisResultView
          analysis={analysisResult}
          title={`Análisis de Geografía Cultural: ${form.nombrePaisajeOSitio || 'Paisaje Registrado'}`}
          isDemo={isDemoLoaded}
          onGenerateReport={() =>
            onGenerateReport({
              id: `geo-${Date.now()}`,
              isDemo: isDemoLoaded,
              createdAt: new Date().toISOString().split('T')[0],
              ...form,
              analisisIA: analysisResult,
            })
          }
        />
      )}

      {records.length > 0 && (
        <div className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-6">
          <h3 className="text-lg font-display font-semibold text-[#1C1917] mb-3">
            Registros Guardados de Geografía Sagrada ({records.length})
          </h3>
          <div className="space-y-3">
            {records.map((rec) => (
              <div
                key={rec.id}
                className="p-4 bg-[#F3EFE6]/60 border border-[#D6CEBE] rounded flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#78350F]">
                    <span>{rec.createdAt}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {rec.isDemo ? 'DATOS DE DEMOSTRACIÓN' : 'Registro de Campo'}
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-[#1C1917]">
                    {rec.nombrePaisajeOSitio || 'Sector sin nombre'}
                  </h4>
                  <p className="text-xs text-[#44403C] mt-1">
                    Cerros/Apus: {rec.cerrosOApus || 'No especificado'} · Huacas: {rec.huacas || 'No especificado'} · Orientación: {rec.orientacion || 'No especificada'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onGenerateReport(rec)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#78350F] text-[#FBF9F5] rounded hover:bg-[#5C280B] transition-colors whitespace-nowrap self-start md:self-center"
                >
                  <FileText className="w-3.5 h-3.5" /> Generar Informe
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 9. MÓDULO DE ESTRATEGIAS DE DOMINACIÓN INCA (HORIZONTE TARDÍO)
// ============================================================================
interface IncaStrategyModuleProps {
  records: IncaStrategyRecord[];
  onSaveRecord: (rec: IncaStrategyRecord) => void;
  onGenerateReport: (rec: IncaStrategyRecord) => void;
}

export const IncaStrategyModule: React.FC<IncaStrategyModuleProps> = ({
  records,
  onSaveRecord,
  onGenerateReport,
}) => {
  const [form, setForm] = useState<Omit<IncaStrategyRecord, 'id' | 'createdAt'>>({
    nombreSitioORegion: '',
    caminos: '',
    arquitectura: '',
    administracion: '',
    almacenamiento: '',
    movilidad: '',
    visibilidad: '',
    controlTerritorial: '',
    recursos: '',
    relacionesPoblacionesLocales: '',
    infraestructura: '',
    espaciosCeremoniales: '',
    ubicacionEstrategica: '',
    asociadoA: { ...DEFAULT_ASSOC },
  });

  const [isDemoLoaded, setIsDemoLoaded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const loadDemo = () => {
    const demo = INITIAL_DEMO_INCA_STRATEGIES[0];
    setForm({
      nombreSitioORegion: demo.nombreSitioORegion,
      caminos: demo.caminos,
      arquitectura: demo.arquitectura,
      administracion: demo.administracion,
      almacenamiento: demo.almacenamiento,
      movilidad: demo.movilidad,
      visibilidad: demo.visibilidad,
      controlTerritorial: demo.controlTerritorial,
      recursos: demo.recursos,
      relacionesPoblacionesLocales: demo.relacionesPoblacionesLocales,
      infraestructura: demo.infraestructura,
      espaciosCeremoniales: demo.espaciosCeremoniales,
      ubicacionEstrategica: demo.ubicacionEstrategica,
      asociadoA: demo.asociadoA,
    });
    setIsDemoLoaded(true);
    setStatusMsg('Ejemplo de demostración cargado (Horizonte Tardío).');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newRec: IncaStrategyRecord = {
      id: `inca-${Date.now()}`,
      isDemo: isDemoLoaded || form.nombreSitioORegion.includes('DEMOSTRACIÓN'),
      createdAt: new Date().toISOString().split('T')[0],
      ...form,
      analisisIA: analysisResult || undefined,
    };
    onSaveRecord(newRec);
    setStatusMsg('Ficha de análisis del Horizonte Tardío guardada.');
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setStatusMsg(null);
    try {
      const response = await fetch('/api/archaeology/analyze-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordType: 'Estrategias de Dominación Inca',
          recordData: form,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error en el análisis.');
      setAnalysisResult(data.result);
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderInput = (label: string, key: keyof typeof form, placeholder: string) => (
    <div>
      <label className="block text-xs font-semibold text-[#44403C] mb-1">
        {label}
      </label>
      <textarea
        rows={2}
        value={form[key] as string}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
      />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D6CEBE] pb-5">
        <div>
          <div className="text-xs text-[#78350F] font-medium mb-1">
            Módulo 09 · Análisis Territorial del Horizonte Tardío (Tawantinsuyu)
          </div>
          <h2 className="text-3xl font-display font-semibold text-[#1C1917]">
            Estrategias de Dominación Inca
          </h2>
          <p className="text-sm text-[#57534E] mt-1 max-w-2xl">
            Evaluación multidimensional de indicadores viales, arquitectónicos, logísticos y políticos, diferenciando siempre entre evidencia observada, información documentada e interpretación.
          </p>
        </div>
        <button
          type="button"
          onClick={loadDemo}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#EBE6DF] hover:bg-[#D6CEBE] text-[#292524] rounded transition-colors whitespace-nowrap"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#78350F]" />
          Cargar ejemplo de demostración
        </button>
      </div>

      <div className="p-4 bg-[#F3EFE6] border-l-4 border-[#1C1917] text-xs text-[#292524] flex items-start gap-3">
        <Landmark className="w-5 h-5 shrink-0 text-[#78350F] mt-0.5" />
        <div>
          <strong className="font-semibold block text-sm text-[#1C1917] mb-0.5">
            Diferenciación Epistemológica Obligatoria (Horizonte Tardío)
          </strong>
          El análisis distingue rigurosamente entre: <strong>(1) Evidencia material observada in situ</strong>, <strong>(2) Información documentada</strong> en estudios regionales/etnohistóricos, y <strong>(3) Interpretaciones o hipótesis</strong> sobre control directo, hegemónico o indirecto.
        </div>
      </div>

      <form onSubmit={handleSave} className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-[#44403C] mb-1">
            Sitio, Tambo, Centro Administrativo o Cuenca en Estudio
          </label>
          <input
            type="text"
            value={form.nombreSitioORegion}
            onChange={(e) => setForm({ ...form, nombreSitioORegion: e.target.value })}
            placeholder="Ej. Nodo Vial Tambo-Qullqa / Cuenca media..."
            className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderInput('01. Caminos (Red vial / Qhapaq Ñan)', 'caminos', 'Calzadas, ancho, muros de retención, escalinatas, drenajes')}
          {renderInput('02. Arquitectura', 'arquitectura', 'Kanchas, kallankas, vanos trapezoidales, mampostería')}
          {renderInput('03. Administración', 'administracion', ' Sectores de control, accesos restringidos, posibles registros')}
          {renderInput('04. Almacenamiento', 'almacenamiento', 'Qullqas circulares/rectangulares, ventilación, volumen estimado')}
          {renderInput('05. Movilidad', 'movilidad', 'Pasos naturales, puentes, articulación entre pisos ecológicos')}
          {renderInput('06. Visibilidad', 'visibilidad', 'Dominio visual sobre caminos, valles y sectores de depósito')}
          {renderInput('07. Control territorial', 'controlTerritorial', 'Puntos de control, pukaras reocupados, enclaves estratégicos')}
          {renderInput('08. Recursos', 'recursos', 'Tierras maiceras, pasturas de camélidos, minas, salinas, agua')}
          {renderInput('09. Relaciones con poblaciones locales', 'relacionesPoblacionesLocales', 'Continuidad o cambio en alfarería local, arquitectura híbrida')}
          {renderInput('10. Infraestructura productiva / hidráulica', 'infraestructura', 'Andenerías estatales, canales, represas, camellones')}
          {renderInput('11. Espacios ceremoniales', 'espaciosCeremoniales', 'Plazas de hospitalidad, plataformas ushnu, santuarios de altura')}
          {renderInput('12. Ubicación estratégica', 'ubicacionEstrategica', 'Emplazamiento topográfico, altitud y conectividad regional')}
        </div>

        <AssociationSelector
          value={form.asociadoA}
          onChange={(asociadoA) => setForm({ ...form, asociadoA })}
        />

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#D6CEBE]">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#1C1917] text-[#FBF9F5] rounded hover:bg-[#292524] transition-colors whitespace-nowrap"
            >
              <Save className="w-4 h-4" />
              Guardar Análisis del Horizonte Tardío
            </button>
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={handleAnalyze}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#78350F] text-[#FBF9F5] rounded hover:bg-[#5C280B] disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              {isAnalyzing
                ? 'Evaluando indicadores del Horizonte Tardío...'
                : 'Analizar Estrategias Territoriales con IA'}
            </button>
          </div>
          {statusMsg && <span className="text-xs text-[#78350F] font-medium">{statusMsg}</span>}
        </div>
      </form>

      {analysisResult && (
        <AnalysisResultView
          analysis={analysisResult}
          title={`Análisis de Control Territorial (Horizonte Tardío): ${form.nombreSitioORegion}`}
          isDemo={isDemoLoaded}
          onGenerateReport={() =>
            onGenerateReport({
              id: `inca-${Date.now()}`,
              isDemo: isDemoLoaded,
              createdAt: new Date().toISOString().split('T')[0],
              ...form,
              analisisIA: analysisResult,
            })
          }
        />
      )}
    </div>
  );
};

// ============================================================================
// 12. MÓDULO DE INFORME ARQUEOLÓGICO Y EXPORTACIÓN
// ============================================================================
interface ReportModuleProps {
  report: ArchaeologicalReport;
  savedReports: ArchaeologicalReport[];
  onSelectReport: (rep: ArchaeologicalReport) => void;
}

export const ReportModule: React.FC<ReportModuleProps> = ({
  report,
  savedReports,
  onSelectReport,
}) => {
  const exportAsMarkdownText = () => {
    const lines: string[] = [
      `====================================================================`,
      `ARQUEOIA 3.0 — INFORME TÉCNICO DE ANÁLISIS ARQUEOLÓGICO`,
      `Nota: Herramienta de apoyo metodológico. No reemplaza el criterio del arqueólogo.`,
      `====================================================================`,
      ``,
      `TÍTULO: ${report.titulo}`,
      `MÓDULO DE ORIGEN: ${report.subtituloModulo}`,
      `FECHA DE GENERACIÓN: ${report.fechaGeneracion}`,
      `CLASIFICACIÓN: ${report.isDemo ? 'DATOS DE DEMOSTRACIÓN (NO VERIFICADOS)' : 'REGISTRO DE INVESTIGACIÓN'}`,
      ``,
      `1. IDENTIFICACIÓN`,
      ...Object.entries(report.identificacion).map(([k, v]) => `- ${k}: ${v || 'Información insuficiente para establecer esta afirmación.'}`),
      ``,
      `2. DATOS OBSERVABLES`,
      ...(report.datosObservables.length
        ? report.datosObservables.map((d) => `- ${d}`)
        : ['- Información insuficiente para establecer esta afirmación.']),
      ``,
      `3. INFORMACIÓN DOCUMENTADA`,
      ...(report.informacionDocumentada.length
        ? report.informacionDocumentada.map((d) => `- ${d}`)
        : ['- Información insuficiente para establecer esta afirmación.']),
      ``,
      `4. ANÁLISIS TÉCNICO`,
      report.analisis || 'Información insuficiente para establecer esta afirmación.',
      ``,
      `5. INTERPRETACIÓN`,
      ...(report.interpretacion.length
        ? report.interpretacion.map((d) => `- ${d}`)
        : ['- Información insuficiente para establecer esta afirmación.']),
      ``,
      `6. HIPÓTESIS (Sujetas a contrastación empírica — Nunca presentadas como hechos)`,
      ...(report.hipotesis.length
        ? report.hipotesis.map((d) => `- ${d}`)
        : ['- Información insuficiente para establecer esta afirmación.']),
      ``,
      `7. INFORMACIÓN INSUFICIENTE`,
      ...(report.informacionInsuficiente.length
        ? report.informacionInsuficiente.map((d) => `- ${d}`)
        : ['- Requiere verificación de campo y análisis especializados.']),
      ``,
      `8. ASOCIACIÓN CONTEXTUAL ("¿A qué está asociado?")`,
      `- Elementos asociados: ${report.asociacion.items.join(', ') || 'Ninguno especificado'}`,
      `- Naturaleza de la relación: ${report.asociacion.tipoRelacion}`,
      `- Detalle: ${report.asociacion.detalleAsociacion || 'Sin detalle adicional'}`,
      ``,
      `9. PREGUNTAS A LA EVIDENCIA`,
      `- ¿Qué evidencia permite sostener esta interpretación?: ${report.preguntasEvidencia.evidenciaSostener}`,
      `- ¿Qué información falta?: ${report.preguntasEvidencia.informacionFalta}`,
      `- ¿Qué otros materiales deberían buscarse?: ${report.preguntasEvidencia.otrosMateriales}`,
      `- ¿Qué relación espacial existe?: ${report.preguntasEvidencia.relacionEspacial}`,
      `- ¿La asociación está documentada o es una hipótesis?: ${report.preguntasEvidencia.asociacionEstado}`,
      `- ¿Qué análisis especializado sería necesario?: ${report.preguntasEvidencia.analisisEspecializado}`,
      ``,
      `10. REFERENCIAS (FORMATO APA 7)`,
      ...(report.referencias.length
        ? report.referencias.map(
            (r) =>
              `- ${
                r.citaCompletaAPA7 ||
                `${r.autor} (${r.anio}). ${r.titulo}. ${r.publicacion}. ${r.pagina}`
              }`
          )
        : ['- Sin referencias bibliográficas externas adicionales.']),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Informe_ArqueoIA_${report.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsJson = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Informe_ArqueoIA_${report.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Bar Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#D6CEBE] pb-5 no-print">
        <div>
          <div className="text-xs text-[#78350F] font-medium mb-1">
            Módulo 10, 11 y 12 · Síntesis Científica, Preguntas a la Evidencia y Referencias APA 7
          </div>
          <h2 className="text-3xl font-display font-semibold text-[#1C1917]">
            Informe Arqueológico Estructurado
          </h2>
          <p className="text-sm text-[#57534E] mt-1 max-w-2xl">
            Documento técnico organizado con separación estricta entre datos observables, interpretación, hipótesis, asociaciones, preguntas a la evidencia y bibliografía APA 7.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={exportAsMarkdownText}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#78350F] text-[#FBF9F5] rounded hover:bg-[#5C280B] transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar Informe (.TXT)
          </button>
          <button
            type="button"
            onClick={exportAsJson}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#EBE6DF] text-[#1C1917] border border-[#D6CEBE] rounded hover:bg-[#D6CEBE] transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar Datos (.JSON)
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#1C1917] text-[#FBF9F5] rounded hover:bg-[#292524] transition-colors whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      {/* Selector of Reports if multiple exist */}
      {savedReports.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 no-print">
          <span className="text-xs font-semibold text-[#57534E]">
            Informes generados en esta sesión:
          </span>
          {savedReports.map((rep) => (
            <button
              key={rep.id}
              type="button"
              onClick={() => onSelectReport(rep)}
              className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap truncate max-w-xs ${
                rep.id === report.id
                  ? 'bg-[#78350F] text-[#FBF9F5] border-[#78350F]'
                  : 'bg-[#FBF9F5] text-[#292524] border-[#D6CEBE] hover:bg-[#EBE6DF]'
              }`}
            >
              {rep.titulo}
            </button>
          ))}
        </div>
      )}

      {/* Printable Institutional Report Sheet */}
      <article className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-8 space-y-8 max-w-5xl mx-auto">
        {/* Institutional Header */}
        <header className="border-b-2 border-[#1C1917] pb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="text-xs text-[#78350F] font-semibold">
              ARQUEOIA 3.0 · ASISTENTE INTELIGENTE PARA EL ANÁLISIS ARQUEOLÓGICO
            </div>
            <h1 className="text-3xl font-display font-bold text-[#1C1917] mt-1">
              {report.titulo}
            </h1>
            <p className="text-sm text-[#57534E] mt-1">{report.subtituloModulo}</p>
          </div>
          <div className="text-xs text-[#44403C] font-mono-tabular md:text-right shrink-0">
            <div>Fecha: {report.fechaGeneracion}</div>
            <div>ID: {report.id}</div>
            <div className="mt-1 font-sans font-semibold text-[#9A3412]">
              {report.isDemo
                ? 'DATOS DE DEMOSTRACIÓN (NO VERIFICADOS)'
                : 'REGISTRO TÉCNICO DEL INVESTIGADOR'}
            </div>
          </div>
        </header>

        {report.isDemo && (
          <div className="p-3.5 bg-[#FEF3C7]/70 border-l-4 border-[#B45309] text-xs text-[#78350F] flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#B45309]" />
            <span>
              <strong>AVISO DE DEMOSTRACIÓN:</strong> Este informe ha sido generado con datos de ejemplo para ilustrar la estructura metodológica de ArqueoIA 3.0. No debe citarse como información arqueológica de campo verificada.
            </span>
          </div>
        )}

        {/* Section 1: IDENTIFICACIÓN */}
        <section>
          <h3 className="text-lg font-display font-semibold text-[#1C1917] border-b border-[#D6CEBE] pb-2 mb-4">
            01. Identificación del Registro
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <dl className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
              {Object.entries(report.identificacion).map(([key, val]) => (
                <div key={key} className="border-b border-[#EBE6DF] pb-2">
                  <dt className="text-[#57534E] font-medium">{key}</dt>
                  <dd className="text-[#1C1917] font-semibold mt-0.5 font-mono-tabular">
                    {val || 'Información insuficiente para establecer esta afirmación.'}
                  </dd>
                </div>
              ))}
            </dl>
            {report.fotografia && (
              <div className="border border-[#D6CEBE] rounded p-2 bg-[#EBE6DF] flex flex-col items-center justify-center">
                <img
                  src={report.fotografia}
                  alt="Registro gráfico del informe"
                  referrerPolicy="no-referrer"
                  className="max-h-44 object-contain rounded"
                />
                <span className="text-[11px] text-[#57534E] italic mt-1.5">
                  Fig. 1 — Registro fotográfico asociado
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Section 2 & 3: DATOS OBSERVABLES & ANÁLISIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h3 className="text-lg font-display font-semibold text-[#1C1917] border-b border-[#D6CEBE] pb-2 mb-3">
              02. Datos Observables
            </h3>
            <ul className="space-y-1.5 text-sm text-[#292524] list-disc list-inside">
              {report.datosObservables.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-display font-semibold text-[#1C1917] border-b border-[#D6CEBE] pb-2 mb-3">
              03. Análisis Técnico e Información Documentada
            </h3>
            <p className="text-sm text-[#292524] leading-relaxed mb-3">
              {report.analisis}
            </p>
            {report.informacionDocumentada.length > 0 && (
              <ul className="space-y-1 text-xs text-[#44403C] list-disc list-inside">
                {report.informacionDocumentada.map((doc, i) => (
                  <li key={i}>{doc}</li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Section 4 & 5: INTERPRETACIÓN vs HIPÓTESIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="p-4 bg-[#F3EFE6]/70 border-t-2 border-[#78350F]">
            <h3 className="text-base font-display font-semibold text-[#78350F] mb-2">
              04. Interpretación Arqueológica
            </h3>
            <ul className="space-y-1.5 text-sm text-[#292524] list-disc list-inside">
              {report.interpretacion.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="p-4 bg-[#F3EFE6]/70 border-t-2 border-[#9A3412]">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-base font-display font-semibold text-[#9A3412]">
                05. Hipótesis de Trabajo
              </h3>
              <span className="text-[11px] text-[#9A3412]">
                No constituye un hecho verificado
              </span>
            </div>
            <ul className="space-y-1.5 text-sm text-[#292524] list-disc list-inside">
              {report.hipotesis.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Section 6: ASOCIACIÓN */}
        <section>
          <h3 className="text-lg font-display font-semibold text-[#1C1917] border-b border-[#D6CEBE] pb-2 mb-3">
            06. Asociación Contextual ("¿A qué está asociado?")
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-[#F3EFE6] rounded border border-[#D6CEBE]">
              <span className="text-[#57534E] block mb-1">Elementos asociados:</span>
              <strong className="text-[#1C1917]">
                {report.asociacion.items.length > 0
                  ? report.asociacion.items.join(' · ')
                  : 'Ninguno registrado'}
              </strong>
            </div>
            <div className="p-3 bg-[#F3EFE6] rounded border border-[#D6CEBE]">
              <span className="text-[#57534E] block mb-1">Estado de la asociación:</span>
              <strong className="text-[#78350F]">{report.asociacion.tipoRelacion}</strong>
            </div>
            <div className="p-3 bg-[#F3EFE6] rounded border border-[#D6CEBE]">
              <span className="text-[#57534E] block mb-1">Detalle contextual:</span>
              <span className="text-[#1C1917]">
                {report.asociacion.detalleAsociacion || 'Sin detalle especificado.'}
              </span>
            </div>
          </div>
        </section>

        {/* Section 7: PREGUNTAS A LA EVIDENCIA */}
        <section>
          <h3 className="text-lg font-display font-semibold text-[#1C1917] border-b border-[#D6CEBE] pb-2 mb-3 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#78350F]" />
            07. Preguntas a la Evidencia
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 border border-[#D6CEBE] rounded">
              <strong className="text-[#78350F] block mb-1">
                ¿Qué evidencia permite sostener esta interpretación?
              </strong>
              <p className="text-[#292524]">{report.preguntasEvidencia.evidenciaSostener}</p>
            </div>
            <div className="p-3 border border-[#D6CEBE] rounded">
              <strong className="text-[#78350F] block mb-1">
                ¿Qué información falta?
              </strong>
              <p className="text-[#292524]">{report.preguntasEvidencia.informacionFalta}</p>
            </div>
            <div className="p-3 border border-[#D6CEBE] rounded">
              <strong className="text-[#78350F] block mb-1">
                ¿Qué otros materiales deberían buscarse?
              </strong>
              <p className="text-[#292524]">{report.preguntasEvidencia.otrosMateriales}</p>
            </div>
            <div className="p-3 border border-[#D6CEBE] rounded">
              <strong className="text-[#78350F] block mb-1">
                ¿Qué relación espacial existe?
              </strong>
              <p className="text-[#292524]">{report.preguntasEvidencia.relacionEspacial}</p>
            </div>
            <div className="p-3 border border-[#D6CEBE] rounded">
              <strong className="text-[#78350F] block mb-1">
                ¿La asociación está documentada o es una hipótesis?
              </strong>
              <p className="text-[#292524]">{report.preguntasEvidencia.asociacionEstado}</p>
            </div>
            <div className="p-3 border border-[#D6CEBE] rounded">
              <strong className="text-[#78350F] block mb-1">
                ¿Qué análisis especializado sería necesario?
              </strong>
              <p className="text-[#292524]">{report.preguntasEvidencia.analisisEspecializado}</p>
            </div>
          </div>
        </section>

        {/* Section 8: REFERENCIAS APA 7 */}
        <section>
          <h3 className="text-lg font-display font-semibold text-[#1C1917] border-b border-[#D6CEBE] pb-2 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#78350F]" />
            08. Referencias Bibliográficas (Formato APA 7)
          </h3>
          {report.referencias.length > 0 ? (
            <div className="space-y-2 text-xs text-[#292524]">
              {report.referencias.map((r, idx) => (
                <div key={idx} className="pl-6 -indent-6 leading-relaxed">
                  {r.citaCompletaAPA7 ||
                    `${r.autor} (${r.anio}). ${r.titulo}. ${r.publicacion}${
                      r.pagina ? `, ${r.pagina}` : ''
                    }.`}{' '}
                  {r.enlace && r.enlace.startsWith('http') && (
                    <a
                      href={r.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#78350F] underline inline-flex items-center gap-0.5 indent-0"
                    >
                      {r.enlace} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#57534E] italic">
              No se han registrado fuentes bibliográficas externas adicionales en este informe.
            </p>
          )}
        </section>

        <footer className="border-t border-[#D6CEBE] pt-4 text-[11px] text-[#57534E] flex flex-wrap justify-between gap-2">
          <span>
            ArqueoIA 3.0 — Herramienta de apoyo al análisis arqueológico. No reemplaza el criterio profesional del arqueólogo.
          </span>
          <span>Protocolo de Seguridad contra Alucinaciones Verificado</span>
        </footer>
      </article>
    </div>
  );
};
