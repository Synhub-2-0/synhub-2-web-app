import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-profile-image-display',
  imports: [
  ],
  template: `
    <div class="inline md:flex ">
      <img [src]="imgSrc" [alt]="alt" class="aspect-square rounded-full w-36 object-cover shadow-md shadow-gray-800 mr-0 mb-4 md:mb-0 md:mr-4" />
      <div class=" flex  items-center justify-center ">
        <h3 class="text-2xl font-medium"> {{ groupName }} </h3>
      </div>
    </div>
  `,
  styles: ``
})
export class ProfileImageDisplayComponent {
  @Input() groupName: string = '';
  @Input() alt: string = 'Profile Image';
  @Input() imgSrc: string = 'assets/images/default-img.webp'; // Default image

}
