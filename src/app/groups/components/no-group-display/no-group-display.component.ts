import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-no-group-display',
  imports: [],
  template: `
    <div class="h-full w-full flex flex-col items-center justify-center p-4">
      <div class="rounded-3xl w-full max-w-2xl text-white font-bold text-xl md:text-2xl bg-[#1A4E85] shadow-lg shadow-gray-400">
        <div class="flex flex-col items-center justify-between p-8 md:p-16 lg:p-20 gap-8 md:gap-16 text-center">
          <p>No has creado tu grupo todavía</p>
          <button
            (click)="goToCreateGroup()"
            class="bg-[#4A90E2] rounded-2xl py-3 px-8 text-lg shadow-md shadow-gray-800 hover:cursor-pointer hover:bg-[#559df2] transition">
            Crear Grupo
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class NoGroupDisplayComponent {

  constructor(public route: Router) {
  }

  goToCreateGroup() {
    this.route.navigate(['leaders/create-group']).then();
  }
}
