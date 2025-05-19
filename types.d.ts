type BaseCategory = {
  id: number;
  title: string;
  slug: string;
  order?: number;
};

type PageCategory = BaseCategory & {
  newsPages?: NewsPage[];
};

type NewspaperCategory = BaseCategory & {
  newspapers?: Newspaper[];
};

type MapData = {
  id: number;
  coordinates: string;
  title?: string | null;
  croppedImage?: string | null;
  newsPageId: number;
  newsPage?: NewsPage;
};

type NewsPage = {
  id: number;
  date: string;
  image: string;
  thumbnail: string;
  titleId?: number | null;
  title?: PageCategory | null;
  mapData?: MapData[];
  newspapers?: Newspaper[];
  lastModified?: string | null;
};

type Newspaper = {
  id: number;
  date: string;
  titleId: number;
  title: NewspaperCategory;
  newspaperPages?: NewsPage[];
};
