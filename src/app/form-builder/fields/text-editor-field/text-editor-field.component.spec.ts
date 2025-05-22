import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextEditorFieldComponent } from './text-editor-field.component';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { By } from '@angular/platform-browser';

describe('TextEditorFieldComponent', () => {
  let component: TextEditorFieldComponent;
  let fixture: ComponentFixture<TextEditorFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextEditorFieldComponent, ReactiveFormsModule, QuillModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TextEditorFieldComponent);
    component = fixture.componentInstance;
  });

  function initWithConfig(config: any = {}, control?: FormControl) {
    component.config = {
      type: 'text-editor',
      name: 'content',
      label: 'Content',
      placeholder: 'Write something...',
      ...config,
    };

    component.control = control ?? new FormControl('', []);
    fixture.detectChanges();
  }

  it('should create the component', () => {
    initWithConfig();
    expect(component).toBeTruthy();
  });

  it('should display the label', () => {
    initWithConfig({ label: 'Test Label' });
    const labelElem = fixture.debugElement.query(By.css('label'));
    expect(labelElem.nativeElement.textContent).toContain('Test Label');
  });

  // it('should bind placeholder correctly', () => {
  //   initWithConfig({ placeholder: 'Custom placeholder' });
  //   const quillElem = fixture.debugElement.query(By.css('quill-editor'));
  //   expect(quillElem.attributes['placeholder']).toBe('Custom placeholder');
  // });

  it('should show required error message', () => {
    const control = new FormControl('', Validators.required);
    initWithConfig({}, control);
    control.markAsTouched();
    control.updateValueAndValidity();
    fixture.detectChanges();

    const errorElem = fixture.debugElement.nativeElement.querySelector('div.text-red-600');
    expect(errorElem.textContent).toContain('Content is required');
  });

  it('should show minlength error message', () => {
    const control = new FormControl('abc', Validators.minLength(5));
    initWithConfig({}, control);
    control.markAsTouched();
    control.updateValueAndValidity();
    fixture.detectChanges();

    const errorElem = fixture.debugElement.nativeElement.querySelector('div.text-red-600');
    expect(errorElem.textContent).toContain('Minimum length is 5');
  });

  it('should show maxlength error message', () => {
    const control = new FormControl('abcdefghij', Validators.maxLength(5));
    initWithConfig({}, control);
    control.markAsTouched();
    control.updateValueAndValidity();
    fixture.detectChanges();

    const errorElem = fixture.debugElement.nativeElement.querySelector('div.text-red-600');
    expect(errorElem.textContent).toContain('Maximum length is 5');
  });
});
