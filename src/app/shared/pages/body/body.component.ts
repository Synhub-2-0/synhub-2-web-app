import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-body',
  imports: [
    NgClass,
    RouterOutlet
  ],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  getBodyClass(): string {
    let styleClass = '';
    if (this.screenWidth === 0) {
      // Si no hay sidebar, pantalla completa
      return 'fullscreen';
    }
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'body-trimmed';
    } else if (this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0) {
      styleClass = 'body-md-screen';
    }
    return styleClass;
  }
}
