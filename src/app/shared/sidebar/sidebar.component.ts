import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from '../../models/usuario.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  user: Usuario;
  userSub: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.userSub = this.store.select('auth')
      .pipe(
        filter( auth => auth.user != null )
      )
      .subscribe( ({user}) => {
        this.user = user;
      });
  }

  ngOnDestroy(): void{
    this.userSub.unsubscribe();
  }

  logout(){
    Swal.fire({
      title: 'Espere por favor!',
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });
    this.auth.logout()
      .then( ()  => {
        Swal.close();
        this.router.navigate(['/login']);
      });
  }

}
