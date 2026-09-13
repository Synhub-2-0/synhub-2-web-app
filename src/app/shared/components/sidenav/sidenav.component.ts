import {Component, EventEmitter, HostListener, inject, Input, OnInit, Output} from '@angular/core';
import {NgClass} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {trigger, transition, style, animate} from '@angular/animations';
import {DetailsService} from '../../services/details.service';
import {Leader} from '../../model/leader.entity';
import {Member} from '../../model/member.entity';
import {LOGOUT_OPTION} from '../../../app';
import {DomSanitizer} from '@angular/platform-browser';

interface SideNavToggle{
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  imports: [
    RouterLink,
    NgClass,
    RouterLinkActive
  ],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SidenavComponent implements OnInit{

  protected readonly LOGOUT_OPTION = {
    ...LOGOUT_OPTION,
    svg: inject(DomSanitizer).bypassSecurityTrustHtml(LOGOUT_OPTION.svg)
  };

  private detailApiService = inject (DetailsService);

  leader: Leader | undefined;
  member: Member | undefined;

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    if (this.role === 'leader') {
      this.detailApiService.getLeaderDetails().subscribe((data: Leader) => {
        this.leader = data;
      });
    } else if (this.role === 'member') {
      this.detailApiService.getMemberDetails().subscribe((data: Member) => {
        this.member = data;
      });
    }
  }

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  @Input() navData: any[] = [];
  @Input() role: string = '';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
    }
  }
  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }
  closeSidenav() : void {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  get fullName(): string {
    if (this.role === 'leader' && this.leader) {
      return `${this.leader.name} ${this.leader.surname}`;
    } else if (this.role === 'member' && this.member) {
      return `${this.member.name} ${this.member.surname}`;
    }
    return '';
  }
  get pfpUrl(): string {
    if (this.role === 'leader' && this.leader) {
      return this.leader.imgUrl;
    } else if (this.role === 'member' && this.member) {
      return this.member.imgUrl;
    }
    return '';
  }
}
