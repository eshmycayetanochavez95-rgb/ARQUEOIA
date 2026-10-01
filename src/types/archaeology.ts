export type ModuleId =
  | 'inicio'
  | 'registro-sitio'
  | 'busqueda-sitios'
  | 'coordenadas'
  | 'analisis-foto'
  | 'fichas'
  | 'geografia-sagrada'
  | 'estrategias-inca'
  | 'informe'
  | 'demostracion';

export type FichaCategory =
  | 'Cerámica'
  | 'Textil'
  | 'Lítico'
  | 'Restos óseos'
  | 'Arquitectura';

export type PhotoMaterialCategory =
  | 'Cerámica'
  | 'Textil'
  | 'Lítico'
  | 'Restos óseos'
  | 'Arquitectura'
  | 'Metal'
  | 'Otro';

export const ASSOCIATION_OPTIONS = [
  'cerámica',
  'textiles',
  'líticos',
  'restos óseos',
  'arquitectura',
  'caminos',
  'estructuras',
  'áreas ceremoniales',
  'fuentes de agua',
  'cerros',
  'asentamientos',
  'otros materiales o espacios',
] as const;

export type AssociationOption = (typeof ASSOCIATION_OPTIONS)[number];

export interface AssociationField {
  items: AssociationOption[];
  tipoRelacion: 'Documentada en contexto estratigráfico' | 'Observada en superficie (Hipótesis espacial)' | 'No determinada';
  detalleAsociacion: string;
}

export interface EvidenceQuestions {
  evidenciaSostener: string;
  informacionFalta: string;
  otrosMateriales: string;
  relacionEspacial: string;
  asociacionEstado: string;
  analisisEspecializado: string;
}

export interface APAReference {
  autor: string;
  anio: string;
  titulo: string;
  publicacion: string;
  pagina: string;
  enlace: string;
  citaCompletaAPA7: string;
}

export interface AIAnalysisResult {
  identificacionSintesis?: string;
  identificacionPreliminar?: string;
  categoriaMaterial?: string;
  advertenciaMetodologica?: string;
  datosObservables: string[];
  informacionDocumentada: string[];
  analisisTecnico?: string;
  interpretacion: string[];
  hipotesis: string[];
  evaluacionAsociacion?: string;
  informacionInsuficiente: string[];
  preguntasEvidencia: EvidenceQuestions;
  referenciasAPA: APAReference[];
  groundingLinks?: Array<{ title: string; uri: string }>;
}

export interface SiteRecord {
  id: string;
  isDemo?: boolean;
  createdAt: string;
  nombreSitio: string;
  pais: string;
  region: string;
  provincia: string;
  distrito: string;
  coordenadas: string;
  latitud?: number | null;
  longitud?: number | null;
  altitud: string;
  periodo: string;
  cronologia: string;
  descripcion: string;
  contexto: string;
  observaciones: string;
  evidenciasAsociadas: string;
  asociadoA: AssociationField;
  fotografia: string;
  analisisIA?: AIAnalysisResult;
}

export interface CeramicFicha {
  id: string;
  tipoFicha: 'Cerámica';
  isDemo?: boolean;
  createdAt: string;
  codigo: string;
  sitio: string;
  contexto: string;
  forma: string;
  tipoFragmento: string;
  pasta: string;
  temperante: string;
  coccion: string;
  color: string;
  superficie: string;
  acabado: string;
  tecnicaManufactura: string;
  decoracion: string;
  motivos: string;
  dimensiones: string;
  grosor: string;
  conservacion: string;
  posibleFuncion: string;
  asociacionCultural: string;
  cronologia: string;
  observaciones: string;
  asociadoA: AssociationField;
  fotografia: string;
  analisisIA?: AIAnalysisResult;
}

export interface TextileFicha {
  id: string;
  tipoFicha: 'Textil';
  isDemo?: boolean;
  createdAt: string;
  codigo: string;
  sitio: string;
  contexto: string;
  fibra: string;
  tecnica: string;
  estructura: string;
  tejido: string;
  color: string;
  decoracion: string;
  motivos: string;
  dimensiones: string;
  conservacion: string;
  tecnicaElaboracion: string;
  posibleFuncion: string;
  asociacionCultural: string;
  observaciones: string;
  asociadoA: AssociationField;
  fotografia: string;
  analisisIA?: AIAnalysisResult;
}

export interface LithicFicha {
  id: string;
  tipoFicha: 'Lítico';
  isDemo?: boolean;
  createdAt: string;
  codigo: string;
  sitio: string;
  materiaPrima: string;
  tipoRoca: string;
  tecnicaTalla: string;
  modificacion: string;
  forma: string;
  dimensiones: string;
  bordes: string;
  superficie: string;
  huellasUso: string;
  posibleFuncion: string;
  conservacion: string;
  contexto: string;
  asociacion: string;
  asociadoA: AssociationField;
  fotografia: string;
  analisisIA?: AIAnalysisResult;
}

export interface BoneFicha {
  id: string;
  tipoFicha: 'Restos óseos';
  isDemo?: boolean;
  createdAt: string;
  codigo: string;
  sitio: string;
  contexto: string;
  elementoAnatomico: string;
  lateralidad: string;
  identificacionPreliminarEspecie: string;
  conservacion: string;
  medidas: string;
  modificaciones: string;
  marcas: string;
  observaciones: string;
  asociadoA: AssociationField;
  fotografia: string;
  analisisIA?: AIAnalysisResult;
}

export interface ArchitectureFicha {
  id: string;
  tipoFicha: 'Arquitectura';
  isDemo?: boolean;
  createdAt: string;
  codigo: string;
  sitio: string;
  estructura: string;
  tipo: string;
  formaPlanta: string;
  materiales: string;
  tecnicaConstructiva: string;
  muros: string;
  accesos: string;
  orientacion: string;
  distribucion: string;
  relacionEspacial: string;
  conservacion: string;
  visibilidad: string;
  posibleFuncion: string;
  contexto: string;
  asociadoA: AssociationField;
  fotografia: string;
  analisisIA?: AIAnalysisResult;
}

export type AnyFichaRecord =
  | CeramicFicha
  | TextileFicha
  | LithicFicha
  | BoneFicha
  | ArchitectureFicha;

export interface SacredGeographyRecord {
  id: string;
  isDemo?: boolean;
  createdAt: string;
  nombrePaisajeOSitio: string;
  cerrosOApus: string;
  huacas: string;
  fuentesAgua: string;
  rios: string;
  lagunas: string;
  quebradas: string;
  cuevas: string;
  caminos: string;
  plazas: string;
  estructurasCeremoniales: string;
  asentamientos: string;
  orientacion: string;
  visibilidad: string;
  accesibilidad: string;
  relacionElementosPaisaje: string;
  asociadoA: AssociationField;
  analisisIA?: AIAnalysisResult;
}

export interface IncaStrategyRecord {
  id: string;
  isDemo?: boolean;
  createdAt: string;
  nombreSitioORegion: string;
  caminos: string;
  arquitectura: string;
  administracion: string;
  almacenamiento: string;
  movilidad: string;
  visibilidad: string;
  controlTerritorial: string;
  recursos: string;
  relacionesPoblacionesLocales: string;
  infraestructura: string;
  espaciosCeremoniales: string;
  ubicacionEstrategica: string;
  asociadoA: AssociationField;
  analisisIA?: AIAnalysisResult;
}

export interface ArchaeologicalReport {
  id: string;
  titulo: string;
  subtituloModulo: string;
  fechaGeneracion: string;
  isDemo: boolean;
  identificacion: Record<string, string>;
  datosObservables: string[];
  informacionDocumentada: string[];
  analisis: string;
  interpretacion: string[];
  hipotesis: string[];
  informacionInsuficiente: string[];
  asociacion: AssociationField;
  preguntasEvidencia: EvidenceQuestions;
  referencias: APAReference[];
  fotografia?: string;
}
