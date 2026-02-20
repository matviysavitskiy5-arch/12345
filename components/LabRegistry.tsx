import React from 'react';
import { 
  LinearEquationLab, 
  WordStructureLab, 
  PressureLab, 
  HistoryChronologyLab, 
  MapScaleLab,
  LabProps
} from './SpecificLabs';
import { 
  MathEngine, 
  PhysicsEngine, 
  ChemistryEngine, 
  UkrHistoryEngine, 
  UkrLanguageEngine, 
  BiologyEngine, 
  GeographyEngine 
} from './TaskEngines';

// Mapping of Topic ID from constants.ts to Specific Lab Component
const LAB_REGISTRY: Record<string, React.FC<LabProps>> = {
  // Algebra 7: Linear Equations
  'alg-7-1': LinearEquationLab,
  
  // Ukrainian 5: Word Structure
  'ukr-5-2': WordStructureLab,
  
  // Physics 7: Pressure
  'phys-7-4': PressureLab,
  
  // History 5: Chronology (Mapped to "History as Science" for demo)
  'hist-5-1': HistoryChronologyLab,
  
  // Geography 6: Earth on map
  'geo-6-2': MapScaleLab,
};

// Helper to get fallback engine based on subject name
const getFallbackEngine = (subjectName: string): React.FC<any> => {
    const s = subjectName.toLowerCase();
    if (s.includes('алгебра') || s.includes('геометрія') || s.includes('математика')) return MathEngine;
    if (s.includes('фізика')) return PhysicsEngine;
    if (s.includes('хімія')) return ChemistryEngine;
    if (s.includes('історія')) return UkrHistoryEngine;
    if (s.includes('мова') || s.includes('література') || s.includes('англійська')) return UkrLanguageEngine;
    if (s.includes('біологія') || s.includes('природа')) return BiologyEngine;
    if (s.includes('географія')) return GeographyEngine;
    return UkrLanguageEngine;
};

export const getLabComponent = (topicId: string, subjectName: string): React.FC<LabProps> => {
  const SpecificLab = LAB_REGISTRY[topicId];
  if (SpecificLab) {
    return SpecificLab;
  }
  return getFallbackEngine(subjectName);
};