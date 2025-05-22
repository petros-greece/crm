import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUploadComponent } from './file-upload-field.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FileUploadModule, FileUploader } from 'ng2-file-upload';
import { By } from '@angular/platform-browser';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FileUploadModule, FileUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    component.control = new FormControl([]);
    component.config = { acceptedTypes: 'image/png, image/jpeg' };
    component.uploadEndpoint = '/upload';
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the uploader with correct settings', () => {
    expect(component.uploader).toBeInstanceOf(FileUploader);
    expect(component.uploader.options.url).toBe('/upload');
    expect(component.uploader.options.allowedMimeType).toEqual(['image/png', 'image/jpeg']);
  });

  it('should display dropzone with text', () => {
    const dropzone = fixture.debugElement.query(By.css('[ng2FileDrop]'));
    expect(dropzone.nativeElement.textContent).toContain('Click or Drop to Upload');
  });

  // it('should update control value when file is added', () => {
  //   const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
  //   const mockFileItem = {
  //     _file: mockFile
  //   };

  //   spyOn(component.uploader, 'onAfterAddingFile').and.callFake((callback: any) => callback(mockFileItem));
  //   component.uploader.queue.push(mockFileItem as any);
  //   component.updateControlValue();

  //   expect(component.control.value.length).toBe(1);
  //   expect(component.control.value[0]).toBe(mockFile);
  // });

  // it('should set error on invalid file addition', () => {
  //   const invalidFile = { name: 'bad.exe', type: 'application/x-msdownload' };
  //   component.uploader.onWhenAddingFileFailed(invalidFile, {}, {});
  //   expect(component.control.errors).toEqual({ invalidFile: true });
  // });

  it('should remove file from queue and update control', () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const fileItem = {
      _file: mockFile,
      remove: jasmine.createSpy('remove')
    };

    component.uploader.queue = [fileItem as any];
    component.removeFile(fileItem as any);
    expect(component.control.value.length).toBe(0);
  });

  it('should toggle dropzone style on file over', () => {
    component.fileOverBase(true);
    fixture.detectChanges();
    expect(component.hasBaseDropZoneOver).toBeTrue();

    component.fileOverBase(false);
    fixture.detectChanges();
    expect(component.hasBaseDropZoneOver).toBeFalse();
  });
});
