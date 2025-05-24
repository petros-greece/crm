import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <ng-template #tpl>Template Content</ng-template>
  `
})
class TestHostComponent {
  @ViewChild('tpl', { static: true }) tplRef!: TemplateRef<any>;
}

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<DialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [DialogComponent],
      declarations: [TestHostComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {
            cls: 'custom-class',
            header: 'Test Header',
            content: 'This is string content.',
            showButtons: true,
            confirmText: 'OK',
            cancelText: 'Cancel',
            icon: 'info',
            id: 'dialog1'
        }}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display header and icon', () => {
    const header = fixture.debugElement.query(By.css('[mat-dialog-title]'));
    expect(header.nativeElement.textContent).toContain('Test Header');

    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon.nativeElement.textContent).toContain('info');
  });

  it('should display string content', () => {
    const content = fixture.debugElement.query(By.css('mat-dialog-content p'));
    expect(content.nativeElement.textContent).toContain('This is string content.');
  });

  it('should display confirm and cancel buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('mat-dialog-actions button'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].nativeElement.textContent).toContain('Cancel');
    expect(buttons[1].nativeElement.textContent).toContain('OK');
  });

  it('should identify TemplateRef correctly', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    const testTplRef = hostFixture.componentInstance.tplRef;

    expect(component.isTemplateRef(testTplRef)).toBeTrue();
    expect(component.isTemplateRef('not a template')).toBeFalse();
  });
});
