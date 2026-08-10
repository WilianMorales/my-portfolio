export interface LocalizedText {
  es: string;
  en: string;
}

export type ProjectType = 'frontend' | 'backend' | 'fullstack';

export interface Project {
  title: string;
  description: LocalizedText;
  image: string;
  images?: string[];
  type: ProjectType;
  technologies: string[];
  demo?: string;
  repo?: string;
}
