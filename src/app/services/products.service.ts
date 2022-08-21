import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { retry } from 'rxjs/operators';

import { CreateProductDTO, Product, UpdateProductDTO } from './../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'https://young-sands-07814.herokuapp.com/api/products'; //guardo la api en una variable porque la reutilizo muchas veces

  constructor(
    private http: HttpClient
  ) { }

  getAllProducts(limit?: number, offset?: number) {
    let params = new HttpParams(); // esto permite poner parametros o no
    if (limit && offset){
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(this.apiUrl, {params}).pipe(retry(3)); // ante una falla reintenta el numero de veces que le digas, en este caso 3 veces gracias al metodo retry
  }

  getProduct(id:string){
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
  }

  getProductByPage(limit: number, offset: number){
    return this.http.get<Product[]>(`${this.apiUrl}`,{
     params :{limit,offset} // le paso los parametros para limitar (la cantidad que quiero) y offset seria a partir de que posicion
    });
  }

  create (data: CreateProductDTO){
    return this.http.post<Product>(this.apiUrl,data); // el segundo parametro es lo que se manda en el post
  }

  update (id:string,dto: UpdateProductDTO){
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto); // se puede usar put o patch depende mas que nada del back end dev, put manda todo y patch manda lo que se cambia unicamente
  }

  delete (id:string){
    return this.http.delete<Boolean>(`${this.apiUrl}/${id}`)
  }
}
