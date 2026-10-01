import React, { useState } from 'react';
import {
  ASSOCIATION_OPTIONS,
  AssociationField,
  AssociationOption,
  AIAnalysisResult,
} from '../types/archaeology';
import { DEMO_IMAGES } from '../data/demoData';
import {
  Upload,
  FileText,
  AlertTriangle,
  ExternalLink,
  HelpCircle,
  BookOpen,
  Layers,
  Image as ImageIcon,
  X,
} from 'lucide-react';

interface AssociationSelectorProps {
  value: AssociationField;
  onChange: (updated: AssociationField) => void;
}

export const AssociationSelector: React.FC<AssociationSelectorProps> = ({
  value,
  onChange,
}) => {
  const toggleItem = (item: AssociationOption) => {
    const exists = value.items.includes(item);
    const nextItems = exists
      ? value.items.filter((i) => i !== item)
      : [...value.items, item];
    onChange({ ...value, items: nextItems });
  };

  return (
    <div className="border-t border-b border-[#D6CEBE] py-5 my-4 bg-[#F3EFE6]/60 px-4">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
        <label className="text-base font-display font-semibold text-[#1C1917]">
          ¿A qué está asociado? (Asociación contextual y espacial)
        </label>
        <span className="text-xs text-[#57534E]">
          Seleccione los elementos materiales o del paisaje asociados
        </span>
      </div>

      {/* Interactive Filter/Selection Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
        {ASSOCIATION_OPTIONS.map((option) => {
          const isSelected = value.items.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleItem(option)}
              className={`px-3 py-2 text-xs font-medium text-left rounded transition-colors whitespace-nowrap truncate border ${
                isSelected
                  ? 'bg-[#78350F] text-[#FBF9F5] border-[#78350F]'
                  : 'bg-[#FBF9F5] text-[#44403C] border-[#D6CEBE] hover:border-[#78350F]/50'
              }`}
            >
              {isSelected ? '✓ ' : '+ '}
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#44403C] mb-1.5">
            Naturaleza epistemológica de la asociación
          </label>
          <select
            value={value.tipoRelacion}
            onChange={(e) =>
              onChange({
                ...value,
                tipoRelacion: e.target.value as AssociationField['tipoRelacion'],
              })
            }
            className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
          >
            <option value="Documentada en contexto estratigráfico">
              Documentada en contexto estratigráfico
            </option>
            <option value="Observada en superficie (Hipótesis espacial)">
              Observada en superficie (Hipótesis espacial)
            </option>
            <option value="No determinada">No determinada</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#44403C] mb-1.5">
            Descripción de la asociación (matriz, distancia, contacto directo)
          </label>
          <input
            type="text"
            value={value.detalleAsociacion}
            onChange={(e) =>
              onChange({ ...value, detalleAsociacion: e.target.value })
            }
            placeholder="Ej. En estrato de ceniza Capa B a 15 cm del muro norte..."
            className="w-full px-3 py-2 text-sm bg-[#FBF9F5] border border-[#D6CEBE] rounded text-[#1C1917] focus:outline-none focus:border-[#78350F]"
          />
        </div>
      </div>
    </div>
  );
};

interface PhotoUploaderProps {
  value: string;
  onChange: (dataUrl: string, mimeType?: string) => void;
  label?: string;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  value,
  onChange,
  label = 'Fotografía de registro arqueológico',
}) => {
  const [imgError, setImgError] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImgError(false);
        onChange(reader.result, file.type);
      }
    };
    reader.readAsDataURL(file);
  };

  const loadSampleImage = async (imgUrl: string) => {
    try {
      setImgError(false);
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result, blob.type || 'image/jpeg');
        }
      };
      reader.readAsDataURL(blob);
    } catch {
      onChange(imgUrl, 'image/jpeg');
    }
  };

  return (
    <div className="my-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <label className="block text-xs font-semibold text-[#44403C]">
          {label}
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#78716C]">Cargar foto de demostración:</span>
          <button
            type="button"
            onClick={() => loadSampleImage(DEMO_IMAGES.ceramicAryballos)}
            className="px-2.5 py-1 text-xs bg-[#EBE6DF] hover:bg-[#D6CEBE] text-[#292524] rounded transition-colors whitespace-nowrap"
          >
            Cerámica (Demo)
          </button>
          <button
            type="button"
            onClick={() => loadSampleImage(DEMO_IMAGES.lithicProjectile)}
            className="px-2.5 py-1 text-xs bg-[#EBE6DF] hover:bg-[#D6CEBE] text-[#292524] rounded transition-colors whitespace-nowrap"
          >
            Lítico (Demo)
          </button>
          <button
            type="button"
            onClick={() => loadSampleImage(DEMO_IMAGES.incaArchitecture)}
            className="px-2.5 py-1 text-xs bg-[#EBE6DF] hover:bg-[#D6CEBE] text-[#292524] rounded transition-colors whitespace-nowrap"
          >
            Arquitectura (Demo)
          </button>
        </div>
      </div>

      {!value ? (
        <label className="flex flex-col items-center justify-center w-full h-36 border border-dashed border-[#A8A29E] rounded bg-[#FBF9F5] hover:bg-[#F3EFE6] cursor-pointer transition-colors p-4 text-center">
          <Upload className="w-5 h-5 text-[#78350F] mb-2" />
          <span className="text-sm font-medium text-[#292524]">
            Subir fotografía arqueológica (JPG, PNG, WEBP)
          </span>
          <span className="text-xs text-[#78716C] mt-1">
            Incluir escala métrica siempre que sea posible · Sin alteración digital
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative border border-[#D6CEBE] rounded bg-[#EBE6DF] p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#57534E]">
              Vista previa del registro gráfico
            </span>
            <button
              type="button"
              onClick={() => onChange('')}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-[#9A3412] hover:bg-[#FBF9F5] rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Quitar fotografía
            </button>
          </div>
          {!imgError ? (
            <img
              src={value}
              alt="Fotografía arqueológica de registro"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="max-h-64 w-auto mx-auto object-contain rounded border border-[#D6CEBE] bg-[#1C1917]"
            />
          ) : (
            <div className="h-40 flex flex-col items-center justify-center bg-[#F3EFE6] text-[#57534E] rounded p-4">
              <ImageIcon className="w-6 h-6 mb-1 text-[#78350F]" />
              <span className="text-xs">Registro fotográfico adjunto</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface AnalysisResultViewProps {
  analysis: AIAnalysisResult;
  title: string;
  isDemo?: boolean;
  onGenerateReport?: () => void;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  analysis,
  title,
  isDemo,
  onGenerateReport,
}) => {
  return (
    <div className="border border-[#D6CEBE] bg-[#FBF9F5] rounded p-6 space-y-6 mt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D6CEBE] pb-4">
        <div>
          <div className="text-xs text-[#78350F] font-medium mb-1">
            Resultado del Análisis Metodológico · Protocolo Anti-Alucinaciones Activo
            {isDemo ? ' · DATOS DE DEMOSTRACIÓN' : ''}
          </div>
          <h3 className="text-2xl font-display font-semibold text-[#1C1917]">
            {title}
          </h3>
          {(analysis.identificacionSintesis || analysis.identificacionPreliminar) && (
            <p className="text-sm text-[#44403C] mt-1 max-w-3xl">
              {analysis.identificacionSintesis || analysis.identificacionPreliminar}
            </p>
          )}
        </div>

        {onGenerateReport && (
          <button
            type="button"
            onClick={onGenerateReport}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#78350F] text-[#FBF9F5] rounded hover:bg-[#5C280B] transition-colors whitespace-nowrap shrink-0"
          >
            <FileText className="w-4 h-4" />
            Generar Informe Arqueológico
          </button>
        )}
      </div>

      {/* Advertencia metodológica / osteológica */}
      {analysis.advertenciaMetodologica && (
        <div className="p-4 bg-[#FEF3C7]/60 border-l-4 border-[#B45309] text-xs text-[#78350F] flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#B45309]" />
          <div>
            <strong className="font-semibold block mb-0.5">
              Nota Metodológica y Límites de Inferencia:
            </strong>
            {analysis.advertenciaMetodologica}
          </div>
        </div>
      )}

      {/* 5 Epistemological Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. DATOS OBSERVABLES */}
        <div className="border-t-2 border-[#1C1917] pt-3">
          <h4 className="text-sm font-semibold text-[#1C1917] mb-2">
            01. Datos Observables (Evidencia Empírica Directa)
          </h4>
          {analysis.datosObservables?.length ? (
            <ul className="space-y-1.5 text-sm text-[#292524] list-disc list-inside">
              {analysis.datosObservables.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#78716C] italic">
              Información insuficiente para establecer esta afirmación.
            </p>
          )}
        </div>

        {/* 2. INFORMACIÓN DOCUMENTADA */}
        <div className="border-t-2 border-[#14532D] pt-3">
          <h4 className="text-sm font-semibold text-[#14532D] mb-2">
            02. Información Documentada (Respaldo Bibliográfico / Tipológico)
          </h4>
          {analysis.informacionDocumentada?.length ? (
            <ul className="space-y-1.5 text-sm text-[#292524] list-disc list-inside">
              {analysis.informacionDocumentada.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#78716C] italic">
              Información insuficiente para establecer esta afirmación.
            </p>
          )}
        </div>

        {/* 3. INTERPRETACIÓN */}
        <div className="border-t-2 border-[#78350F] pt-3">
          <h4 className="text-sm font-semibold text-[#78350F] mb-2">
            03. Interpretación Técnica
          </h4>
          {analysis.analisisTecnico && (
            <p className="text-sm text-[#44403C] mb-2 leading-relaxed">
              {analysis.analisisTecnico}
            </p>
          )}
          {analysis.interpretacion?.length ? (
            <ul className="space-y-1.5 text-sm text-[#292524] list-disc list-inside">
              {analysis.interpretacion.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#78716C] italic">
              Información insuficiente para establecer esta afirmación.
            </p>
          )}
        </div>

        {/* 4. HIPÓTESIS */}
        <div className="border-t-2 border-[#9A3412] pt-3">
          <div className="flex items-baseline justify-between mb-2">
            <h4 className="text-sm font-semibold text-[#9A3412]">
              04. Hipótesis de Trabajo (Sujetas a Contrastación)
            </h4>
            <span className="text-xs text-[#9A3412]">No constituye un hecho</span>
          </div>
          {analysis.hipotesis?.length ? (
            <ul className="space-y-1.5 text-sm text-[#292524] list-disc list-inside">
              {analysis.hipotesis.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#78716C] italic">
              Información insuficiente para establecer esta afirmación.
            </p>
          )}
        </div>
      </div>

      {/* 5. INFORMACIÓN INSUFICIENTE & EVALUACIÓN DE ASOCIACIÓN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-[#D6CEBE]">
        <div>
          <h4 className="text-sm font-semibold text-[#57534E] mb-2">
            05. Información Insuficiente (Límites de la Evidencia Actual)
          </h4>
          {analysis.informacionInsuficiente?.length ? (
            <ul className="space-y-1.5 text-sm text-[#44403C] list-disc list-inside">
              {analysis.informacionInsuficiente.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#44403C]">
              Información insuficiente para establecer afirmaciones fuera de los atributos registrados.
            </p>
          )}
        </div>

        {analysis.evaluacionAsociacion && (
          <div>
            <h4 className="text-sm font-semibold text-[#1C1917] mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#78350F]" />
              Evaluación de Asociaciones Contextuales ("¿A qué está asociado?")
            </h4>
            <p className="text-sm text-[#292524] leading-relaxed">
              {analysis.evaluacionAsociacion}
            </p>
          </div>
        )}
      </div>

      {/* 10. PREGUNTAS A LA EVIDENCIA */}
      {analysis.preguntasEvidencia && (
        <div className="border-t border-[#D6CEBE] pt-5">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-[#78350F]" />
            <h4 className="text-lg font-display font-semibold text-[#1C1917]">
              Preguntas a la Evidencia (Cuestionamiento Metodológico)
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-3.5 bg-[#F3EFE6] border border-[#D6CEBE] rounded">
              <div className="text-xs font-semibold text-[#78350F] mb-1">
                1. ¿Qué evidencia permite sostener esta interpretación?
              </div>
              <p className="text-xs text-[#292524] leading-relaxed">
                {analysis.preguntasEvidencia.evidenciaSostener}
              </p>
            </div>
            <div className="p-3.5 bg-[#F3EFE6] border border-[#D6CEBE] rounded">
              <div className="text-xs font-semibold text-[#78350F] mb-1">
                2. ¿Qué información falta?
              </div>
              <p className="text-xs text-[#292524] leading-relaxed">
                {analysis.preguntasEvidencia.informacionFalta}
              </p>
            </div>
            <div className="p-3.5 bg-[#F3EFE6] border border-[#D6CEBE] rounded">
              <div className="text-xs font-semibold text-[#78350F] mb-1">
                3. ¿Qué otros materiales deberían buscarse?
              </div>
              <p className="text-xs text-[#292524] leading-relaxed">
                {analysis.preguntasEvidencia.otrosMateriales}
              </p>
            </div>
            <div className="p-3.5 bg-[#F3EFE6] border border-[#D6CEBE] rounded">
              <div className="text-xs font-semibold text-[#78350F] mb-1">
                4. ¿Qué relación espacial existe?
              </div>
              <p className="text-xs text-[#292524] leading-relaxed">
                {analysis.preguntasEvidencia.relacionEspacial}
              </p>
            </div>
            <div className="p-3.5 bg-[#F3EFE6] border border-[#D6CEBE] rounded">
              <div className="text-xs font-semibold text-[#78350F] mb-1">
                5. ¿La asociación está documentada o es una hipótesis?
              </div>
              <p className="text-xs text-[#292524] leading-relaxed">
                {analysis.preguntasEvidencia.asociacionEstado}
              </p>
            </div>
            <div className="p-3.5 bg-[#F3EFE6] border border-[#D6CEBE] rounded">
              <div className="text-xs font-semibold text-[#78350F] mb-1">
                6. ¿Qué análisis especializado sería necesario?
              </div>
              <p className="text-xs text-[#292524] leading-relaxed">
                {analysis.preguntasEvidencia.analisisEspecializado}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 11. REFERENCIAS APA 7 */}
      <div className="border-t border-[#D6CEBE] pt-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#78350F]" />
            <h4 className="text-lg font-display font-semibold text-[#1C1917]">
              Referencias Documentales (Formato APA 7)
            </h4>
          </div>
          <span className="text-xs text-[#57534E]">
            Prohibida la invención de fuentes · Solo referencias reales
          </span>
        </div>

        {analysis.referenciasAPA?.length ? (
          <div className="space-y-2.5">
            {analysis.referenciasAPA.map((ref, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#F3EFE6]/70 border-l-2 border-[#78350F] text-xs text-[#292524]"
              >
                <p className="font-medium leading-relaxed mb-1">
                  {ref.citaCompletaAPA7 ||
                    `${ref.autor} (${ref.anio}). ${ref.titulo}. ${ref.publicacion}${
                      ref.pagina ? `, ${ref.pagina}` : ''
                    }.`}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[#57534E]">
                  <span>Autor: {ref.autor}</span>
                  <span aria-hidden="true">·</span>
                  <span>Año: {ref.anio}</span>
                  <span aria-hidden="true">·</span>
                  <span>Publicación: {ref.publicacion}</span>
                  {ref.pagina && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>Pág.: {ref.pagina}</span>
                    </>
                  )}
                  {ref.enlace && ref.enlace.startsWith('http') && (
                    <>
                      <span aria-hidden="true">·</span>
                      <a
                        href={ref.enlace}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#78350F] underline hover:text-[#5C280B]"
                      >
                        Enlace verificable <ExternalLink className="w-3 h-3" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#57534E] italic">
            No se han citado fuentes bibliográficas externas adicionales para este registro específico.
          </p>
        )}

        {/* Grounding Web Links if returned by Google Search */}
        {analysis.groundingLinks && analysis.groundingLinks.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[#D6CEBE]/70">
            <div className="text-xs font-semibold text-[#44403C] mb-2">
              Enlaces de Verificación Recuperados en Búsqueda Documental:
            </div>
            <div className="flex flex-wrap gap-3">
              {analysis.groundingLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#78350F] hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span className="truncate max-w-xs">{link.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
