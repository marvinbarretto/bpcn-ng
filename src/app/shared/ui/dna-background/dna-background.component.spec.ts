import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DnaBackgroundComponent } from './dna-background.component';

describe('DnaBackgroundComponent', () => {
  let component: DnaBackgroundComponent;
  let fixture: ComponentFixture<DnaBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DnaBackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DnaBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
