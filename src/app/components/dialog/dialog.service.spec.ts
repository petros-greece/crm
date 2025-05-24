import { TestBed } from '@angular/core/testing';
import { DialogService, DialogOptions } from './dialog.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { DialogComponent } from './dialog.component';

describe('DialogService', () => {
  let service: DialogService;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DialogComponent>>;

  beforeEach(() => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed', 'close']);
    mockDialogRef.afterClosed.and.returnValue(of(true));

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
    dialogSpy.open.and.returnValue(mockDialogRef);

    TestBed.configureTestingModule({
      providers: [
        DialogService,
        { provide: MatDialog, useValue: dialogSpy }
      ]
    });

    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a template dialog and store ref by ID', () => {
    const data: DialogOptions = {
      header: 'Header',
      content: 'Content',
      id: 'testDialog'
    };

    const ref = service.openTemplate(data);

    expect(dialogSpy.open).toHaveBeenCalledWith(DialogComponent, jasmine.any(Object));
    expect(ref).toBe(mockDialogRef);
  });

  it('should open a confirm dialog and return observable', (done) => {
    const data: DialogOptions = {
      header: 'Confirm',
      content: 'Are you sure?',
      id: 'confirmDialog'
    };

    const result$ = service.openConfirm(data);

    result$.subscribe(result => {
      expect(result).toBeTrue();
      done();
    });

    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should close all dialogs and clear refs', () => {
    service['dialogRefs'].set('test', mockDialogRef);
    service.closeAll();

    expect(dialogSpy.closeAll).toHaveBeenCalled();
    expect(service['dialogRefs'].size).toBe(0);
  });

  it('should close dialog by ID if exists', () => {
    service['dialogRefs'].set('testId', mockDialogRef);
    service.closeDialogById('testId');

    expect(mockDialogRef.close).toHaveBeenCalled();
    expect(service['dialogRefs'].has('testId')).toBeFalse();
  });

  it('should do nothing if dialog ID not found', () => {
    // No dialog with given ID exists
    service.closeDialogById('nonExistentId');

    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });
});
