import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedEventWidgetComponent } from './featured-event-widget.component';

describe('FeaturedEventWidgetComponent', () => {
  let component: FeaturedEventWidgetComponent;
  let fixture: ComponentFixture<FeaturedEventWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedEventWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedEventWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
