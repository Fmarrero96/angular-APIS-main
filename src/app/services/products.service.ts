import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';
import { throwError, zip } from 'rxjs';

import { CreateProductDTO, Product, UpdateProductDTO } from './../models/product.model';

import { environment} from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = `${environment.API_URL}/api/products`; //se desarrollo un proxy para que modifique la URL, con la interpolacion en environment.API_URL lo que hago es obtener si es un ambiente de produccion la url y si no vacio en desarrollo pero este llamaria al proxy
  constructor(
    private http: HttpClient
  ) { }

  getAllProducts(limit?: number, offset?: number) {
    let params = new HttpParams(); // esto permite poner parametros o no
    if (limit && offset){
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(this.apiUrl, {params}).pipe(
      retry(3),
      map(products => products.map(item => {
        return {
          ...item,
          taxes: 0.19 * item.price
        }
      }
         )));
       // ante una falla reintenta el numero de veces que le digas, en este caso 3 veces gracias al metodo retry
  }

  getProduct(id:string){
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => { // control de errores desde el lado del servicio
        if (error.status === HttpStatusCode.Conflict) {
          return throwError('algo esta fallando en el server');
        }
        if (error.status === HttpStatusCode.NotFound){
          return throwError('el producto no existe');
        }
        if (error.status === HttpStatusCode.Unauthorized){
          return throwError('No estas autorizado');
        }
        return throwError('Ups algo salio mal');
      })
    )
  }

  getProductByPage(limit: number, offset: number){
    return this.http.get<Product[]>(`${this.apiUrl}`,{
     params :{limit,offset} // le paso los parametros para limitar (la cantidad que quiero) y offset seria a partir de que posicion
    }).pipe(
      map(products => products.map(item => {
        return {
          ...item,
          taxes: 0.19 * item.price
        }
      }
         )));
      
  }

  fetchReadAndUpdate(id:string,dto: UpdateProductDTO){
    return zip(
    this.getProduct(id),
    this.update(id,dto)
  )
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
