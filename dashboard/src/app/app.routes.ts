import { Routes } from '@angular/router';
import {HomeComponet} from './modules/home/home'
import { PessoalComponent } from './modules/pessoal/pessoal';
import { RotinasComponent } from './modules/rotinas/rotinas';
import { SinaisVitaisComponent } from './modules/sinaisVitais/sinais-vitais';
import { LoginComponent } from './modules/login/login';

export const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'home', component: HomeComponet},
    {path: 'pessoal', component: PessoalComponent},
    {path: 'rotinas', component: RotinasComponent},
    {path: 'sinais-vitais', component: SinaisVitaisComponent},
];
