import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ieActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs: Subscription;
  ingresosSubs: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoS: IngresoEgresoService
  ) { }

  ngOnInit(): void {
    this.userSubs = this.store.select('auth')
      .pipe(
        filter( auth => auth.user != null )
      )
      .subscribe( ({user}) => {
        this.ingresosSubs = this.ingresoEgresoS.initIngresoEgresosListener(user.uid)
          .subscribe( ingresosEgresosFB => {
            this.store.dispatch( ieActions.setItems( { items: ingresosEgresosFB } ) );
          });
      });
  }

  ngOnDestroy(){
    this.userSubs?.unsubscribe();
    this.ingresosSubs.unsubscribe();
  }

}
