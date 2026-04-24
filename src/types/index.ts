export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  available: boolean;
  specs: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  justification: string;
}

export interface RequestForm {
  requester_name: string;
  requester_email: string;
  department: string;
  items: CartItem[];
}

export type Category =
  | 'Todos'
  | 'Headsets'
  | 'Mouses'
  | 'Mousepads'
  | 'Monitores'
  | 'Hubs USB'
  | 'Teclados'
  | 'Webcams'
  | 'Outros';
