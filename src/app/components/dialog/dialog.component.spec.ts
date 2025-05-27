import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Mock host component for testing TemplateRef
@Component({
  template: `
    <ng-template #customTpl>Custom Template Content</ng-template>
  `
})
class TestHostComponent {
  @ViewChild('customTpl') templateRef!: TemplateRef<any>;
}

describe('DialogComponent', () => {
  let fixture: ComponentFixture<DialogComponent>;
  let component: DialogComponent;

  const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

  const createComponent = (data: any) => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: data });
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogComponent, BrowserAnimationsModule, TestHostComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
  });

  it('should display header if provided', () => {
    createComponent({ header: 'Dialog Title' });

    const header = fixture.debugElement.query(By.css('[mat-dialog-title]'));
    expect(header.nativeElement.textContent).toContain('Dialog Title');
  });

  it('should apply custom class to header if provided', () => {
    createComponent({ header: 'Header', cls: 'my-class' });

    const header = fixture.debugElement.query(By.css('[mat-dialog-title]'));
    expect(header.nativeElement.classList).toContain('my-class');
  });

  it('should display icon in header if provided', () => {
    createComponent({ header: 'Header', icon: 'info' });

    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon.nativeElement.textContent.trim()).toBe('info');
  });

  it('should render string content', () => {
    createComponent({ content: 'Hello world' });

    const content = fixture.debugElement.query(By.css('mat-dialog-content'));
    expect(content.nativeElement.textContent).toContain('Hello world');
  });

  it('should render template content', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    const tpl = hostFixture.componentInstance.templateRef;

    // Re-configure TestBed in this test to inject TemplateRef
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [DialogComponent, BrowserAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { content: tpl } }
      ]
    });

    const dialogFixture = TestBed.createComponent(DialogComponent);
    const dialogComponent = dialogFixture.componentInstance;
    dialogFixture.detectChanges();

    const content = dialogFixture.debugElement.query(By.css('mat-dialog-content'));
    expect(content.nativeElement.textContent).toContain('Custom Template Content');
  });


  it('should show confirm and cancel buttons when showButtons is true', () => {
    createComponent({
      showButtons: true,
      confirmText: 'Yes',
      cancelText: 'No'
    });

    const actions = fixture.debugElement.query(By.css('mat-dialog-actions'));
    expect(actions).toBeTruthy();

    const buttons = actions.queryAll(By.css('button'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].nativeElement.textContent).toContain('No');
    expect(buttons[1].nativeElement.textContent).toContain('Yes');
  });

  it('should not render actions if showButtons is false or undefined', () => {
    createComponent({});

    const actions = fixture.debugElement.query(By.css('mat-dialog-actions'));
    expect(actions).toBeFalsy();
  });
});
