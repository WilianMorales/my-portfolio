export interface LocalizedText {
  es: string;
  en: string;
}

export interface Project {
  title: string;
  description: LocalizedText;
  image: string;
  images?: string[];
  technologies: string[];
  demo?: string;
  repo?: string;
}
