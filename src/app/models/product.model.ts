export interface category{
  id: string;
  name:string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  description: string;
  category: category;
}


export interface CreateProductDTO extends Omit<Product, 'id' | 'category'>{ // se utiliza omit para que no tenga en cuenta los parametros que le pasas
  categoryId: number;
}