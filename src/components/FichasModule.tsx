import React, { useState } from 'react';
import {
  AnyFichaRecord,
  FichaCategory,
  CeramicFicha,
  TextileFicha,
  LithicFicha,
  BoneFicha,
  ArchitectureFicha,
  AssociationField,
  AIAnalysisResult,
} from '../types/archaeology';
import { AssociationSelector, PhotoUploader, AnalysisResultView } from './CommonBlocks';
import { DEMO_IMAGES } from '../data/demoData';
import {
  Save,
  Sparkles,
  AlertTriangle,
  FileText,
  Trash2,
  Eye,
  RotateCcw,
} from 'lucide-react';

interface FichasModuleProps {
  fichas: AnyFichaRecord[];
  onSaveFicha: (ficha: AnyFichaRecord) => void;
  onDeleteFicha: (id: string) => void;
  onCreateReportFromFicha: (ficha: AnyFichaRecord) => void;
}

const DEFAULT_ASSOCIATION: AssociationField = {
  items: [],
  tipoRelacion: 'Documentada en contexto estratigráfico',
  detalleAsociacion: '',
};

export const FichasModule: React.FC<FichasModuleProps> = ({
  fichas,
  onSaveFicha,
  onDeleteFicha,
  onCreateReportFromFicha,
}) => {
  const [activeTab, setActiveTab] = useState<FichaCategory>('Cerámica');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AIAnalysisResult | null>(null);
  const [currentIsDemo, setCurrentIsDemo] = useState<boolean>(false);

  // 1. CERÁMICA STATE
  const [ceramic, setCeramic] = useState<Omit<CeramicFicha, 'id' | 'tipoFicha' | 'createdAt'>>({
    codigo: 'CER-2026-001',
    sitio: '',
    contexto: '',
    forma: '',
    tipoFragmento: '',
    pasta: '',
    temperante: '',
    coccion: '',
    color: '',
    superficie: '',
    acabado: '',
    tecnicaManufactura: '',
    decoracion: '',
    motivos: '',
    dimensiones: '',
    grosor: '',
    conservacion: '',
    posibleFuncion: '',
    asociacionCultural: '',
    cronologia: '',
    observaciones: '',
    asociadoA: { ...DEFAULT_ASSOCIATION },
    fotografia: '',
  });

  // 2. TEXTIL STATE
  const [textile, setTextile] = useState<Omit<TextileFicha, 'id' | 'tipoFicha' | 'createdAt'>>({
    codigo: 'TEX-2026-001',
    sitio: '',
    contexto: '',
    fibra: '',
    tecnica: '',
    estructura: '',
    tejido: '',
    color: '',
    decoracion: '',
    motivos: '',
    dimensiones: '',
    conservacion: '',
    tecnicaElaboracion: '',
    posibleFuncion: '',
    asociacionCultural: '',
    observaciones: '',
    asociadoA: { ...DEFAULT_ASSOCIATION },
    fotografia: '',
  });

  // 3. LÍTICO STATE
  const [lithic, setLithic] = useState<Omit<LithicFicha, 'id' | 'tipoFicha' | 'createdAt'>>({
    codigo: 'LIT-2026-001',
    sitio: '',
    materiaPrima: '',
    tipoRoca: '',
    tecnicaTalla: '',
    modificacion: '',
    forma: '',
    dimensiones: '',
    bordes: '',
    superficie: '',
    huellasUso: '',
    posibleFuncion: '',
    conservacion: '',
    contexto: '',
    asociacion: '',
    asociadoA: { ...DEFAULT_ASSOCIATION },
    fotografia: '',
  });

  // 4. RESTOS ÓSEOS STATE
  const [bone, setBone] = useState<Omit<BoneFicha, 'id' | 'tipoFicha' | 'createdAt'>>({
    codigo: 'OSE-2026-001',
    sitio: '',
    contexto: '',
    elementoAnatomico: '',
    lateralidad: '',
    identificacionPreliminarEspecie: '',
    conservacion: '',
    medidas: '',
    modificaciones: '',
    marcas: '',
    observaciones: '',
    asociadoA: { ...DEFAULT_ASSOCIATION },
    fotografia: '',
  });

  // 5. ARQUITECTURA STATE
  const [arch, setArch] = useState<Omit<ArchitectureFicha, 'id' | 'tipoFicha' | 'createdAt'>>({
    codigo: 'ARQ-2026-001',
    sitio: '',
    estructura: '',
    tipo: '',
    formaPlanta: '',
    materiales: '',
    tecnicaConstructiva: '',
    muros: '',
    accesos: '',
    orientacion: '',
    distribucion: '',
    relacionEspacial: '',
    conservacion: '',
    visibilidad: '',
    posibleFuncion: '',
    contexto: '',
    asociadoA: { ...DEFAULT_ASSOCIATION },
    fotografia: '',
  });

  const loadDemoForCurrentTab = () => {
    setErrorMessage(null);
    setCurrentIsDemo(true);
    if (activeTab === 'Cerámica') {
      setCeramic({
        codigo: 'DEMO-CER-2026-001',
        sitio: '[DATOS DE DEMOSTRACIÓN] Sector Kancha-Pampa',
        contexto: 'Unidad 02, Capa B, Nivel 2 (Ceniza compacta sobre piso apisonado)',
        forma: 'Cántaro de cuello estrecho y cuerpo globular (posible aríbalo / urpu)',
        tipoFragmento: 'Borde evertido y cuello superior diagnóstico',
        pasta: 'Textura fina a media, fractura regular compacta',
        temperante: 'Inclusiones minerales de cuarzo subangular y feldespato (< 0.5 mm, 10%)',
        coccion: 'Oxidante completa, núcleo homogéneo',
        color: 'Pasta: 2.5YR 5/6 (rojo); Engobe: 10R 4/6 (rojo oscuro) y 7.5YR 2.5/1 (negro)',
        superficie: 'Engobada en cara externa y labio interno',
        acabado: 'Bruñido horizontal fino en exterior; alisado regular en interior',
        tecnicaManufactura: 'Enrollamiento (acordelado) y alisado continuo',
        decoracion: 'Pintura policroma precocción (negro y crema sobre rojo)',
        motivos: 'Bandas horizontales con hileras de rombos concéntricos y reticulado fino',
        dimensiones: '84 mm x 62 mm; Diámetro estimado de boca: 160 mm',
        grosor: '6.5 mm en pared de cuerpo; 8.2 mm en labio',
        conservacion: 'Buena; sin exfoliación ni sales activas',
        posibleFuncion: 'Hipótesis: Contención y servicio de líquidos',
        asociacionCultural: 'Estilo Inca Provincial / Horizonte Tardío (preliminar)',
        cronologia: 'Horizonte Tardío (ca. 1450–1532 d.C. — estimación tipológica)',
        observaciones: 'DATOS DE DEMOSTRACIÓN — Registro pedagógico de prueba.',
        asociadoA: {
          items: ['arquitectura', 'restos óseos', 'estructuras'],
          tipoRelacion: 'Documentada en contexto estratigráfico',
          detalleAsociacion: 'En lente de ceniza Capa B junto a restos faunísticos y muro norte.',
        },
        fotografia: DEMO_IMAGES.ceramicAryballos,
      });
    } else if (activeTab === 'Textil') {
      setTextile({
        codigo: 'DEMO-TEX-2026-001',
        sitio: '[DATOS DE DEMOSTRACIÓN] Abrigo Seco Chuquibamba',
        contexto: 'Unidad 01, Estrato II (Matriz seca arenosa en fardo alterado)',
        fibra: 'Fibra animal (posible camélido sudamericano — requiere microscopía de fibras)',
        tecnica: 'Faz de urdimbre con listas policromas',
        estructura: 'Tejido llano 1/1 balanceado en bordes y faz de urdimbre en campo central',
        tejido: 'Torsión en Z e hilado en S (2z-S), densidad 18 urdimbres x 7 tramas por cm',
        color: 'Ocre tierra, marrón oscuro natural, rojo carmín y beige natural',
        decoracion: 'Listas verticales alternadas y peinecillo en transición de color',
        motivos: 'Bandas longitudinales simétricas y grecas escalonadas menores',
        dimensiones: '245 mm (longitud de urdimbre) x 180 mm (ancho de trama conservado)',
        conservacion: 'Regular; bordes laterales con orillo conservado, pérdida parcial en extremo inferior',
        tecnicaElaboracion: 'Telar de cintura con lizos manuales y acabado de orillos reforzados',
        posibleFuncion: 'Hipótesis funcional: Fragmento de bolsa ceremonial (chuspa) o paño contenedor',
        asociacionCultural: 'Tradición Textil Centro-Sur Andina (Horizonte Tardío — preliminar)',
        observaciones: 'DATOS DE DEMOSTRACIÓN — No constituye un registro arqueológico verificado.',
        asociadoA: {
          items: ['cerámica', 'restos óseos', 'estructuras'],
          tipoRelacion: 'Documentada en contexto estratigráfico',
          detalleAsociacion: 'Asociado a cestería vegetal y fragmentería cerámica en cámara funeraria.',
        },
        fotografia: '',
      });
    } else if (activeTab === 'Lítico') {
      setLithic({
        codigo: 'DEMO-LIT-2026-002',
        sitio: '[DATOS DE DEMOSTRACIÓN] Abrigo Rocoso Yanacocha',
        materiaPrima: 'Obsidiana translúcida con bandeado grisáceo',
        tipoRoca: 'Vidrio volcánico riolítico',
        tecnicaTalla: 'Percusión blanda bifacial y retoque marginal por presión',
        modificacion: 'Adelgazamiento bifacial completo y base escotada',
        forma: 'Punta de proyectil triangular de base cóncava',
        dimensiones: 'Longitud: 38.4 mm; Ancho: 19.2 mm; Espesor: 5.1 mm; Peso: 3.8 g',
        bordes: 'Bordes convergentes simétricos con micro-retoque continuo',
        superficie: 'Negativos de lascado laminares en ambas caras, 0% córtex',
        huellasUso: 'Micro-desprendimiento escalonado en ápice distal (requiere traceología microscópica)',
        posibleFuncion: 'Hipótesis funcional: Cabezal de proyectil enmangado',
        conservacion: 'Buena (95% íntegra)',
        contexto: 'Cuadrícula A3, Estrato III',
        asociacion: 'Desechos de talla (microlascas) y fauna fragmentada',
        asociadoA: {
          items: ['líticos', 'restos óseos', 'fuentes de agua'],
          tipoRelacion: 'Documentada en contexto estratigráfico',
          detalleAsociacion: 'Recuperada en el nivel ocupacional III junto a lascas de retoque.',
        },
        fotografia: DEMO_IMAGES.lithicProjectile,
      });
    } else if (activeTab === 'Restos óseos') {
      setBone({
        codigo: 'DEMO-OSE-2026-003',
        sitio: '[DATOS DE DEMOSTRACIÓN] Sector Kancha-Pampa',
        contexto: 'Unidad 02, Capa B, Rasgo 04 (Lente de ceniza)',
        elementoAnatomico: 'Epífisis proximal y diáfisis parcial de metatarso',
        lateralidad: 'Derecha (preliminar)',
        identificacionPreliminarEspecie:
          'Identificación preliminar: Orden Artiodactyla, cf. Familia Camelidae (requiere colección comparativa y osteometría especializada)',
        conservacion: 'Regular; meteorización estadio 1, fractura longitudinal en diáfisis',
        medidas: 'Longitud conservada: 112 mm; Ancho proximal (Bp): 28.4 mm; Profundidad (Dp): 26.1 mm',
        modificaciones: 'Termoalteración parcial (coloración pardo-negruzca en extremo distal)',
        marcas: 'Tres trazos lineales finos transversales en la diáfisis (posible huella de descarne)',
        observaciones:
          'DATOS DE DEMOSTRACIÓN — La identificación taxonómica es estrictamente preliminar.',
        asociadoA: {
          items: ['cerámica', 'arquitectura', 'otros materiales o espacios'],
          tipoRelacion: 'Documentada en contexto estratigráfico',
          detalleAsociacion: 'En lente de ceniza junto a alfarería utilitaria y carbón.',
        },
        fotografia: '',
      });
    } else if (activeTab === 'Arquitectura') {
      setArch({
        codigo: 'DEMO-ARQ-2026-004',
        sitio: '[DATOS DE DEMOSTRACIÓN] Sector Kancha-Pampa',
        estructura: 'Recinto E-01 (Estructura alargada tipo Kallanka frente a plaza)',
        tipo: 'Arquitectura pública / administrativa (hipótesis tipológica)',
        formaPlanta: 'Rectangular alargada (24.5 m x 8.2 m)',
        materiales: 'Bloques de andesita canteada y argamasa de barro con inclusiones de grava',
        tecnicaConstructiva: 'Mampostería concertada de hiladas regulares con ligero desplome interno (inclinación)',
        muros: 'Doble paramento con núcleo de ripio; espesor promedio 0.85 m; altura conservada 2.40 m',
        accesos: 'Tres vanos trapezoidales equidistantes abiertos hacia la fachada oriental (plaza)',
        orientacion: 'Eje longitudinal N 15° E; fachada abierta hacia el Este-Sureste (Azimut 105°)',
        distribucion: 'Espacio interno diáfano sin subdivisiones permanentes registradas en superficie',
        relacionEspacial: 'Preside el flanco oeste de la plaza central y se articula con el acceso del camino principal',
        conservacion: 'Regular; colapso parcial de cabeceras de muro y pérdida de hastiales',
        visibilidad: 'Alta visibilidad desde la explanada central y el tramo de ingreso vial',
        posibleFuncion: 'Hipótesis funcional: Espacio techado para congregación o actividades administrativas',
        contexto: 'Sector Central A, Terraza Superior',
        asociadoA: {
          items: ['cerámica', 'arquitectura', 'caminos', 'áreas ceremoniales', 'cerros'],
          tipoRelacion: 'Observada en superficie (Hipótesis espacial)',
          detalleAsociacion: 'Articulada directamente a la plaza trapezoidal y al eje vial.',
        },
        fotografia: DEMO_IMAGES.incaArchitecture,
      });
    }
  };

  const buildCurrentRecordObject = (): AnyFichaRecord => {
    const id = `${activeTab.toLowerCase().slice(0, 3)}-${Date.now()}`;
    const createdAt = new Date().toISOString().split('T')[0];

    if (activeTab === 'Cerámica') {
      return {
        id,
        tipoFicha: 'Cerámica',
        isDemo: currentIsDemo || ceramic.codigo.startsWith('DEMO'),
        createdAt,
        ...ceramic,
        analisisIA: currentAnalysis || undefined,
      };
    }
    if (activeTab === 'Textil') {
      return {
        id,
        tipoFicha: 'Textil',
        isDemo: currentIsDemo || textile.codigo.startsWith('DEMO'),
        createdAt,
        ...textile,
        analisisIA: currentAnalysis || undefined,
      };
    }
    if (activeTab === 'Lítico') {
      return {
        id,
        tipoFicha: 'Lítico',
        isDemo: currentIsDemo || lithic.codigo.startsWith('DEMO'),
        createdAt,
        ...lithic,
        analisisIA: currentAnalysis || undefined,
      };
    }
    if (activeTab === 'Restos óseos') {
      return {
        id,
        tipoFicha: 'Restos óseos',
        isDemo: currentIsDemo || bone.codigo.startsWith('DEMO'),
        createdAt,
        ...bone,
        analisisIA: currentAnalysis || undefined,
      };
    }
    return {
      id,
      tipoFicha: 'Arquitectura',
      isDemo: currentIsDemo || arch.codigo.startsWith('DEMO'),
      createdAt,
      ...arch,
      analisisIA: currentAnalysis || undefined,
    };
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const record = buildCurrentRecordObject();
    onSaveFicha(record);
    setSaveSuccess(`Ficha de ${activeTab} (${record.codigo}) guardada correctamente en el catálogo.`);
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  const handleAnalyzeWithAI = async () => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const record = buildCurrentRecordObject();
      const { fotografia, analisisIA, ...cleanData } = record;
      const response = await fetch('/api/archaeology/analyze-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordType: activeTab,
          recordData: cleanData,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al analizar la ficha con IA.');
      }
      setCurrentAnalysis(data.result);
    } catch (err: any) {
      setErrorMessage(err.message || 'No se pudo completar el análisis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderField = (
    label: string,
    value: string,
    onChange: (val: string) => void,
    placeholder = '',
    multiline = false
  ) => (
    <div>
      <label className="block text-xs font-semibold text-[#44403C] mb-1">
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
        />
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header & Category Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#D6CEBE] pb-5">
        <div>
          <div className="text-xs text-[#78350F] font-medium mb-1">
            Módulo 06 y 07 · Catalogación Normalizada de Evidencia Material
          </div>
          <h2 className="text-3xl font-display font-semibold text-[#1C1917]">
            Fichas Arqueológicas Especializadas
          </h2>
          <p className="text-sm text-[#57534E] mt-1 max-w-2xl">
            Seleccione el tipo de material para abrir el formulario técnico correspondiente. Todas las fichas integran el registro de asociación contextual y generación de preguntas a la evidencia.
          </p>
        </div>

        {/* Interactive Category Switcher */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#EBE6DF] rounded border border-[#D6CEBE]">
          {(
            ['Cerámica', 'Textil', 'Lítico', 'Restos óseos', 'Arquitectura'] as FichaCategory[]
          ).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveTab(cat);
                setCurrentAnalysis(null);
                setErrorMessage(null);
              }}
              className={`px-3.5 py-2 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                activeTab === cat
                  ? 'bg-[#78350F] text-[#FBF9F5]'
                  : 'text-[#44403C] hover:text-[#1C1917]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSave}
        className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-6 space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D6CEBE] pb-4">
          <div>
            <h3 className="text-xl font-display font-semibold text-[#1C1917]">
              Ficha Técnica de {activeTab}
            </h3>
            <p className="text-xs text-[#57534E]">
              Complete los atributos observados. Si un atributo es desconocido, indíquelo sin asumir datos no verificados.
            </p>
          </div>
          <button
            type="button"
            onClick={loadDemoForCurrentTab}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#EBE6DF] hover:bg-[#D6CEBE] text-[#292524] rounded transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#78350F]" />
            Cargar ejemplo de demostración ({activeTab})
          </button>
        </div>

        {/* Mandatory Osteological Warning when "Restos óseos" is active */}
        {activeTab === 'Restos óseos' && (
          <div className="p-4 bg-[#FEF3C7]/70 border-l-4 border-[#B45309] rounded-r text-xs text-[#78350F] flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 text-[#B45309] mt-0.5" />
            <div>
              <strong className="font-semibold block text-sm mb-0.5">
                Protocolo de Cautela Taxonómica y Osteológica (Restos Óseos)
              </strong>
              Toda identificación de especie o taxón se registra y presenta únicamente como{' '}
              <strong>"Identificación preliminar"</strong>. Su confirmación definitiva requiere evaluación especializada bioantropológica o zooarqueológica presencial con colección osteológica de referencia en laboratorio.
            </div>
          </div>
        )}

        {/* 1. CERÁMICA FIELDS */}
        {activeTab === 'Cerámica' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderField('Código', ceramic.codigo, (v) => setCeramic({ ...ceramic, codigo: v }), 'Ej. CER-2026-001')}
              {renderField('Sitio', ceramic.sitio, (v) => setCeramic({ ...ceramic, sitio: v }), 'Nombre del sitio')}
              {renderField('Contexto', ceramic.contexto, (v) => setCeramic({ ...ceramic, contexto: v }), 'Unidad, capa, nivel, rasgo')}
              {renderField('Forma', ceramic.forma, (v) => setCeramic({ ...ceramic, forma: v }), 'Abierta/cerrada, cántaro, cuenco...')}
              {renderField('Tipo de fragmento', ceramic.tipoFragmento, (v) => setCeramic({ ...ceramic, tipoFragmento: v }), 'Borde, cuerpo, base, asa...')}
              {renderField('Pasta', ceramic.pasta, (v) => setCeramic({ ...ceramic, pasta: v }), 'Textura, compactación, fractura')}
              {renderField('Temperante (Desgrasante)', ceramic.temperante, (v) => setCeramic({ ...ceramic, temperante: v }), 'Mineral, cuarzo, mica, granulometría')}
              {renderField('Cocción', ceramic.coccion, (v) => setCeramic({ ...ceramic, coccion: v }), 'Oxidante, reductora, incompleta')}
              {renderField('Color (Munsell / Descriptivo)', ceramic.color, (v) => setCeramic({ ...ceramic, color: v }), 'Ej. 2.5YR 5/6 rojo')}
              {renderField('Superficie', ceramic.superficie, (v) => setCeramic({ ...ceramic, superficie: v }), 'Engobada, sin engobe, ahumada')}
              {renderField('Acabado', ceramic.acabado, (v) => setCeramic({ ...ceramic, acabado: v }), 'Alisado, bruñido, pulido, escobillado')}
              {renderField('Técnica de manufactura', ceramic.tecnicaManufactura, (v) => setCeramic({ ...ceramic, tecnicaManufactura: v }), 'Modelado, enrollado, moldeado')}
              {renderField('Decoración', ceramic.decoracion, (v) => setCeramic({ ...ceramic, decoracion: v }), 'Pintada, incisa, aplicada, excisa')}
              {renderField('Motivos', ceramic.motivos, (v) => setCeramic({ ...ceramic, motivos: v }), 'Geométricos, bandas, antropomorfos...')}
              {renderField('Dimensiones', ceramic.dimensiones, (v) => setCeramic({ ...ceramic, dimensiones: v }), 'Largo, ancho, diámetro de boca (mm)')}
              {renderField('Grosor', ceramic.grosor, (v) => setCeramic({ ...ceramic, grosor: v }), 'Espesor de pared en mm')}
              {renderField('Conservación', ceramic.conservacion, (v) => setCeramic({ ...ceramic, conservacion: v }), 'Buena, regular, erosionada, sales')}
              {renderField('Posible función (Hipótesis)', ceramic.posibleFuncion, (v) => setCeramic({ ...ceramic, posibleFuncion: v }), 'Cocción, servicio, almacenamiento...')}
              {renderField('Asociación cultural (Preliminar)', ceramic.asociacionCultural, (v) => setCeramic({ ...ceramic, asociacionCultural: v }), 'Estilo o tradición alfarera')}
              {renderField('Cronología', ceramic.cronologia, (v) => setCeramic({ ...ceramic, cronologia: v }), 'Periodo o fechamiento asociado')}
            </div>
            {renderField('Observaciones', ceramic.observaciones, (v) => setCeramic({ ...ceramic, observaciones: v }), 'Anotaciones técnicas adicionales, hollín, reparaciones...', true)}
            <AssociationSelector
              value={ceramic.asociadoA}
              onChange={(asociadoA) => setCeramic({ ...ceramic, asociadoA })}
            />
            <PhotoUploader
              value={ceramic.fotografia}
              onChange={(fotografia) => setCeramic({ ...ceramic, fotografia })}
              label="Fotografía de la pieza o fragmento cerámico"
            />
          </div>
        )}

        {/* 2. TEXTIL FIELDS */}
        {activeTab === 'Textil' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderField('Código', textile.codigo, (v) => setTextile({ ...textile, codigo: v }), 'Ej. TEX-2026-001')}
              {renderField('Sitio', textile.sitio, (v) => setTextile({ ...textile, sitio: v }), 'Nombre del sitio')}
              {renderField('Contexto', textile.contexto, (v) => setTextile({ ...textile, contexto: v }), 'Unidad, estrato, fardo o rasgo')}
              {renderField('Fibra', textile.fibra, (v) => setTextile({ ...textile, fibra: v }), 'Algodón, camélido, vegetal (preliminar)')}
              {renderField('Técnica', textile.tecnica, (v) => setTextile({ ...textile, tecnica: v }), 'Faz de urdimbre, tapiz, gasa, brocado')}
              {renderField('Estructura', textile.estructura, (v) => setTextile({ ...textile, estructura: v }), 'Tejido llano 1/1, sarga, complementario')}
              {renderField('Tejido (Hilado y Torsión)', textile.tejido, (v) => setTextile({ ...textile, tejido: v }), ' Torsión Z/S, densidad por cm²')}
              {renderField('Color', textile.color, (v) => setTextile({ ...textile, color: v }), 'Tintes observados y tonos naturales')}
              {renderField('Decoración', textile.decoracion, (v) => setTextile({ ...textile, decoracion: v }), 'Listas, bordado, teñido por reserva')}
              {renderField('Motivos', textile.motivos, (v) => setTextile({ ...textile, motivos: v }), 'Grecas, tocapus, zoomorfos, bandas')}
              {renderField('Dimensiones', textile.dimensiones, (v) => setTextile({ ...textile, dimensiones: v }), 'Largo de urdimbre x ancho de trama (mm)')}
              {renderField('Conservación', textile.conservacion, (v) => setTextile({ ...textile, conservacion: v }), 'Integridad de fibras, faltantes, fragilidad')}
              {renderField('Técnica de elaboración', textile.tecnicaElaboracion, (v) => setTextile({ ...textile, tecnicaElaboracion: v }), 'Telar de cintura, estacas, agujas')}
              {renderField('Posible función (Hipótesis)', textile.posibleFuncion, (v) => setTextile({ ...textile, posibleFuncion: v }), 'Unku, manta, chuspa, envoltorio')}
              {renderField('Asociación cultural (Preliminar)', textile.asociacionCultural, (v) => setTextile({ ...textile, asociacionCultural: v }), 'Filiación estilística tentativa')}
            </div>
            {renderField('Observaciones', textile.observaciones, (v) => setTextile({ ...textile, observaciones: v }), 'Orillos, costuras de unión, reparaciones antiguas...', true)}
            <AssociationSelector
              value={textile.asociadoA}
              onChange={(asociadoA) => setTextile({ ...textile, asociadoA })}
            />
            <PhotoUploader
              value={textile.fotografia}
              onChange={(fotografia) => setTextile({ ...textile, fotografia })}
              label="Fotografía del espécimen textil"
            />
          </div>
        )}

        {/* 3. LÍTICO FIELDS */}
        {activeTab === 'Lítico' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderField('Código', lithic.codigo, (v) => setLithic({ ...lithic, codigo: v }), 'Ej. LIT-2026-001')}
              {renderField('Sitio', lithic.sitio, (v) => setLithic({ ...lithic, sitio: v }), 'Nombre del sitio')}
              {renderField('Materia prima', lithic.materiaPrima, (v) => setLithic({ ...lithic, materiaPrima: v }), 'Obsidiana, sílex, cuarcita, basalto')}
              {renderField('Tipo de roca', lithic.tipoRoca, (v) => setLithic({ ...lithic, tipoRoca: v }), 'Ígnea volcánica, sedimentaria silícea...')}
              {renderField('Técnica de talla', lithic.tecnicaTalla, (v) => setLithic({ ...lithic, tecnicaTalla: v }), 'Percusión directa dura/blanda, presión')}
              {renderField('Modificación', lithic.modificacion, (v) => setLithic({ ...lithic, modificacion: v }), 'Unifacial, bifacial, retoque marginal, pulido')}
              {renderField('Forma', lithic.forma, (v) => setLithic({ ...lithic, forma: v }), 'Foliácea, triangular, lasca, núcleo, raspador')}
              {renderField('Dimensiones', lithic.dimensiones, (v) => setLithic({ ...lithic, dimensiones: v }), 'Longitud, ancho, espesor (mm) y peso (g)')}
              {renderField('Bordes', lithic.bordes, (v) => setLithic({ ...lithic, bordes: v }), 'Ángulo de filo, simetría, denticulado')}
              {renderField('Superficie', lithic.superficie, (v) => setLithic({ ...lithic, superficie: v }), 'Porcentaje de córtex, pátina, negativos')}
              {renderField('Huellas de uso', lithic.huellasUso, (v) => setLithic({ ...lithic, huellasUso: v }), 'Microlascados, lustre, estrías, fractura impacto')}
              {renderField('Posible función (Hipótesis)', lithic.posibleFuncion, (v) => setLithic({ ...lithic, posibleFuncion: v }), 'Proyectil, corte, raspado, molienda')}
              {renderField('Conservación', lithic.conservacion, (v) => setLithic({ ...lithic, conservacion: v }), 'Completo, fracturado distal/proximal')}
              {renderField('Contexto', lithic.contexto, (v) => setLithic({ ...lithic, contexto: v }), 'Unidad, cuadrícula, estrato')}
              {renderField('Asociación directa', lithic.asociacion, (v) => setLithic({ ...lithic, asociacion: v }), 'Desechos de talla, fogón, fauna...')}
            </div>
            <AssociationSelector
              value={lithic.asociadoA}
              onChange={(asociadoA) => setLithic({ ...lithic, asociadoA })}
            />
            <PhotoUploader
              value={lithic.fotografia}
              onChange={(fotografia) => setLithic({ ...lithic, fotografia })}
              label="Fotografía del artefacto lítico"
            />
          </div>
        )}

        {/* 4. RESTOS ÓSEOS FIELDS */}
        {activeTab === 'Restos óseos' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderField('Código', bone.codigo, (v) => setBone({ ...bone, codigo: v }), 'Ej. OSE-2026-001')}
              {renderField('Sitio', bone.sitio, (v) => setBone({ ...bone, sitio: v }), 'Nombre del sitio')}
              {renderField('Contexto', bone.contexto, (v) => setBone({ ...bone, contexto: v }), 'Unidad, estrato, rasgo funerario o doméstico')}
              {renderField('Elemento anatómico', bone.elementoAnatomico, (v) => setBone({ ...bone, elementoAnatomico: v }), 'Fémur, metatarso, cráneo, vértebra...')}
              {renderField('Lateralidad', bone.lateralidad, (v) => setBone({ ...bone, lateralidad: v }), 'Izquierda, derecha, axial o indeterminada')}
              {renderField(
                'Identificación preliminar de especie / taxón',
                bone.identificacionPreliminarEspecie,
                (v) => setBone({ ...bone, identificacionPreliminarEspecie: v }),
                'SOLO IDENTIFICACIÓN PRELIMINAR (Requiere evaluación especializada)'
              )}
              {renderField('Conservación', bone.conservacion, (v) => setBone({ ...bone, conservacion: v }), 'Estadio de meteorización, integridad')}
              {renderField('Medidas osteométricas', bone.medidas, (v) => setBone({ ...bone, medidas: v }), 'Longitud máxima, ancho epifisario (mm)')}
              {renderField('Modificaciones (Culturales / Tafonómicas)', bone.modificaciones, (v) => setBone({ ...bone, modificaciones: v }), 'Termoalteración, formatización, pulido')}
              {renderField('Marcas en superficie', bone.marcas, (v) => setBone({ ...bone, marcas: v }), 'Huellas de corte, percusión, carnívoros, raíces')}
            </div>
            {renderField(
              'Observaciones (Advertir requerimientos de evaluación especializada)',
              bone.observaciones,
              (v) => setBone({ ...bone, observaciones: v }),
              'Fusión epifisaria, patologías observables, requerimiento de análisis bioantropológico o zooarqueológico...',
              true
            )}
            <AssociationSelector
              value={bone.asociadoA}
              onChange={(asociadoA) => setBone({ ...bone, asociadoA })}
            />
            <PhotoUploader
              value={bone.fotografia}
              onChange={(fotografia) => setBone({ ...bone, fotografia })}
              label="Fotografía del elemento óseo"
            />
          </div>
        )}

        {/* 5. ARQUITECTURA FIELDS */}
        {activeTab === 'Arquitectura' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderField('Código', arch.codigo, (v) => setArch({ ...arch, codigo: v }), 'Ej. ARQ-2026-001')}
              {renderField('Sitio', arch.sitio, (v) => setArch({ ...arch, sitio: v }), 'Nombre del sitio')}
              {renderField('Estructura', arch.estructura, (v) => setArch({ ...arch, estructura: v }), 'Nombre o número del recinto / edificio')}
              {renderField('Tipo', arch.tipo, (v) => setArch({ ...arch, tipo: v }), 'Recinto, terraza, plataforma, kallanka, chullpa')}
              {renderField('Forma / Planta', arch.formaPlanta, (v) => setArch({ ...arch, formaPlanta: v }), 'Rectangular, circular, trapezoidal, en D')}
              {renderField('Materiales', arch.materiales, (v) => setArch({ ...arch, materiales: v }), 'Piedra canteada, adobe, tapial, mortero de barro')}
              {renderField('Técnica constructiva', arch.tecnicaConstructiva, (v) => setArch({ ...arch, tecnicaConstructiva: v }), 'Mampostería ordinaria, concertada, almohadillada')}
              {renderField('Muros', arch.muros, (v) => setArch({ ...arch, muros: v }), 'Espesor, altura conservada, doble paramento, hornacinas')}
              {renderField('Accesos (Vanos)', arch.accesos, (v) => setArch({ ...arch, accesos: v }), 'Forma de vanos, ancho, dinteles, doble jamba')}
              {renderField('Orientación', arch.orientacion, (v) => setArch({ ...arch, orientacion: v }), 'Azimut del eje mayor y orientación de vanos')}
              {renderField('Distribución interna', arch.distribucion, (v) => setArch({ ...arch, distribucion: v }), 'Subdivisiones, banquetas, patios conectados')}
              {renderField('Relación espacial', arch.relacionEspacial, (v) => setArch({ ...arch, relacionEspacial: v }), 'Articulación con plazas, caminos u otros sectores')}
              {renderField('Conservación', arch.conservacion, (v) => setArch({ ...arch, conservacion: v }), 'Desplomes, pérdida de cabeceras, grietas')}
              {renderField('Visibilidad', arch.visibilidad, (v) => setArch({ ...arch, visibilidad: v }), 'Dominio visual desde y hacia la estructura')}
              {renderField('Posible función (Hipótesis)', arch.posibleFuncion, (v) => setArch({ ...arch, posibleFuncion: v }), 'Doméstica, almacenamiento, administrativa, ritual')}
              {renderField('Contexto', arch.contexto, (v) => setArch({ ...arch, contexto: v }), 'Sector, terraza, emplazamiento topográfico')}
            </div>
            <AssociationSelector
              value={arch.asociadoA}
              onChange={(asociadoA) => setArch({ ...arch, asociadoA })}
            />
            <PhotoUploader
              value={arch.fotografia}
              onChange={(fotografia) => setArch({ ...arch, fotografia })}
              label="Fotografía de la estructura arquitectónica"
            />
          </div>
        )}

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#D6CEBE]">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#1C1917] text-[#FBF9F5] rounded hover:bg-[#292524] transition-colors whitespace-nowrap"
            >
              <Save className="w-4 h-4" />
              Guardar ficha ({activeTab})
            </button>

            <button
              type="button"
              disabled={isAnalyzing}
              onClick={handleAnalyzeWithAI}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-[#78350F] text-[#FBF9F5] rounded hover:bg-[#5C280B] disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              {isAnalyzing
                ? 'Analizando evidencia y generando preguntas...'
                : 'Analizar Ficha con IA + Preguntas a la Evidencia'}
            </button>
          </div>

          {saveSuccess && (
            <span className="text-xs font-medium text-[#14532D]">
              ✓ {saveSuccess}
            </span>
          )}
          {errorMessage && (
            <span className="text-xs font-medium text-[#9A3412]">
              ⚠ {errorMessage}
            </span>
          )}
        </div>
      </form>

      {/* AI Analysis Result Panel */}
      {currentAnalysis && (
        <AnalysisResultView
          analysis={currentAnalysis}
          title={`Análisis Metodológico de Ficha: ${activeTab}`}
          isDemo={currentIsDemo}
          onGenerateReport={() => {
            const record = buildCurrentRecordObject();
            onCreateReportFromFicha(record);
          }}
        />
      )}

      {/* Catalog of Saved Fichas */}
      <div className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-[#D6CEBE] pb-3">
          <div>
            <h3 className="text-xl font-display font-semibold text-[#1C1917]">
              Catálogo de Fichas Arqueológicas Registradas ({fichas.length})
            </h3>
            <p className="text-xs text-[#57534E]">
              Registros almacenados en la sesión actual · Incluye ejemplos marcados como DATOS DE DEMOSTRACIÓN
            </p>
          </div>
        </div>

        {fichas.length === 0 ? (
          <p className="text-sm text-[#57534E] py-4">
            No hay fichas registradas aún. Complete el formulario superior y pulse "Guardar ficha".
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D6CEBE] text-xs font-semibold text-[#44403C]">
                  <th className="py-2.5 px-3">Código</th>
                  <th className="py-2.5 px-3">Categoría</th>
                  <th className="py-2.5 px-3">Sitio / Contexto</th>
                  <th className="py-2.5 px-3">¿A qué está asociado?</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE6DF] text-xs text-[#292524]">
                {fichas.map((f) => (
                  <tr key={f.id} className="hover:bg-[#F3EFE6]/60">
                    <td className="py-3 px-3 font-mono-tabular font-medium">
                      {f.codigo}
                    </td>
                    <td className="py-3 px-3 font-medium">{f.tipoFicha}</td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-[#1C1917]">{f.sitio || 'Sin sitio'}</div>
                      <div className="text-[#57534E] truncate max-w-xs">{f.contexto}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-[#292524]">
                        {f.asociadoA.items.length > 0
                          ? f.asociadoA.items.join(' · ')
                          : 'Sin asociaciones marcadas'}
                      </div>
                      <div className="text-[#78716C]">{f.asociadoA.tipoRelacion}</div>
                    </td>
                    <td className="py-3 px-3">
                      {f.isDemo ? (
                        <span className="text-[#9A3412] font-semibold">
                          DATOS DE DEMOSTRACIÓN
                        </span>
                      ) : (
                        <span className="text-[#14532D] font-medium">
                          Registro del Investigador
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap space-x-2">
                      {f.analisisIA && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab(f.tipoFicha);
                            setCurrentAnalysis(f.analisisIA || null);
                            setCurrentIsDemo(Boolean(f.isDemo));
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-[#EBE6DF] hover:bg-[#D6CEBE] text-[#1C1917] rounded transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Ver Análisis
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onCreateReportFromFicha(f)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-[#78350F] text-[#FBF9F5] hover:bg-[#5C280B] rounded transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" /> Informe
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteFicha(f.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-[#9A3412] hover:bg-[#EBE6DF] rounded transition-colors"
                        title="Eliminar ficha"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
