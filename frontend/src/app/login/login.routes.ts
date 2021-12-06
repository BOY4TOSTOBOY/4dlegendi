import { LoginPageComponent } from './components/login-page/login-page.component';
import { Ng2StateDeclaration } from '@uirouter/angular';
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';
import { GreetingScreenContainerComponent } from './components/greeting-screen-container/greeting-screen-container.component';

export let LOGIN_STATES: Ng2StateDeclaration[] = [
  {
    name: 'login',
    url: '/login',
    component: LoginPageComponent
  },
  {
    name: 'reset-password',
    url: '/password/reset/confirm/:uid/:token/',
    component: ResetPasswordComponent
  },
  {
    name: "to-come",
    url:'/login/log-in',
    component: GreetingScreenContainerComponent
  }
];
