import {Component, OnInit} from '@angular/core';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {InvitationsApiService} from '../../services/invitations-api.service';
import {Invitation} from '../../model/invitation.entity';
import {Router} from '@angular/router';
import {Group} from '@app/groups/model/group.entity';
import {DetailsService} from '@app/shared/services/details.service';
import {GroupService} from '@app/groups/services/group.service';

@Component({
  selector: 'app-invitation-member',
  imports: [
    MatFormField,
    MatLabel,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './invitation-member.component.html',
  styleUrl: './invitation-member.component.css'
})
export class InvitationMemberComponent implements OnInit {
  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private invitationsApi: InvitationsApiService,
    private groupsApi: GroupService,
    private detailsService: DetailsService,
    private router: Router
    ) {
    this.searchForm = this.fb.group({
      query: ['']
    });
  }
  groupFound: Group | null = null;
  searchError: string | null = null;
  activeInvitation: Invitation | null = null;

  ngOnInit(): void {
    this.checkActiveInvitation()
    console.clear()
  }

  checkActiveInvitation(): void {
    this.invitationsApi.getInvitationsByMember().subscribe({
      next: (invitation) => {
        console.log('Invitacion activa', invitation);
        this.activeInvitation = invitation || null;
      },
      error: (err) => {
        this.activeInvitation = null;
      }
    });
    console.clear();
  }

  onSearch(): void {
    const code = this.searchForm.value.query;
    this.groupsApi.searchGroupByCode(code).subscribe({
      next: (group) => {
        this.groupFound = group;
        this.searchError = null;
        console.log('Grupo encontrado:', group);
        // Aquí puedes manejar la respuesta, mostrar datos, etc.
      },
      error: (err) => {
        this.groupFound = null;
        this.searchError = 'No se encontró ningún grupo con ese código.';
        console.error('Error al buscar grupo:', err);
        // Aquí puedes mostrar un mensaje de error al usuario
      }
    });
  }

  onJoinGroup(): void{
    this.invitationsApi.sendInvitation(this.groupFound?.id).subscribe({
      next: () => {
        this.checkActiveInvitation()// Actualiza la invitación activa
        console.clear();
      },
      error: (err) => {
        console.error('Error al enviar invitación:', err);
      }
    });
  }

  onCancelInvitation() {
    this.invitationsApi.cancelInvitation().subscribe({
      next: () => {
        this.activeInvitation =  null
        console.clear();
      },
      error: (err) => {
        console.error('Error al cancelar invitación:', err);
      }
    });
  }


  onCheckInvitation() {
    this.detailsService.getMemberGroup().subscribe({
      next: () => {
        this.router.navigate(['/members/main']);
      },
      error: (err) => {
        this.checkActiveInvitation();
        console.error('Error al consultar el grupo:', err);
      }
    });
  }
}
