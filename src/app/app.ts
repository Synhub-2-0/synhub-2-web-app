import {Component, signal} from '@angular/core';
import {Layout} from '@app/shared/components/layout/layout';

@Component({
  selector: 'app-root',
  imports: [Layout],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class App {
  protected readonly title = signal('Synhub');
}

