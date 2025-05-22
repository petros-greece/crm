import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { EntityFormsComponent } from './entity-forms.component';

describe('EntityFormsComponent', () => {
  let component: EntityFormsComponent;
  let fixture: ComponentFixture<EntityFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityFormsComponent],
            providers: [
              provideHttpClient()
            ]
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
