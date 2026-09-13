import {Component, signal, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {MatSidenav} from '@angular/material/sidenav';
import {SidenavComponent} from '@app/shared/components/sidenav/sidenav.component';
import {BodyComponent} from './shared/pages/body/body.component';
import {LoginEventService} from './iam/services/login-event.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {DetailsService} from './shared/services/details.service';

interface SideNavToggle{
  screenWidth: number;
  collapsed: boolean;
}

export const LOGOUT_OPTION = {
  svg: `<svg width="25" height="25" viewBox="0 0 15 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M0.877 7.5c0-3.658 2.965-6.623 6.623-6.623s6.623 2.965 6.623 6.623-2.965 6.623-6.623 6.623S0.877 11.158 0.877 7.5zm6.623-5.673c-3.133 0-5.673 2.54-5.673 5.673s2.54 5.673 5.673 5.673 5.673-2.54 5.673-5.673-2.54-5.673-5.673-5.673zm2.354 3.319a.5.5 0 0 1 0 .707L8.207 7.5l1.647 1.647a.5.5 0 0 1-.707.707L7.5 8.207l-1.647 1.647a.5.5 0 0 1-.707-.707L6.793 7.5 5.146 5.854a.5.5 0 0 1 .707-.707L7.5 6.793l1.647-1.647a.5.5 0 0 1 .707 0z"/></svg>`,
  path: '/sign-in',
  title: 'Cerrar Sesión'
};

@Component({
  selector: 'app-root',
  imports: [SidenavComponent, BodyComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})


export class App {
  protected readonly title = signal('Synhub');
  showSideBar = false;
  redirect = '';

  @ViewChild(MatSidenav, {static: true}) sidenav!: MatSidenav;



  constructor(private router: Router, private loginEventService: LoginEventService, private sanitizer: DomSanitizer) {

    for (const option of this.optionsLeader) {
      if (option.svg) {
        option.svg = <string>this.sanitizer.bypassSecurityTrustHtml(option.svg);
      }
    }

    for (const option of this.optionsMember) {
      if (option.svg) {
        option.svg = <string>this.sanitizer.bypassSecurityTrustHtml(option.svg);
      }
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        if (currentRoute.includes('sign-in') || currentRoute.includes('sign-up')) {
          localStorage.clear();
          this.screenWidth = 0;
        }
        if (currentRoute.includes('members/group-search')){
          this.screenWidth = 0;
        }
        this.showSideBar = !(currentRoute.includes('sign-in') || currentRoute.includes('sign-up') || currentRoute === '/' || currentRoute.includes('members/group-search'));
        //console.log('Ruta actual:', currentRoute);
        //console.log('showToolbar:', this.showSideBar);
        this.loginEventService.loginSuccess$.subscribe(() => {
          this.screenWidth = 1;
        });
      }
    });
    this.setRedirect();
  }

  private setRedirect() {
    if (this.isLeader) {
      this.redirect = '/leaders/main';
    } else {
      this.redirect = '/members/main';
    }
  }

  get isMember(): boolean {
    return localStorage.getItem('role') === 'ROLE_MEMBER';
  }

  get isLeader(): boolean {
    return localStorage.getItem('role') === 'ROLE_LEADER';
  }

  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }



  optionsLeader=[
    {
      svg: `<svg width="24" height="24" viewBox="0 0 960 960" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M0 720v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65zm240 0v-65q0-32 17.5-58.5T307 550t76.5-30T480 510q53 0 97.5 10t76.5 30 49 46.5T720 655v65zm540 0v-65q0-26-6.5-49T754 563q11-2 22.5-2.5T800 560q72 0 116 26.5T960 657v63zm-455-80h311q-10-20-55.5-35T480 590t-100.5 15T325 635zm-165-115q-33 0-56.5-23.5T80 440q0-34 23.5-57T160 360q34 0 57 23t23 57q0 33-23 56.5T160 520zm640 0q-33 0-56.5-23.5T720 440q0-34 23.5-57T800 360q34 0 57 23t23 57q0 33-23 56.5T800 520zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5T480 280q51 0 85.5 34.5T600 360q0 50-34.5 85T480 480zm0-80q17 0 28.5-11.5T520 360t-11.5-28.5T480 320t-28.5 11.5T440 360t11.5 28.5T480 400z"/></svg>`,
      path: '/leaders/my-group',
      title: 'Mi Grupo'
    },
    {
      svg: `<svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zm9.5-.5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/></svg>`,      path: 'leaders/my-group/members',
      title: 'Integrantes'
    },
    {
      svg: `<svg width="24" height="24" viewBox="0 0 960 960" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M560 440h280V240H560zm140-50-100-70v-40l100 70 100-70v40zm-620 450q-33 0-56.5-23.5T0 760V200q0-33 23.5-56.5T80 120h800q33 0 56.5 23.5T960 200v560q0 33-23.5 56.5T880 840zm556-80h244V200H80v560h4q42-75 116-117.5T360 600q160 42.5 236 160zm-276-200q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35zm-178 200h356q-34-38-80.5-59T360 680q-97 21-81 59zm178-280q-17 0-28.5-11.5T320 440q0-17 11.5-28.5T360 400q17 0 28.5 11.5T400 440q0 17-11.5 28.5T360 480z"/></svg>`,
      path: 'leaders/my-group/invitations',
      title: 'Invitaciones'
    },
    {
      svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M11.3495 3.83619C11.2848 4.046 11.25 4.2689 11.25 4.5C11.25 4.9142 11.5858 5.25 12 5.25H16.5C16.9142 5.25 17.25 4.9142 17.25 4.5C17.25 4.2689 17.2152 4.046 17.1505 3.8362M11.3495 3.83619C11.6328 2.9176 12.4884 2.25 13.5 2.25H15C16.0116 2.25 16.8672 2.9176 17.1505 3.8362M11.3495 3.83619C10.9739 3.8586 10.5994 3.8853 10.2261 3.9163C9.095 4.0102 8.25 4.9732 8.25 6.1082V8.25M17.1505 3.83619C17.5261 3.8586 17.9006 3.8853 18.2739 3.9163C19.405 4.0102 20.25 4.9732 20.25 6.1082V16.5C20.25 17.7426 19.2426 18.75 18 18.75H15.75M8.25 8.25H4.875C4.2537 8.25 3.75 8.7537 3.75 9.375V20.625C3.75 21.2463 4.2537 21.75 4.875 21.75H14.625C15.2463 21.75 15.75 21.2463 15.75 20.625V18.75M8.25 8.25H14.625C15.2463 8.25 15.75 8.7537 15.75 9.375V18.75M7.5 15.75L9 17.25L12 13.5"/></svg>`,
      path: 'leaders/my-group/tasks',
      title: 'Tareas'},
    {
      svg: `<svg width="24" height="24" viewBox="0 0 960 960" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M296 880l-56-56 276-277 140 140 207-207 57 57-264 263-140-140zm-136-40q-33 0-56.5-23.5T80 760V200q0-33 23.5-56.5T160 120h560q33 0 56.5 23.5T800 200v168H160zm0-552h560v-88H160zm0 0v-88z"/></svg>`,
      path: 'leaders/my-group/analytics',
      title: 'Reportes'
    },
    {
      svg: '<svg width="24" height="24" viewBox="0 0 960 960" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M160 800Q127 800 103.5 776.5Q80 753 80 720V240Q80 207 103.5 183.5Q127 160 160 160H800Q833 160 856.5 183.5Q880 207 880 240V720Q880 753 856.5 776.5Q833 800 800 800ZM480 520L160 320V720H800V320ZM480 440L800 240H160ZM160 320V240V720Z"/></svg>',
      path: 'leaders/my-group/request-&-validations',
      title: 'Solicitudes y Validaciones'
    },

  ];

  optionsMember=[
    {
      svg: `<svg width="24" height="24" viewBox="0 0 960 960" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M0 720v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65zm240 0v-65q0-32 17.5-58.5T307 550t76.5-30T480 510q53 0 97.5 10t76.5 30 49 46.5T720 655v65zm540 0v-65q0-26-6.5-49T754 563q11-2 22.5-2.5T800 560q72 0 116 26.5T960 657v63zm-455-80h311q-10-20-55.5-35T480 590t-100.5 15T325 635zm-165-115q-33 0-56.5-23.5T80 440q0-34 23.5-57T160 360q34 0 57 23t23 57q0 33-23 56.5T160 520zm640 0q-33 0-56.5-23.5T720 440q0-34 23.5-57T800 360q34 0 57 23t23 57q0 33-23 56.5T800 520zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5T480 280q51 0 85.5 34.5T600 360q0 50-34.5 85T480 480zm0-80q17 0 28.5-11.5T520 360t-11.5-28.5T480 320t-28.5 11.5T440 360t11.5 28.5T480 400z"/></svg>`,
      path: 'members/my-group',
      title: 'Mi Grupo'
    },
    {
      svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M11.3495 3.83619C11.2848 4.046 11.25 4.2689 11.25 4.5C11.25 4.9142 11.5858 5.25 12 5.25H16.5C16.9142 5.25 17.25 4.9142 17.25 4.5C17.25 4.2689 17.2152 4.046 17.1505 3.8362M11.3495 3.83619C11.6328 2.9176 12.4884 2.25 13.5 2.25H15C16.0116 2.25 16.8672 2.9176 17.1505 3.8362M11.3495 3.83619C10.9739 3.8586 10.5994 3.8853 10.2261 3.9163C9.095 4.0102 8.25 4.9732 8.25 6.1082V8.25M17.1505 3.83619C17.5261 3.8586 17.9006 3.8853 18.2739 3.9163C19.405 4.0102 20.25 4.9732 20.25 6.1082V16.5C20.25 17.7426 19.2426 18.75 18 18.75H15.75M8.25 8.25H4.875C4.2537 8.25 3.75 8.7537 3.75 9.375V20.625C3.75 21.2463 4.2537 21.75 4.875 21.75H14.625C15.2463 21.75 15.75 21.2463 15.75 20.625V18.75M8.25 8.25H14.625C15.2463 8.25 15.75 8.7537 15.75 9.375V18.75M7.5 15.75L9 17.25L12 13.5"/></svg>`,
      path: 'members/my-group/tasks',
      title: 'Tareas'
    },
    {
      svg: '<svg width="24" height="24" viewBox="0 0 960 960" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M160 800Q127 800 103.5 776.5Q80 753 80 720V240Q80 207 103.5 183.5Q127 160 160 160H800Q833 160 856.5 183.5Q880 207 880 240V720Q880 753 856.5 776.5Q833 800 800 800ZM480 520L160 320V720H800V320ZM480 440L800 240H160ZM160 320V240V720Z"/></svg>',
      path: 'members/my-group/request-&-validations',
      title: 'Solicitudes y Validaciones'
    },
    {
      svg: `<svg width="24" height="24" viewBox="0 0 960 960" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M296 880l-56-56 276-277 140 140 207-207 57 57-264 263-140-140zm-136-40q-33 0-56.5-23.5T80 760V200q0-33 23.5-56.5T160 120h560q33 0 56.5 23.5T800 200v168H160zm0-552h560v-88H160zm0 0v-88z"/></svg>`,
      path: 'members/my-group/analytics',
      title: 'Mi desempeño'
    }
  ];
}

