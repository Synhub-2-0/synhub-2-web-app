import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-no-group-member-display',
  imports: [],
  template: `
    <div class="h-full flex flex-col items-center justify-center ">

      <div class="rounded-3xl max-w-2xl max-h-96 text-white font-bold text-2xl bg-[#1A4E85] shadow-lg shadow-gray-400">
        <div class="flex flex-col items-center justify-between p-20 gap-16">
          <p>
            No tienes un grupo todavia
          </p>
          <button
            (click)="goToSearchGroup()"
            class="bg-[#4A90E2] rounded-2xl py-2 px-6 shadow-md shadow-gray-800 hover:cursor-pointer hover:bg-[#559df2] transition">
            Buscar Grupo
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class NoGroupMemberDisplayComponent {

  constructor(public route: Router) {
  }

  goToSearchGroup() {
    //TODO: implement search group route redirection
  }

}
