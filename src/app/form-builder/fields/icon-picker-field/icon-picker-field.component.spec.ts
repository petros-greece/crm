import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconPickerFieldComponent } from './icon-picker-field.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { FormBuilderService } from '../../form-builder.service';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, TemplateRef } from '@angular/core';

// Mock DialogComponent
@Component({ template: '' })
class MockDialogComponent {}

describe('IconPickerFieldComponent', () => {
  let component: IconPickerFieldComponent;
  let fixture: ComponentFixture<IconPickerFieldComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DialogComponent>>;
  let mockFormBuilderService: jasmine.SpyObj<FormBuilderService>;

  const mockIcons = {
    categories: [
      {
        name: 'Basic',
        key: 'basic',
        icons: ['home', 'search', 'settings']
      }
    ]
  };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockDialog.open.and.returnValue(mockDialogRef);

    mockFormBuilderService = jasmine.createSpyObj('FormBuilderService', ['getIcons']);
    mockFormBuilderService.getIcons.and.returnValue(of(mockIcons));

    await TestBed.configureTestingModule({
      imports: [IconPickerFieldComponent, MatDialogModule, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: FormBuilderService, useValue: mockFormBuilderService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconPickerFieldComponent);
    component = fixture.componentInstance;
    component.control = new FormControl(null);
    component.config = { name: 'icon', type: 'icon', label: 'Icon' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the icon dialog and load categories', () => {
    component.openSelectIconDialog();

    expect(mockFormBuilderService.getIcons).toHaveBeenCalled();
    expect(mockDialog.open).toHaveBeenCalled();
    expect(component.icons.length).toBeGreaterThan(0);
  });

  it('should select an icon and update the form control', () => {
    component.control = new FormControl(null);
    component['selectIconDialogRef'] = mockDialogRef;

    component.selectIcon('home');

    expect(component.control.value).toBe('home');
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

});
