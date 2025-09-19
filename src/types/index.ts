export interface EditRegion {
  id: string;
  name: string;
  type: 'posture' | 'cosmetic' | 'repair' | 'enhancement';
  coordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface EditEffect {
  id: string;
  name: string;
  type: 'straighten' | 'align' | 'position' | 'brightness' | 'smoothness' | 'color';
  intensity: number;
  min: number;
  max: number;
  step: number;
}

export interface VisualEdit {
  region: string;
  effect: string;
  intensity: number;
  timestamp: string;
}

export interface ProcessingResult {
  before_after: {
    before: string;
    after: string;
  };
  edits: VisualEdit[];
  report?: string;
  artifact?: string;
  metadata: {
    processing_time: string;
    confidence_score: number;
    enhancement_type: string;
    timestamp: string;
  };
}

export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'photo' | 'scan';
  uploadedAt: Date;
}

export interface ExportOptions {
  format: 'jpg' | 'png' | 'glb' | 'pdf';
  quality?: number;
  includeMetadata?: boolean;
  includeReport?: boolean;
}

export interface RegionSelectorProps {
  regions: EditRegion[];
  selectedRegion: string | null;
  onRegionSelect: (regionId: string) => void;
  onRegionAdd: (region: Omit<EditRegion, 'id'>) => void;
  onRegionRemove: (regionId: string) => void;
}

export interface EffectSliderProps {
  effect: EditEffect;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export interface BeforeAfterViewerProps {
  beforeImage: string;
  afterImage: string;
  sliderPosition: number;
  onSliderChange: (position: number) => void;
  showOverlay?: boolean;
}
