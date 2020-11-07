import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerToPeerComponent } from './peer-to-peer.component';

describe('PeerToPeerComponent', () => {
  let component: PeerToPeerComponent;
  let fixture: ComponentFixture<PeerToPeerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeerToPeerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerToPeerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
