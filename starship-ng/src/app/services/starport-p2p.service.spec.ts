import { TestBed } from '@angular/core/testing';

import { StarportP2pService } from './starport-p2p.service';

describe('StarportP2pService', () => {
  let service: StarportP2pService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StarportP2pService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
