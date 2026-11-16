export type BookFormat = 'Paperback' | 'Hardcover' | 'eBook';

export type CoverArt =
  | 'target'
  | 'book'
  | 'arrow'
  | 'house'
  | 'moon'
  | 'couple'
  | 'rocket'
  | 'arch'
  | 'cat'
  | 'circles';

/** Describes how a generated (SVG) book cover looks – there are no image files for covers. */
export interface CoverSpec {
  art: CoverArt;
  bg: string;
  bg2?: string;
  fg: string;
  accent: string;
  titleLines: string[];
  titleSize?: number;
  subtitle?: string;
  authorColor?: string;
}

export type CatalogSection = 'recommended' | 'bestseller' | 'new' | 'more';

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  tagline: string;
  longDescription: string;
  publisher: string;
  format: BookFormat;
  language: string;
  genres: string[];
  categories: string[];
  price: number;
  rating: number;
  sold: number;
  section: CatalogSection;
  cover: CoverSpec;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
}
