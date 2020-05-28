import { createAction, props } from '@ngrx/store';
import { Usuario } from '../models/usuario.model';

export const setUser = createAction(
    '[Counter Component] Set User',
    props<{ user: Usuario }>()
    );


export const unSetUser = createAction('[Counter Component] Un Set User');
