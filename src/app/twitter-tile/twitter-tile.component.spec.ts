import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterTileComponent } from './twitter-tile.component';

describe('TwitterTileComponent', () => {
  let component: TwitterTileComponent;
  let fixture: ComponentFixture<TwitterTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwitterTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
