export interface NewsPage {
  id: number;
  date: string;
  image: string;
  title?: PageCategory;
  mapData?: MapData[];
  newspapers?: Newspaper[];
  lastModified?: string; // Added this property to fix the type error
}

export interface Newspaper {
  id: number;
  date: string;
  title: NewspaperCategory;
  newspaperPages?: NewsPage[];
}

export interface NewspaperCategory {
  id: number;
  title: string;
  slug: string;
}

export interface PageCategory {
  id: number;
  title: string;
  slug: string;
}

export interface MapData {
  id: number;
  coordinates: string;
  title?: string;
  croppedImage?: string;
}
