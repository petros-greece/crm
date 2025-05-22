import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { AssetsComponent } from './assets.component';

describe('AssetsComponent', () => {
  let component: AssetsComponent;
  let fixture: ComponentFixture<AssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetsComponent],
      providers: [
        provideHttpClient()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
