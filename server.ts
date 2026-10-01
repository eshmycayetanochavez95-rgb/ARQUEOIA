import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no está configurada en el entorno.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const ANTI_HALLUCINATION_SYSTEM_INSTRUCTION = `Eres ArqueoIA 3.0, un asistente científico de análisis arqueológico diseñado para estudiantes, investigadores y profesionales de la arqueología.
Tu principio rector absoluto es la SEGURIDAD CONTRA ALUCINACIONES y el rigor metodológico:
1. NUNCA inventes coordenadas, cronologías, autores, publicaciones, páginas, enlaces, nombres de sitios, funciones de estructuras, identificaciones de especies ni asociaciones culturales.
2. Cuando no exista información suficiente o verificable para algún punto, debes escribir explícitamente la frase exacta: "Información insuficiente para establecer esta afirmación."
3. NUNCA presentes una hipótesis como un hecho comprobado. Separa siempre con rigor: DATOS OBSERVABLES, INTERPRETACIÓN, HIPÓTESIS, INFORMACIÓN DOCUMENTADA e INFORMACIÓN INSUFICIENTE.
4. En Restos Óseos, cualquier identificación taxonómica o de especie debe presentarse únicamente como "Identificación preliminar" y advertir explícitamente que requiere evaluación especializada bioantropológica o zooarqueológica en laboratorio.
5. En Geografía Sagrada, NUNCA afirmes automáticamente que un lugar era sagrado. Utiliza obligatoriamente expresiones condicionales y prudentes como: "podría estar relacionado", "se observa una posible relación", "requiere evidencia arqueológica o documental".
6. En Estrategias de Dominación Inca (Horizonte Tardío), diferencia siempre entre evidencia observada in situ, información documentada e interpretación.
7. En Referencias (Formato APA 7), cita únicamente obras académicas e institucionales reales y verificadas. No inventes autores, años, títulos, editoriales, páginas ni URLs.
8. Recuerda siempre que ArqueoIA 3.0 es una herramienta de apoyo analítico y metodológico y no reemplaza el criterio del arqueólogo.
Responde siempre en español riguroso y académico.`;

function extractJsonFromText(rawText: string): any {
  const trimmed = rawText.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match && match[1]) {
      return JSON.parse(match[1].trim());
    }
    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
    }
    throw new Error('No se pudo estructurar la respuesta en formato JSON.');
  }
}

function extractGroundingLinks(response: any): Array<{ title: string; uri: string }> {
  const chunks = response?.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (!Array.isArray(chunks)) return [];
  const links: Array<{ title: string; uri: string }> = [];
  for (const chunk of chunks) {
    if (chunk?.web?.uri) {
      links.push({
        title: chunk.web.title || chunk.web.uri,
        uri: chunk.web.uri,
      });
    }
  }
  return links;
}

// 1. BÚSQUEDA DE SITIOS ARQUEOLÓGICOS
app.post('/api/archaeology/search-site', async (req, res) => {
  try {
    const { siteName, countryHint } = req.body;
    if (!siteName || typeof siteName !== 'string') {
      return res.status(400).json({ error: 'Debe proporcionar el nombre de un sitio arqueológico.' });
    }

    const ai = getGeminiClient();
    const prompt = `Realiza una consulta arqueológica rigurosa y documentada sobre el sitio arqueológico: "${siteName}" ${countryHint ? `(Contexto geográfico indicado: ${countryHint})` : ''}.

REGLAS ESTRICTAS DE VERACIDAD:
- NO inventes información ni rellenes vacíos con suposiciones.
- Si el sitio no está documentado en la literatura científica o si careces de datos verificables para cualquiera de los campos solicitados, debes colocar exactamente: "Información insuficiente para establecer esta afirmación."
- No inventes coordenadas geográficas. Solo incluye coordenadas numéricas si están documentadas con certeza para ese sitio arqueológico específico.
- No inventes autores, libros, artículos, páginas ni enlaces.

Devuelve ÚNICAMENTE un objeto JSON válido con la siguiente estructura exacta:
{
  "nombreSitio": "Nombre documentado del sitio",
  "ubicacion": "País, región, provincia, distrito o valle documentado, o 'Información insuficiente para establecer esta afirmación.'",
  "coordenadas": "Coordenadas documentadas (ej. Latitud / Longitud) o 'Información insuficiente para establecer esta afirmación.'",
  "latitudNumerica": null,
  "longitudNumerica": null,
  "altitud": "Altitud en m s.n.m. si está documentada, o 'Información insuficiente para establecer esta afirmación.'",
  "descripcion": "Descripción arqueológica documentada del sitio, o 'Información insuficiente para establecer esta afirmación.'",
  "cronologia": "Periodo y cronología documentada, o 'Información insuficiente para establecer esta afirmación.'",
  "estructurasConocidas": "Estructuras arquitectónicas o componentes registrados en la literatura, o 'Información insuficiente para establecer esta afirmación.'",
  "materialesAsociados": "Materiales culturales asociados reportados en investigaciones (cerámica, lítico, etc.), o 'Información insuficiente para establecer esta afirmación.'",
  "observaciones": "Estado de investigación, declaratoria patrimonial o limitaciones en los datos disponibles",
  "datosObservables": "Síntesis de la evidencia material reportada",
  "interpretacion": "Interpretaciones académicas documentadas sobre el sitio",
  "hipotesis": "Hipótesis abiertas en la discusión arqueológica sobre el sitio (nunca presentadas como hechos)",
  "preguntasEvidencia": {
    "evidenciaSostener": "¿Qué evidencia permite sostener esta interpretación?",
    "informacionFalta": "¿Qué información falta?",
    "otrosMateriales": "¿Qué otros materiales deberían buscarse?",
    "relacionEspacial": "¿Qué relación espacial existe?",
    "asociacionEstado": "¿La asociación está documentada o es una hipótesis?",
    "analisisEspecializado": "¿Qué análisis especializado sería necesario?"
  },
  "referenciasAPA": [
    {
      "autor": "Apellido, Inicial. o Institución oficial real",
      "anio": "Año real o s.f.",
      "titulo": "Título real de la publicación",
      "publicacion": "Revista, libro o institución editora real",
      "pagina": "Páginas si constan o 'No especificada'",
      "enlace": "URL únicamente si es verificable, de lo contrario dejar vacío",
      "citaCompletaAPA7": "Cita formateada en APA 7"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: ANTI_HALLUCINATION_SYSTEM_INSTRUCTION,
        temperature: 0.1,
        tools: [{ googleSearch: {} }],
      },
    });

    const rawText = response.text || '{}';
    const parsed = extractJsonFromText(rawText);
    const groundingLinks = extractGroundingLinks(response);

    return res.json({
      result: parsed,
      groundingLinks,
    });
  } catch (error: any) {
    console.error('Error en search-site:', error);
    return res.status(500).json({
      error: error?.message || 'Error al realizar la búsqueda arqueológica.',
    });
  }
});

// 2. ANÁLISIS DE COORDENADAS Y UBICACIÓN
app.post('/api/archaeology/analyze-coordinates', async (req, res) => {
  try {
    const { latitude, longitude, altitude, referenceName, landscapeNotes } = req.body;
    if (latitude === undefined || longitude === undefined || isNaN(Number(latitude)) || isNaN(Number(longitude))) {
      return res.status(400).json({ error: 'Debe proporcionar latitud y longitud numéricas válidas.' });
    }

    const ai = getGeminiClient();
    const prompt = `Analiza con rigor geográfico y arqueológico las siguientes coordenadas introducidas manualmente por el investigador:
- Latitud: ${latitude}
- Longitud: ${longitude}
- Altitud indicada por el usuario: ${altitude || 'No especificada en el formulario'}
- Nombre o referencia de campo: ${referenceName || 'Punto de control sin nombre'}
- Notas de paisaje del usuario: ${landscapeNotes || 'Ninguna'}

REGLAS ESTRICTAS:
1. NO inventes coordenadas ni las modifiques. Usa exactamente Latitud ${latitude} y Longitud ${longitude}.
2. Determina la ubicación geográfica aproximada real (país, región/departamento, cuenca o unidad geomorfológica) correspondiente a estas coordenadas.
3. Si la altitud no fue proporcionada y no puede establecerse con certeza documental, indícalo claramente.
4. Analiza la relación espacial con elementos del paisaje (cuencas hidrográficas, pisos ecológicos, relieve, pasos naturales) diferenciando entre datos geográficos verificables e hipótesis arqueológicas.
5. Cuando no exista información suficiente para una afirmación específica, escribe: "Información insuficiente para establecer esta afirmación."

Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura:
{
  "latitud": "${latitude}",
  "longitud": "${longitude}",
  "altitud": "Altitud reportada o documentada en m s.n.m., o 'Información insuficiente para establecer esta afirmación.'",
  "ubicacionAproximada": "Ubicación político-administrativa y geográfica aproximada real",
  "unidadGeomorfologica": "Cuenca, valle, puna, llanura o piso ecológico identificable",
  "relacionElementosPaisaje": "Análisis de la relación espacial con relieves, cursos de agua, corredores de movilidad y visibilidad",
  "contextoArqueologicoRegional": "Información documentada sobre el área cultural o sitios registrados en la zona, o 'Información insuficiente para establecer esta afirmación.'",
  "informacionInsuficiente": "Aspectos que requieren verificación en campo mediante prospección directa y GPS diferencial",
  "preguntasEvidencia": {
    "evidenciaSostener": "Respuesta crítica sobre la evidencia geográfica/arqueológica disponible",
    "informacionFalta": "Qué datos de campo faltan registrar en este punto",
    "otrosMateriales": "Qué indicadores superficiales o subsuperficiales deberían prospectarse",
    "relacionEspacial": "Qué relaciones espaciales con cuencas, caminos o prominencias topográficas deben verificarse",
    "asociacionEstado": "Grado de documentación vs. hipótesis de emplazamiento",
    "analisisEspecializado": "Análisis recomendados (SIG, cuenca visual / viewshed, modelos digitales de elevación DEM, prospección pedestre)"
  },
  "referenciasAPA": [
    {
      "autor": "Autor o institución cartográfica/arqueológica real",
      "anio": "Año",
      "titulo": "Título",
      "publicacion": "Fuente o institución",
      "pagina": "No especificada",
      "enlace": "",
      "citaCompletaAPA7": "Cita en formato APA 7"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: ANTI_HALLUCINATION_SYSTEM_INSTRUCTION,
        temperature: 0.1,
        tools: [{ googleSearch: {} }],
      },
    });

    const parsed = extractJsonFromText(response.text || '{}');
    const groundingLinks = extractGroundingLinks(response);

    return res.json({
      result: parsed,
      groundingLinks,
    });
  } catch (error: any) {
    console.error('Error en analyze-coordinates:', error);
    return res.status(500).json({
      error: error?.message || 'Error al analizar las coordenadas.',
    });
  }
});

// 3. ANÁLISIS FOTOGRÁFICO ARQUEOLÓGICO
app.post('/api/archaeology/analyze-photo', async (req, res) => {
  try {
    const { imageBase64, mimeType, materialType, contextNotes, associatedTo } = req.body;
    if (!imageBase64 || !materialType) {
      return res.status(400).json({ error: 'Se requiere una fotografía y seleccionar el tipo de material.' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
    const ai = getGeminiClient();

    const prompt = `Analiza la fotografía adjunta correspondiente a la categoría arqueológica seleccionada por el usuario: "${materialType}".
Notas contextuales aportadas por el arqueólogo: "${contextNotes || 'Sin notas adicionales'}".
Asociaciones indicadas por el usuario: "${associatedTo || 'No especificadas'}".

REGLAS METODOLÓGICAS OBLIGATORIAS:
1. Analiza SOLAMENTE lo que se puede observar directamente en la fotografía.
2. Separa con absoluta claridad y sin mezclar:
   - DATOS OBSERVABLES: Rasgos físicos estrictamente visibles en la imagen (morfología, contorno, color aparente, acabado superficial visible, fracturas, bordes, aparejo, estado superficial).
   - INTERPRETACIÓN: Inferencias técnicas preliminares derivadas de los datos observables (ej. posible técnica de manufactura, desgaste o tratamiento de superficie).
   - HIPÓTESIS: Planteamientos condicionales sujetos a verificación empírica (posible función, posible filiación estilística preliminar). NUNCA presentar una hipótesis como un hecho.
   - INFORMACIÓN DOCUMENTADA: Criterios metodológicos o tipológicos establecidos en la literatura arqueológica aplicables al análisis visual de este tipo de material.
   - INFORMACIÓN INSUFICIENTE: Todo lo que NO se puede determinar únicamente a partir de esta fotografía (ej. pasta interna fresca, petrografía, estratigrafía, cronología absoluta, función definitiva, procedencia exacta). Si algo no es visible, escribe claramente: "Información insuficiente para establecer esta afirmación."
3. Si el material es "Restos óseos", cualquier mención anatómica o taxonómica debe etiquetarse estrictamente como "Identificación preliminar" y advertir que requiere evaluación osteológica, bioantropológica o zooarqueológica especializada en laboratorio.

Devuelve ÚNICAMENTE un objeto JSON con la estructura definida en el esquema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        systemInstruction: ANTI_HALLUCINATION_SYSTEM_INSTRUCTION,
        temperature: 0.1,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            categoriaMaterial: { type: Type.STRING },
            identificacionPreliminar: { type: Type.STRING },
            advertenciaMetodologica: { type: Type.STRING },
            datosObservables: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            interpretacion: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            hipotesis: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            informacionDocumentada: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            informacionInsuficiente: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            preguntasEvidencia: {
              type: Type.OBJECT,
              properties: {
                evidenciaSostener: { type: Type.STRING },
                informacionFalta: { type: Type.STRING },
                otrosMateriales: { type: Type.STRING },
                relacionEspacial: { type: Type.STRING },
                asociacionEstado: { type: Type.STRING },
                analisisEspecializado: { type: Type.STRING },
              },
              required: [
                'evidenciaSostener',
                'informacionFalta',
                'otrosMateriales',
                'relacionEspacial',
                'asociacionEstado',
                'analisisEspecializado',
              ],
            },
            referenciasAPA: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  autor: { type: Type.STRING },
                  anio: { type: Type.STRING },
                  titulo: { type: Type.STRING },
                  publicacion: { type: Type.STRING },
                  pagina: { type: Type.STRING },
                  enlace: { type: Type.STRING },
                  citaCompletaAPA7: { type: Type.STRING },
                },
                required: ['autor', 'anio', 'titulo', 'publicacion', 'pagina', 'enlace', 'citaCompletaAPA7'],
              },
            },
          },
          required: [
            'categoriaMaterial',
            'identificacionPreliminar',
            'advertenciaMetodologica',
            'datosObservables',
            'interpretacion',
            'hipotesis',
            'informacionDocumentada',
            'informacionInsuficiente',
            'preguntasEvidencia',
            'referenciasAPA',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ result: parsed });
  } catch (error: any) {
    console.error('Error en analyze-photo:', error);
    return res.status(500).json({
      error: error?.message || 'Error al analizar la fotografía arqueológica.',
    });
  }
});

// 4. ANÁLISIS DE FICHAS ARQUEOLÓGICAS, GEOGRAFÍA SAGRADA Y ESTRATEGIAS INCA
app.post('/api/archaeology/analyze-record', async (req, res) => {
  try {
    const { recordType, recordData } = req.body;
    if (!recordType || !recordData) {
      return res.status(400).json({ error: 'Se requiere el tipo de ficha y los datos del registro.' });
    }

    const ai = getGeminiClient();

    let specificRules = '';
    if (recordType === 'Restos óseos') {
      specificRules = `REGLA ESPECIAL PARA RESTOS ÓSEOS:
Cualquier identificación taxonómica, de especie o determinación biológica debe mostrarse SOLAMENTE como "Identificación preliminar" y debes incluir una advertencia destacada indicando que requiere evaluación especializada bioantropológica o zooarqueológica presencial en laboratorio.`;
    } else if (recordType === 'Geografía Sagrada') {
      specificRules = `REGLA ESPECIAL PARA GEOGRAFÍA SAGRADA:
Analiza posibles relaciones espaciales, visuales y culturales entre los elementos registrados (cerros/apus, huacas, fuentes de agua, caminos, estructuras, etc.), pero NUNCA afirmes automáticamente que el lugar era sagrado.
Debes utilizar explícitamente expresiones prudentes como: "podría estar relacionado", "se observa una posible relación", "requiere evidencia arqueológica o documental".`;
    } else if (recordType === 'Estrategias de Dominación Inca') {
      specificRules = `REGLA ESPECIAL PARA ESTRATEGIAS DE DOMINACIÓN INCA (HORIZONTE TARDÍO):
Evalúa los indicadores de control territorial (caminos, arquitectura, administración, almacenamiento, movilidad, visibilidad, recursos, relaciones con poblaciones locales, infraestructura, espacios ceremoniales, ubicación estratégica).
Diferencia rigurosamente entre:
1) Evidencia observada en el registro,
2) Información documentada para el Horizonte Tardío, y
3) Interpretación e hipótesis (nunca presentar hipótesis como hechos comprobados).`;
    }

    const prompt = `Realiza un análisis arqueológico riguroso del siguiente registro de tipo "${recordType}":

DATOS REGISTRADOS POR EL INVESTIGADOR:
${JSON.stringify(recordData, null, 2)}

${specificRules}

REGLAS GENERALES CONTRA ALUCINACIONES:
- Basa el análisis exclusivamente en los datos ingresados en la ficha y en principios metodológicos arqueológicos reales.
- En todos los campos donde el usuario no haya provisto datos suficientes para sostener una conclusión, indica claramente: "Información insuficiente para establecer esta afirmación."
- Evalúa específicamente el campo "¿A qué está asociado?" diferenciando si la asociación fue documentada estratigráficamente o si es una hipótesis espacial/superficial.
- En Referencias APA 7, incluye únicamente manuales o referencias académicas arqueológicas reales y verificables relacionadas con el análisis de "${recordType}". Nunca inventes autores, títulos, páginas ni enlaces.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: ANTI_HALLUCINATION_SYSTEM_INSTRUCTION,
        temperature: 0.1,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            identificacionSintesis: { type: Type.STRING },
            advertenciaMetodologica: { type: Type.STRING },
            datosObservables: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            informacionDocumentada: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            analisisTecnico: { type: Type.STRING },
            interpretacion: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            hipotesis: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            evaluacionAsociacion: { type: Type.STRING },
            informacionInsuficiente: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            preguntasEvidencia: {
              type: Type.OBJECT,
              properties: {
                evidenciaSostener: { type: Type.STRING },
                informacionFalta: { type: Type.STRING },
                otrosMateriales: { type: Type.STRING },
                relacionEspacial: { type: Type.STRING },
                asociacionEstado: { type: Type.STRING },
                analisisEspecializado: { type: Type.STRING },
              },
              required: [
                'evidenciaSostener',
                'informacionFalta',
                'otrosMateriales',
                'relacionEspacial',
                'asociacionEstado',
                'analisisEspecializado',
              ],
            },
            referenciasAPA: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  autor: { type: Type.STRING },
                  anio: { type: Type.STRING },
                  titulo: { type: Type.STRING },
                  publicacion: { type: Type.STRING },
                  pagina: { type: Type.STRING },
                  enlace: { type: Type.STRING },
                  citaCompletaAPA7: { type: Type.STRING },
                },
                required: ['autor', 'anio', 'titulo', 'publicacion', 'pagina', 'enlace', 'citaCompletaAPA7'],
              },
            },
          },
          required: [
            'identificacionSintesis',
            'advertenciaMetodologica',
            'datosObservables',
            'informacionDocumentada',
            'analisisTecnico',
            'interpretacion',
            'hipotesis',
            'evaluacionAsociacion',
            'informacionInsuficiente',
            'preguntasEvidencia',
            'referenciasAPA',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ result: parsed });
  } catch (error: any) {
    console.error('Error en analyze-record:', error);
    return res.status(500).json({
      error: error?.message || 'Error al analizar la ficha arqueológica.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ArqueoIA 3.0 ejecutándose en http://0.0.0.0:${PORT}`);
  });
}

startServer();
