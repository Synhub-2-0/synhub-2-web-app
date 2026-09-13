import { Component } from '@angular/core';

@Component({
  selector: 'app-no-member-display',
  imports: [],
  template: `
    <div class="flex-1 w-full h-full rounded-3xl bg-[#1A4E85] p-8 text-white text-center text-xl ">
      Tu grupo no tiene integrantes, brindale el código a tus compañeros de proyecto para poder unirse al grupo
    </div>
  `,
  styles: ``
})
export class NoMemberDisplayComponent {

}
