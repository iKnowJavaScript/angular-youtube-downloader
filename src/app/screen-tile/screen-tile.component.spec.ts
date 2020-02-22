import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenTileComponent } from './screen-tile.component';

describe('ScreenTileComponent', () => {
  let component: ScreenTileComponent;
  let fixture: ComponentFixture<ScreenTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreenTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
