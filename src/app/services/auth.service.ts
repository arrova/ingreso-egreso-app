import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    public firestore: AngularFirestore
  ) { }

  initAuthListener(){
    this.auth.authState.subscribe( fuser => {

    });
  }

  crearUsuario( nombre: string, correo: string, password: string ){
    return this.auth.createUserWithEmailAndPassword( correo, password )
      .then( ({ user }) => {
        const newUser = new Usuario( user.uid, nombre, user.email );
        return this.firestore.doc(`${user.uid}/usuario`)
          .set({ ...newUser });
      });
  }

  loginUsuario( correo: string, password: string ){
    return this.auth.signInWithEmailAndPassword( correo, password );
  }

  logout(){
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe(
      map( fuser => fuser != null)
    );
  }

}
