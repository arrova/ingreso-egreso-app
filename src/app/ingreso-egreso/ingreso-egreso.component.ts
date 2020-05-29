import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ui from '../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;
  tipo = 'ingreso';
  cargando = false;
  uiSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private ingreEgre: IngresoEgresoService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });
    this.uiSubscription = this.store.select('ui').subscribe( ui => this.cargando = ui.isLoading );
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  guardar(){
    if( this.ingresoForm.invalid ){
      return;
    }
    this.store.dispatch( ui.isLoading() );
    const { descripcion, monto } = this.ingresoForm.value;

    const ingresoEgreso = new IngresoEgreso( descripcion, monto, this.tipo );
    this.ingreEgre.crearIngresoEgreso( ingresoEgreso )
      .then( () => {
        this.store.dispatch( ui.stopLoading() );
        this.ingresoForm.reset();
        Swal.fire(
          'Registro creado',
          descripcion,
          'success'
        );
      })
      .catch( err => {
        this.store.dispatch( ui.stopLoading() );
        Swal.fire(
          'Error',
          err.essage,
          'error'
        );
      })
  }

}
