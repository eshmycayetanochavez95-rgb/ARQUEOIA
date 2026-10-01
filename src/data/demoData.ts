import heroExcavationImg from '../assets/images/hero_andean_excavation_1790872352237.jpg';
import demoCeramicImg from '../assets/images/demo_ceramic_aryballos_1790872364652.jpg';
import demoLithicImg from '../assets/images/demo_lithic_projectile_1790872374886.jpg';
import demoIncaArchImg from '../assets/images/demo_inca_architecture_1790872387086.jpg';

import {
  SiteRecord,
  AnyFichaRecord,
  SacredGeographyRecord,
  IncaStrategyRecord,
  ArchaeologicalReport,
} from '../types/archaeology';

export const DEMO_IMAGES = {
  heroExcavation: heroExcavationImg,
  ceramicAryballos: demoCeramicImg,
  lithicProjectile: demoLithicImg,
  incaArchitecture: demoIncaArchImg,
};

export const INITIAL_DEMO_SITES: SiteRecord[] = [
  {
    id: 'demo-site-1',
    isDemo: true,
    createdAt: '2026-10-01',
    nombreSitio: '[DATOS DE DEMOSTRACIÓN] Sector Kancha-Pampa (Ejemplo Metodológico)',
    pais: 'Perú',
    region: 'Ayacucho',
    provincia: 'Vilcas Huamán',
    distrito: 'Vilcas Huamán',
    coordenadas: '-13.6528, -73.9542 (Coordenadas referenciales de demostración)',
    latitud: -13.6528,
    longitud: -73.9542,
    altitud: '3470 m s.n.m.',
    periodo: 'Horizonte Tardío',
    cronologia: 'ca. 1450 – 1532 d.C. (Cronología relativa tentativa en ejemplo)',
    descripcion:
      'REGISTRO DE DEMOSTRACIÓN: Conjunto ortogonal de recintos de planta rectangular dispuestos alrededor de un patio central trapezoidal, con presencia de mampostería concertada de piedra canteada en los vanos principales.',
    contexto:
      'Superficie y corte de limpieza Unidad E-02. Terraza aluvial alta con dominio visual sobre la confluencia de quebradas estacionales.',
    observaciones:
      'DATOS DE DEMOSTRACIÓN — Este registro tiene fines exclusivamente pedagógicos para mostrar la estructura de ArqueoIA 3.0. No constituye un registro arqueológico oficial verificado.',
    evidenciasAsociadas:
      'Fragmentería cerámica de superficie (bordes evertidos con engobe rojo pulido), lascas de obsidiana y muros de retención.',
    asociadoA: {
      items: ['cerámica', 'líticos', 'arquitectura', 'caminos', 'áreas ceremoniales', 'cerros'],
      tipoRelacion: 'Observada en superficie (Hipótesis espacial)',
      detalleAsociacion:
        'Alineamiento visual del eje de acceso con la cumbre noreste y proximidad a traza de camino empedrado a 120 m al oeste.',
    },
    fotografia: demoIncaArchImg,
    analisisIA: {
      identificacionSintesis:
        'REGISTRO DE DEMOSTRACIÓN: Asentamiento con arquitectura de patrón ortogonal y vanos trapezoidales vinculable tipológicamente al Horizonte Tardío.',
      advertenciaMetodologica:
        'Los datos corresponden a un registro de demostración en superficie. La filiación cronológica y funcional requiere excavación estratigráfica.',
      datosObservables: [
        'Recintos de planta rectangular organizados en torno a patio abierto.',
        'Mampostería de bloques líticos canteados y vano de perfil trapezoidal.',
        'Asociación superficial de fragmentos cerámicos con engobe rojo y artefactos líticos.',
      ],
      informacionDocumentada: [
        'El patrón de kancha y los vanos trapezoidales están ampliamente documentados en la arquitectura estatal del Tawantinsuyu durante el Horizonte Tardío (Gasparini & Margolies, 1977; Hyslop, 1990).',
      ],
      analisisTecnico:
        'La disposición espacial sugiere planificación arquitectónica controlada. Sin embargo, la coexistencia de cerámica en superficie y muros expuestos no garantiza contemporaneidad absoluta sin control estratigráfico.',
      interpretacion: [
        'La arquitectura observada presenta indicadores formales compatibles con infraestructura administrativa o residencial de élite del Horizonte Tardío.',
      ],
      hipotesis: [
        'HIPÓTESIS DE TRABAJO: El sector habría funcionado como nodo de control vial y administrativo articulado al camino secundario registrado a 120 m.',
      ],
      evaluacionAsociacion:
        'La asociación con cerámica, líticos y el camino adyacente ha sido registrada en superficie; por tanto, debe tratarse como una hipótesis espacial hasta verificar su correlación estratigráfica.',
      informacionInsuficiente: [
        'Información insuficiente para establecer una datación absoluta (ausencia de fechados radiocarbónicos C14 o termoluminiscencia).',
        'Información insuficiente para confirmar la función específica de cada recinto sin excavar pisos de ocupación.',
      ],
      preguntasEvidencia: {
        evidenciaSostener:
          '¿Qué rasgos constructivos y estratigráficos específicos permiten sostener la adscripción al Horizonte Tardío más allá de la forma trapezoidal de los vanos?',
        informacionFalta:
          'Falta secuencia estratigráfica de los pisos de ocupación intramuros, fechados absolutos y levantamiento planimétrico de precisión.',
        otrosMateriales:
          'Deberían buscarse restos botánicos (macro y microvestigios en fogones), muestras de carbón asociadas a pisos sellados y posibles depósitos (qullqas) periféricos.',
        relacionEspacial:
          'Existe una relación de proximidad espacial (120 m) con la traza vial y dominio visual de la cuenca, cuya articulación funcional requiere análisis de red.',
        asociacionEstado:
          'La asociación entre la arquitectura y los fragmentos cerámicos de superficie es actualmente una hipótesis espacial; no está documentada en estrato sellado.',
        analisisEspecializado:
          'Excavación en área de pisos de actividad, arqueometría cerámica (DRX/petrografía), análisis de fitolitos y modelado SIG de cuenca visual.',
      },
      referenciasAPA: [
        {
          autor: 'Hyslop, J.',
          anio: '1990',
          titulo: 'Inka Settlement Planning',
          publicacion: 'University of Texas Press',
          pagina: 'pp. 1-68',
          enlace: '',
          citaCompletaAPA7: 'Hyslop, J. (1990). Inka Settlement Planning. University of Texas Press.',
        },
        {
          autor: 'Gasparini, G., & Margolies, L.',
          anio: '1977',
          titulo: 'Arquitectura Inka',
          publicacion: 'Centro de Investigaciones Históricas y Estéticas, Universidad Central de Venezuela',
          pagina: 'pp. 129-195',
          enlace: '',
          citaCompletaAPA7:
            'Gasparini, G., & Margolies, L. (1977). Arquitectura Inka. Universidad Central de Venezuela.',
        },
      ],
    },
  },
];

export const INITIAL_DEMO_FICHAS: AnyFichaRecord[] = [
  {
    id: 'demo-ficha-ceramica-1',
    tipoFicha: 'Cerámica',
    isDemo: true,
    createdAt: '2026-10-01',
    codigo: 'DEMO-CER-2026-001',
    sitio: '[DATOS DE DEMOSTRACIÓN] Sector Kancha-Pampa',
    contexto: 'Unidad 02, Capa B, Nivel 2 (Ceniza compacta sobre piso apisonado)',
    forma: 'Cántaro de cuello estrecho y cuerpo globular (posible aríbalo / urpu)',
    tipoFragmento: 'Fragmento diagnóstico de borde evertido y cuerpo superior',
    pasta: 'Textura fina a media, fractura regular y compacta',
    temperante: 'Inclusiones minerales finas de cuarzo subangular y feldespato (< 0.5 mm, densidad 10%)',
    coccion: 'Atmósfera oxidante completa, núcleo homogéneo sin nervio oscuro',
    color: 'Pasta: Munsell 2.5YR 5/6 (rojo); Engobe: 10R 4/6 (rojo oscuro) y 7.5YR 2.5/1 (negro)',
    superficie: 'Engobada en cara externa y labio interno',
    acabado: 'Bruñido horizontal fino con brillo especular en el exterior; alisado regular en el interior',
    tecnicaManufactura: 'Modelado por enrollamiento (acordelado) y alisado continuo',
    decoracion: 'Pintura policroma precocción (negro y crema sobre fondo rojo engobado)',
    motivos: 'Bandas paralelas delimitadas con hileras de rombos concéntricos y líneas reticuladas',
    dimensiones: 'Largo máx.: 84 mm; Ancho máx.: 62 mm; Diámetro estimado de boca: 160 mm',
    grosor: '6.5 mm en cuerpo; 8.2 mm en inflexión del labio',
    conservacion: 'Buena; ligero desgaste mecánico en aristas de fractura antigua, sin sales solubles activas',
    posibleFuncion: 'Hipótesis funcional: Almacenamiento y servicio de líquidos (posiblemente chicha en contextos públicos)',
    asociacionCultural: 'Estilo Inca Imperial / Inca Provincial (Horizonte Tardío — preliminar)',
    cronologia: 'Horizonte Tardío (ca. 1450–1532 d.C. — estimación tipológica sujeta a datación)',
    observaciones:
      'DATOS DE DEMOSTRACIÓN: Ejemplo de ficha cerámica completa para pruebas metodológicas en ArqueoIA 3.0.',
    asociadoA: {
      items: ['arquitectura', 'restos óseos', 'estructuras'],
      tipoRelacion: 'Documentada en contexto estratigráfico',
      detalleAsociacion:
        'Recuperado en la Capa B en contacto directo con lente de ceniza junto a restos óseos de camélido y muro perimetral norte.',
    },
    fotografia: demoCeramicImg,
    analisisIA: {
      identificacionSintesis:
        'DEMOSTRACIÓN: Fragmento diagnóstico de borde evertido con decoración policroma geométrica (rombos concéntricos) afín al repertorio morfo-estilístico Inca del Horizonte Tardío.',
      advertenciaMetodologica:
        'Registro de demostración. La determinación de procedencia (importación cusqueña vs. producción provincial local) requiere análisis arqueométrico de pastas.',
      datosObservables: [
        'Borde marcadamente evertido con engobe rojo bruñido.',
        'Decoración pintada en negro sobre rojo formando motivos geométricos de rombos concéntricos.',
        'Cocción oxidante homogénea y desgrasante mineral fino (< 0.5 mm).',
      ],
      informacionDocumentada: [
        'Los cántaros de cuello estrecho y borde acampanado (urpu o aríbalo) decorados con paneles geométricos constituyen una forma diagnóstica estandarizada del Horizonte Tardío (Bray, 2003).',
      ],
      analisisTecnico:
        'El control de atmósfera oxidante y el bruñido fino reflejan alta inversión de trabajo en la cadena operativa cerámica.',
      interpretacion: [
        'Los atributos formales y decorativos son consistentes con vasijas destinadas al transporte, contención y servicio de líquidos en contextos de comensalismo político o doméstico de élite.',
      ],
      hipotesis: [
        'HIPÓTESIS: La pieza podría corresponder a una manufactura provincial local que emula cánones imperiales, o bien a una vasija distribuida por la red estatal.',
      ],
      evaluacionAsociacion:
        'Asociación estratigráfica documentada en la Capa B junto a restos faunísticos y arquitectura, lo que refuerza la integridad del contexto de consumo.',
      informacionInsuficiente: [
        'Información insuficiente para establecer el centro alfarero de origen sin petrografía de lámina delgada o activación neutrónica (INAA).',
        'Información insuficiente para afirmar el contenido líquido exacto sin análisis de residuos orgánicos o almidones.',
      ],
      preguntasEvidencia: {
        evidenciaSostener:
          '¿El diámetro del labio y el ángulo de inflexión bastan para reconstruir la forma completa de un urpu, o podría tratarse de otra variante de cántaro de cuello estrecho?',
        informacionFalta:
          'Falta caracterización mineralógica en sección delgada y análisis químico elemental de la pasta y los pigmentos.',
        otrosMateriales:
          'Deberían buscarse fragmentos de base cónica/apuntada y asas verticales cintadas en la misma unidad estratigráfica.',
        relacionEspacial:
          'Se ubica junto al muro norte del recinto principal; es necesario mapear su distribución tridimensional respecto a los fogones.',
        asociacionEstado:
          'La asociación con la Capa B está documentada estratigráficamente (según la ficha de demostración).',
        analisisEspecializado:
          'Petrografía cerámica, Fluorescencia de Rayos X portátil (pXRF) en pigmentos y extracción de microvestigios (almidones/fitolitos) de la pared interna.',
      },
      referenciasAPA: [
        {
          autor: 'Bray, T. L.',
          anio: '2003',
          titulo: 'Inka pottery as culinary equipment: Food, feasting, and gender in imperial state design',
          publicacion: 'Latin American Antiquity, 14(1)',
          pagina: 'pp. 3-28',
          enlace: 'https://doi.org/10.2307/972233',
          citaCompletaAPA7:
            'Bray, T. L. (2003). Inka pottery as culinary equipment: Food, feasting, and gender in imperial state design. Latin American Antiquity, 14(1), 3–28. https://doi.org/10.2307/972233',
        },
        {
          autor: 'Orton, C., & Hughes, M.',
          anio: '2013',
          titulo: 'Pottery in Archaeology (2nd ed.)',
          publicacion: 'Cambridge University Press',
          pagina: 'pp. 150-190',
          enlace: '',
          citaCompletaAPA7: 'Orton, C., & Hughes, M. (2013). Pottery in Archaeology (2nd ed.). Cambridge University Press.',
        },
      ],
    },
  },
  {
    id: 'demo-ficha-litico-1',
    tipoFicha: 'Lítico',
    isDemo: true,
    createdAt: '2026-10-01',
    codigo: 'DEMO-LIT-2026-002',
    sitio: '[DATOS DE DEMOSTRACIÓN] Abrigo Rocoso Yanacocha',
    materiaPrima: 'Obsidiana translúcida con bandeado grisáceo',
    tipoRoca: 'Vidrio volcánico (riolítico)',
    tecnicaTalla: 'Percusión blanda bifacial y retoque por presión marginal',
    modificacion: 'Adelgazamiento bifacial completo y formatización de base cóncava',
    forma: 'Punta de proyectil foliácea / triangular de base escotada',
    dimensiones: 'Longitud: 38.4 mm; Ancho máx.: 19.2 mm; Espesor máx.: 5.1 mm; Peso: 3.8 g',
    bordes: 'Bordes activos convergentes, simétricos, con micro-denticulado regular por presión',
    superficie: 'Negativos de lascado laminares invasivos en ambas caras, sin córtex remanente (0%)',
    huellasUso: 'Micro-lascados escalonados distales (posible fractura de impacto microscópica — requiere lupa binocular)',
    posibleFuncion: 'Hipótesis funcional: Cabezal lítico de proyectil enmangado (dardo o flecha)',
    conservacion: 'Completa (95%), leve desprendimiento en el ápice distal (< 1.5 mm)',
    contexto: 'Cuadrícula A3, Estrato III (matriz limo-arenosa marrón oscura)',
    asociacion: 'Asociada a desechos de talla (microlascas de retoque) y restos óseos faunísticos fragmentados',
    asociadoA: {
      items: ['líticos', 'restos óseos', 'fuentes de agua'],
      tipoRelacion: 'Documentada en contexto estratigráfico',
      detalleAsociacion: 'Hallada en el mismo nivel ocupacional que microlascas de reactivación de bordes y huesos largos con fractura helicoidal.',
    },
    fotografia: demoLithicImg,
  },
  {
    id: 'demo-ficha-oseo-1',
    tipoFicha: 'Restos óseos',
    isDemo: true,
    createdAt: '2026-10-01',
    codigo: 'DEMO-OSE-2026-003',
    sitio: '[DATOS DE DEMOSTRACIÓN] Sector Kancha-Pampa',
    contexto: 'Unidad 02, Capa B, Rasgo 04 (Lente de ceniza asociado a actividad culinaria)',
    elementoAnatomico: 'Epífisis proximal y diáfisis parcial de metatarso',
    lateralidad: 'Derecha (determinación preliminar)',
    identificacionPreliminarEspecie:
      'Identificación preliminar: Artiodactyla, cf. Camelidae (requiere evaluación osteológica comparativa especializada en laboratorio)',
    conservacion: 'Regular; meteorización estadio 1 (escala de Behrensmeyer), fractura longitudinal en diáfisis',
    medidas: 'Longitud conservada: 112 mm; Ancho proximal (Bp): 28.4 mm; Profundidad proximal (Dp): 26.1 mm',
    modificaciones: 'Termoalteración parcial (coloración marrón-negruzca en extremo distal fracturado)',
    marcas: 'Tres incisiones lineales finas en perfil en V transversales al eje diafisario (posibles huellas de corte)',
    observaciones:
      'DATOS DE DEMOSTRACIÓN: Se consigna únicamente como identificación preliminar de taxón. No debe asumirse especie doméstica o silvestre sin osteometría especializada.',
    asociadoA: {
      items: ['cerámica', 'arquitectura', 'otros materiales o espacios'],
      tipoRelacion: 'Documentada en contexto estratigráfico',
      detalleAsociacion: 'En matriz de ceniza junto a fragmentos cerámicos utilitarios y carbón vegetal.',
    },
    fotografia: '',
  },
];

export const INITIAL_DEMO_SACRED_GEOGRAPHY: SacredGeographyRecord[] = [
  {
    id: 'demo-geo-1',
    isDemo: true,
    createdAt: '2026-10-01',
    nombrePaisajeOSitio: '[DATOS DE DEMOSTRACIÓN] Cuenca Alta y Plataforma Ushnu-Pata',
    cerrosOApus: 'Nevado tutelar al noreste (Azimut 42°, elevación 5120 m s.n.m.) visible desde la plataforma central',
    huacas: 'Afloramiento rocoso de caliza tallada con escalones in situ en el borde oriental de la plaza',
    fuentesAgua: 'Manantial perenne (puquio) canalizado mediante ducto lítico a 85 m al sur de la estructura',
    rios: 'Confluencia (tinkuy) de dos ríos tributarios en el fondo de valle a 600 m de desnivel',
    lagunas: 'Laguna altoandina estacional ubicada a 4.5 km hacia la cabecera de cuenca',
    quebradas: 'Quebrada profunda flanqueando el sector oeste como límite topográfico natural',
    cuevas: 'Abrigo rocoso menor en el farallón norte sin excavación documentada',
    caminos: 'Tramo de camino empedrado con escalinatas que asciende desde el valle hacia la plataforma',
    plazas: 'Espacio abierto nivelado artificialmente de 65 x 40 m al pie del afloramiento tallado',
    estructurasCeremoniales: 'Plataforma escalonada rectangular con vano de doble jamba orientado hacia el afloramiento',
    asentamientos: 'Sector habitacional en terrazas inferiores a 350 m al suroeste',
    orientacion: 'Eje mayor de la plataforma orientado a 42° NE (hacia la cumbre nevada) y 222° SO',
    visibilidad: 'Cuenca visual amplia sobre la confluencia fluvial y el corredor de paso interandino',
    accesibilidad: 'Acceso restringido mediante único camino escalonado controlado por portada lateral',
    relacionElementosPaisaje:
      'Se observa una convergencia visual y física entre la canalización del manantial, el afloramiento tallado y el eje de orientación hacia la cumbre noreste.',
    asociadoA: {
      items: ['arquitectura', 'caminos', 'estructuras', 'áreas ceremoniales', 'fuentes de agua', 'cerros'],
      tipoRelacion: 'Observada en superficie (Hipótesis espacial)',
      detalleAsociacion: 'Integración arquitectónica directa entre el afloramiento rocoso tallado y el sistema hidráulico.',
    },
  },
];

export const INITIAL_DEMO_INCA_STRATEGIES: IncaStrategyRecord[] = [
  {
    id: 'demo-inca-1',
    isDemo: true,
    createdAt: '2026-10-01',
    nombreSitioORegion: '[DATOS DE DEMOSTRACIÓN] Nodo Vial y Administrativo Tambo-Qullqa (Horizonte Tardío)',
    caminos: 'Calzada empedrada de 4.2 m de ancho con muros laterales de contención y drenajes transversales',
    arquitectura: 'Dos kallankas de 28 m de largo frente a plaza trapezoidal y tres kanchas ortogonales',
    administracion: 'Sector de recintos controlados con acceso único frente al espacio público principal',
    almacenamiento: 'Hilera de 18 estructuras circulares y rectangulares (posibles qullqas) en ladera ventilada a 150 m sobre el sitio',
    movilidad: 'Ubicado en paso natural obligatorio entre la puna altoandina y los valles templados',
    visibilidad: 'Intervisibilidad directa entre las estructuras de almacenamiento en ladera, la plaza y dos puestos de observación en cumbres cercanas',
    controlTerritorial: 'Posición de embudo topográfico que regula el tránsito de caravanas de camélidos',
    recursos: 'Proximidad a tierras agrícolas aterrazadas de maíz en el piso quechua y pastizales de puna',
    relacionesPoblacionesLocales:
      'Presencia mixta en superficie de alfarería de tradición local del Periodo Intermedio Tardío junto a formas estandarizadas Inca provincial',
    infraestructura: 'Andenería de muro concertado y canal principal de irrigación de 2.1 km',
    espaciosCeremoniales: 'Plataforma central en la plaza principal vinculada a actividades de reciprocidad asimétrica y hospitalidad estatal',
    ubicacionEstrategica: 'Espolón rocoso a media ladera (3380 m s.n.m.) en la intersección de ejes longitudinal y transversal',
    asociadoA: {
      items: ['cerámica', 'arquitectura', 'caminos', 'estructuras', 'áreas ceremoniales', 'asentamientos'],
      tipoRelacion: 'Observada en superficie (Hipótesis espacial)',
      detalleAsociacion: 'Articulación espacial directa entre el camino, las estructuras de almacenamiento en ladera y la plaza.',
    },
  },
];

export const INITIAL_DEMO_REPORT: ArchaeologicalReport = {
  id: 'demo-report-1',
  titulo: 'Informe Técnico Preliminar: Fragmento Diagnóstico DEMO-CER-2026-001',
  subtituloModulo: 'Módulo de Fichas Arqueológicas — Cerámica [DATOS DE DEMOSTRACIÓN]',
  fechaGeneracion: '01/10/2026',
  isDemo: true,
  identificacion: {
    'Código de Registro': 'DEMO-CER-2026-001 (DATOS DE DEMOSTRACIÓN)',
    'Sitio Arqueológico': 'Sector Kancha-Pampa (Ejemplo Metodológico)',
    'Categoría Material': 'Cerámica — Borde evertido policromo',
    'Contexto Estratigráfico': 'Unidad 02, Capa B, Nivel 2',
    'Cronología Tentativa': 'Horizonte Tardío (Sujeta a confirmación absoluta)',
  },
  datosObservables: [
    'Fragmento diagnóstico de borde evertido y cuello estrecho.',
    'Superficie externa con engobe rojo (10R 4/6) y acabado bruñido.',
    'Decoración pintada precocción con motivos geométricos de rombos concéntricos en negro.',
    'Pasta compacta de cocción oxidante con inclusiones minerales finas (< 0.5 mm).',
  ],
  informacionDocumentada: [
    'La morfología de labio acampanado y decoración de rombos en paneles se documenta en vasijas tipo urpu/aríbalo durante el Horizonte Tardío (Bray, 2003).',
  ],
  analisis:
    'El ejemplar presenta estandarización formal en el ángulo del borde y selección cuidadosa de antiplásticos finos, consistente con recipientes destinados a contener y verter líquidos.',
  interpretacion: [
    'La pieza forma parte de un conjunto cerámico de servicio asociado a un piso de actividad con restos de combustión y fauna.',
  ],
  hipotesis: [
    'HIPÓTESIS: Producción provincial de estilo Inca elaborada para eventos de comensalismo en el asentamiento.',
  ],
  informacionInsuficiente: [
    'Información insuficiente para establecer la cantera de arcilla sin análisis petrográfico o químico (INAA/pXRF).',
    'Información insuficiente para determinar el contenido específico sin análisis de microvestigios (almidones/lípidos).',
  ],
  asociacion: {
    items: ['arquitectura', 'restos óseos', 'estructuras'],
    tipoRelacion: 'Documentada en contexto estratigráfico',
    detalleAsociacion:
      'Asociado en la Capa B con restos óseos faunísticos y el muro norte del recinto principal.',
  },
  preguntasEvidencia: {
    evidenciaSostener:
      '¿Qué atributos morfométricos confirman que el fragmento pertenece específicamente a un aríbalo y no a otro cántaro de cuello estrecho?',
    informacionFalta:
      'Falta composición mineralógica de la pasta, fechados radiocarbónicos del estrato y análisis de residuos.',
    otrosMateriales:
      'Fragmentos de base cónica, asas laterales y elementos de molienda o fermentación en el mismo piso ocupacional.',
    relacionEspacial:
      'Concentración junto al paramento interno del muro norte, próximo al rasgo de ceniza R-04.',
    asociacionEstado:
      'Asociación documentada en contexto estratigráfico dentro de este ejemplo de demostración.',
    analisisEspecializado:
      'Petrografía cerámica en lámina delgada, cromatografía de gases en paredes internas y datación C14 del carbón asociado.',
  },
  referencias: [
    {
      autor: 'Bray, T. L.',
      anio: '2003',
      titulo: 'Inka pottery as culinary equipment: Food, feasting, and gender in imperial state design',
      publicacion: 'Latin American Antiquity, 14(1)',
      pagina: 'pp. 3-28',
      enlace: 'https://doi.org/10.2307/972233',
      citaCompletaAPA7:
        'Bray, T. L. (2003). Inka pottery as culinary equipment: Food, feasting, and gender in imperial state design. Latin American Antiquity, 14(1), 3–28. https://doi.org/10.2307/972233',
    },
  ],
  fotografia: demoCeramicImg,
};
