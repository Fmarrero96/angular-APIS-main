import { Component } from '@angular/core';

import { Product } from './models/product.model';

import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { FilesService } from './services/files.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  imgParent = '';
  showImg = true;
  token = '';
  imgRta = '';

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private filesService: FilesService
  ){}

  onLoaded(img: string) {
    console.log('log padre', img);
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }

  createUser(){
    this.userService.create({
      name: 'sebas',
      email: 'sebas@hotmail.com',
      password: '12345'
    }).subscribe(
      rta => {
        console.log(rta);
      }
    )
  }

  login(){
    this.authService.login('sebas@hotmail.com','12345').subscribe(
      rta => {
        this.token = rta.access_token;
      }
    )
  }

  getProfile(){
    this.authService.getProfile().subscribe(
      profile =>{
        console.log(profile)
      }
    );
  }

  downloadPdf(){
    this.filesService.getFiles('my.pdf','https://young-sands-07814.herokuapp.com/api/files/dummy.pdf','application/pdf')
    .subscribe()
  }

  onUpload(event: Event){
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0) as Blob;
    if (file){}
    this.filesService.uploadFile(file)
    .subscribe(rta => {this.imgRta = rta.location})
  }



  
  }


