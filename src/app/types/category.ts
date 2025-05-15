export interface Category {
    id: number;
    title: string;
    slug: string;
    order: number;
  }
  
  export interface NewspaperCategory extends Category {
    newspapers?: any[];
  }
  
  export interface PageCategory extends Category {
    newsPages?: any[];
  }