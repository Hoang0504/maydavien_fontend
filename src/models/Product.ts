export interface Product {
  id?: number;
  name: string;
  slug?: string;
  image: string;
  price: number;
  old_price: number;
  category?: {
    id: number;
    name: string;
    slug: string;
    image: string;
    description: string;
    status: number;
    created_at: string;
    updated_at: string;
  };
  attributes: {
    id?: number;
    name: string;
    value: string;
  }[];
  images: string[];
  deletedImages?: string[];
  description: string;
  status?: number;
  created_at?: string;
  updated_at?: string;
}
