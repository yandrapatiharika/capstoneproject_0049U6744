export interface PriceRange {
  label: string;
  min: number;
  max: number;
}

export const CATEGORIES = [
  'All',
  'Romance',
  'Mystery',
  'Science Fiction',
  'Fantasy',
  'Historical',
  'Biography',
  'Self-help',
  'Memoir',
  'Travel',
  'Cooking',
  "Children's",
  'Young Adult',
  'Comics & Graphic Novels',
  'Poetry',
  'Drama',
  'Science',
  'Philosophy',
  'Religion',
  'Language Learning',
];

export const LANGUAGES = ['All', 'English', 'Hindi', 'Telugu'];

export const FORMATS = ['All', 'Paperback', 'Hardcover', 'eBook'];

export const PRICE_RANGES: PriceRange[] = [
  { label: 'All', min: 0, max: Infinity },
  { label: 'Under ₹150', min: 0, max: 149 },
  { label: '₹150 – ₹300', min: 150, max: 300 },
  { label: '₹300 – ₹500', min: 301, max: 500 },
  { label: 'Above ₹500', min: 501, max: Infinity },
];

export const SORT_OPTIONS = [
  'Relevance',
  'Price: Low to High',
  'Price: High to Low',
  'Title: A to Z',
  'Top Rated',
];

export const SECTION_TITLES: Record<string, string> = {
  recommended: 'Recommended for You',
  bestseller: 'Bestsellers this Month',
  new: 'New Launches',
  more: 'More to Explore',
};

export const SECTION_ORDER = ['recommended', 'bestseller', 'new', 'more'] as const;
