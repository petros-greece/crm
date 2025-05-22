import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultiRowFieldComponent } from './multi-row-field.component';
import { ReactiveFormsModule, FormArray, FormGroup, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MultiRowFieldComponent', () => {
  let component: MultiRowFieldComponent;
  let fixture: ComponentFixture<MultiRowFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MultiRowFieldComponent,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        NoopAnimationsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiRowFieldComponent);
    component = fixture.componentInstance;

    component.config = {
      type: 'multi-row', // or the appropriate type string for your use case
      name: 'testRows',  // or any unique name identifier
      label: 'Test Rows',
      fields: [
        { label: 'First Name', name: 'firstName', type: 'text', value: 'John' },
        { label: 'Age', name: 'age', type: 'number', value: 30 }
      ]
    };

    component.control = new FormArray<FormGroup>([]);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should add a row with correct controls', () => {
    component.addRow();
    expect(component.rows.length).toBe(1);

    const group = component.rows.at(0) as FormGroup;
    expect(group.get('firstName')).toBeTruthy();
    expect(group.get('age')).toBeTruthy();
    expect(group.get('firstName')!.value).toBe('John');
    expect(group.get('age')!.value).toBe(30);
  });

  it('should remove a row at specified index', () => {
    component.addRow();
    component.addRow();
    expect(component.rows.length).toBe(2);

    component.removeRow(0);
    expect(component.rows.length).toBe(1);
  });

  it('should throw error if getRowControl index is invalid', () => {
    expect(() => component.getRowControl(0, 'firstName')).toThrow();
  });

  it('should return FormControl from getRowControl if exists', () => {
    component.addRow();
    const control = component.getRowControl(0, 'firstName');
    expect(control instanceof FormControl).toBeTrue();
  });

  it('canAdd should always return true', () => {
    expect(component.canAdd).toBeTrue();
  });

  it('canRemove should be false with 0 or 1 row and true with 2+', () => {
    expect(component.canRemove).toBeFalse();
    component.addRow();
    expect(component.canRemove).toBeFalse();
    component.addRow();
    expect(component.canRemove).toBeTrue();
  });

  it('should render Add Row button with correct label', () => {
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.textContent).toContain('Add Row');
  });
});
