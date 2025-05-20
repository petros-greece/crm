import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityFormsComponent } from './entity-forms.component';

describe('EntityFormsComponent', () => {
  let component: EntityFormsComponent;
  let fixture: ComponentFixture<EntityFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityFormsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
