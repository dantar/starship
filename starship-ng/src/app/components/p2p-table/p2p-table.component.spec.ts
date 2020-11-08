import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { P2pTableComponent } from './p2p-table.component';

describe('P2pTableComponent', () => {
  let component: P2pTableComponent;
  let fixture: ComponentFixture<P2pTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ P2pTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(P2pTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
