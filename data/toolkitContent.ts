import raw from "./toolkit-content.json";

export interface ToolkitCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  slideCount: number;
}

export interface ToolkitPanel {
  label: string;
  description: string;
}

export interface ToolkitSlide {
  id: string;
  title: string;
  categoryId: string;
  category: string;
  format: string;
  num: string;
  summary: string;
  tip: string;
  highlight?: string;
  steps?: string[];
  useCases?: string[];
  mood?: string;
  setup?: string;
  panels?: ToolkitPanel[];
  htmlPath: string;
  /** Diagram PNG for HTML deck: `ava/<category>/<file>.png` */
  diagramImage?: string;
}

export interface FeaturedTip {
  id: string;
  title: string;
  summary: string;
  slideId: string;
  categoryId: string;
}

export interface ToolkitContent {
  version: string;
  categories: ToolkitCategory[];
  slides: ToolkitSlide[];
  featuredTips: FeaturedTip[];
  brand: {
    primary: string;
    accent: string;
    background: string;
    card: string;
    tagline: string;
    phrase: string;
  };
}

export const toolkitContent = raw as ToolkitContent;

export const toolkitSlides = toolkitContent.slides;
export const toolkitCategories = toolkitContent.categories;
export const featuredTips = toolkitContent.featuredTips;

export function getSlideById(id: string): ToolkitSlide | undefined {
  return toolkitSlides.find((s) => s.id === id);
}

export function getSlidesByCategory(categoryId: string): ToolkitSlide[] {
  return toolkitSlides.filter((s) => s.categoryId === categoryId);
}

export function getCategoryById(id: string): ToolkitCategory | undefined {
  return toolkitCategories.find((c) => c.id === id);
}
