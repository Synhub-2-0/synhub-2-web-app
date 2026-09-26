import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { GroupService } from '@app/groups/services/group.service';
import { Group } from '@app/groups/model/group.entity';

@Component({
  selector: 'app-no-group-member-display',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './no-group-member-display.component.html',
  styles: ``
})
export class NoGroupMemberDisplayComponent {
  searchCode = '';
  searching = false;
  searchError = '';
  foundGroup: Group | null = null;

  constructor(
    public route: Router,
    private groupService: GroupService
  ) {}

  searchByCode(): void {
    const cleanCode = this.searchCode.replace('#', '').trim();
    if (!cleanCode) return;

    this.searching = true;
    this.searchError = '';
    this.foundGroup = null;

    this.groupService.searchGroupByCode(cleanCode).subscribe({
      next: (group) => {
        this.foundGroup = group;
        this.searching = false;
      },
      error: () => {
        this.searchError = 'No se encontró ningún grupo con ese código.';
        this.searching = false;
      }
    });
  }

  goToSearchGroup(): void {
    this.route.navigate(['members/group-search']).then();
  }
}
