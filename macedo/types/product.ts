export type Product = {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  price: string; // la API lo devuelve como string
  stock: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductInput = {
  name: string;
  description?: string;
  price: number; // al enviar se manda como número
  stock?: number;
  active?: boolean;
};