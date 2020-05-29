import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';
import * as ieActions from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;
  private _user: Usuario;
  get user() {
    return {... this._user};
  }

  constructor(
    private auth: AngularFireAuth,
    public firestore: AngularFirestore,
    private store: Store<AppState>
  ) { }

  initAuthListener(){
    this.auth.authState.subscribe( fUser => {
      if( fUser ){
        this.userSubscription = this.firestore.doc( `${ fUser.uid }/usuario` ).valueChanges()
          .subscribe( (firestoreUser: any) => {
            const user = Usuario.fromFirebase( firestoreUser );
            this._user = user;
            this.store.dispatch( authActions.setUser( { user } ) );
          });
        }else{
          this._user = null;
          this.userSubscription?.unsubscribe();
          this.store.dispatch( ieActions.unSetItems() );
          this.store.dispatch( authActions.unSetUser() );
      }
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
