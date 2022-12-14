import { Component, OnInit } from '@angular/core';

import { CreateProductDTO, Product, UpdateProductDTO } from '../../models/product.model';

import { switchMap } from 'rxjs/operators';

import { zip } from 'rxjs';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  showProductDetail = false;
  productChosen : Product ={
    id: '',
    price: 0,
    images: [],
    title: '',
    category: { id : '', name: ''},
    description: ''
  };
  limit= 10;
  offset = 0;
  statusDetail : 'loading' | 'sucess' | 'error' | 'initial' = 'initial';

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getProductByPage(10,0)
    .subscribe(data => {
      this.products = data;
    });
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail(){
   this.showProductDetail =  !this.showProductDetail ;
  }

  onShowDetail(id:string){
    this.statusDetail = 'loading';
    this.toggleProductDetail(); //se pone esto aca para cuando haga el request todo ya abra, ya que no es directo
    this.productsService.getProduct(id)
    .subscribe(data => {
      this.statusDetail = 'sucess';
      this.productChosen = data;
    }, errorMsg => {
      window.alert(errorMsg);
      this.statusDetail = 'error';
    });
  }

  readAndUpdate(id:string){
    // manera para hacer cuando hay dependencias
    this.productsService.getProduct(id).
    pipe(
      switchMap((product) => {return this.productsService.update(product.id, {title: 'change'})})
    ).subscribe(
      data =>  {
        console.log(data);
      }
    );/*
    zip( // zip cuando no hay dependecias, mejor del lado del servicio y no componente
      this.productsService.getProduct(1),
      this.productsService.update(id,{title:'change'})
    ).subscribe(response => { // se guardan las respuestas en el response en un arrays
      const product = response [0];
      const update = response [1];
    })*/
    this.productsService.fetchReadAndUpdate(id,{title: 'change'} ).subscribe(
      response => {
        const read = response[0];
        const update = response[1];
      }
    )

  }

  createNewProduct(){
    const product : CreateProductDTO = {
      title: 'Nuevo Producto',
      description: 'bla bla bla',
      images: [''],
      price: 1000,
      categoryId:2
    }
    this.productsService.create(product).subscribe(data => {console.log ('created', data); this.products.unshift(data)});
  }

  updateProduct (){
    const changes :UpdateProductDTO = {
      title: 'new title'
    }
    this.productsService.update(this.productChosen.id, changes).subscribe(data => {
      const productIndex  = this.products.findIndex(item => item.id === this.productChosen.id);
      this.products[productIndex] = data;
      this.productChosen = data;
    })
  }

  deleteProduct(){
    const id = this.productChosen.id;
    this.productsService.delete(id).subscribe(()=> {
      const productIndex  = this.products.findIndex(item => item.id === this.productChosen.id);
      this.products.splice(productIndex,1); //siempre aclarar cuantos se eliminan o elimina todos
      this.showProductDetail = false;
    } )
  }

  loadMore(){
    this.productsService.getProductByPage(this.limit,this.offset)
    .subscribe(data => {
      //this.products = data;
      this.products = this.products.concat(data);
      this.offset += this.limit;
    });
  }
}
