import { TestBed } from '@angular/core/testing';

import { InvitationsApiService } from './invitations-api.service';

describe('InvitationsApiService', () => {
  let service: InvitationsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvitationsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
