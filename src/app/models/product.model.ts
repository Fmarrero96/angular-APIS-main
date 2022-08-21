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


export interface UpdateProductDTO extends Partial<CreateProductDTO>{} // partial lo que hace es colocarle el signo de pregunta, osea los vuelve opcionales a todos