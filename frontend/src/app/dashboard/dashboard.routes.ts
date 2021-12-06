import {Ng2StateDeclaration} from '@uirouter/angular';
import {DashboardPageComponent} from './components/dashboard-page/dashboard-page.component';


export let DASHBOARD_STATES: Ng2StateDeclaration[] = [
  {
    name: 'app.dashboard',
    url: '/dashboard',
    component: DashboardPageComponent
  }
];
