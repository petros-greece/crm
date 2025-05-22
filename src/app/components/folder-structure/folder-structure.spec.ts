import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FolderStructureComponent, TreeNodeI } from './folder-structure.component';
import { DialogService } from '../../services/dialog.service';
import { of, Subject } from 'rxjs';

describe('FolderStructureComponent', () => {
  let component: FolderStructureComponent;
  let fixture: ComponentFixture<FolderStructureComponent>;
  let dialogServiceMock: jasmine.SpyObj<DialogService>;

  beforeEach(async () => {
    dialogServiceMock = jasmine.createSpyObj('DialogService', ['openConfirm']);

    await TestBed.configureTestingModule({
      imports: [FolderStructureComponent],
      providers: [
        { provide: DialogService, useValue: dialogServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FolderStructureComponent);
    component = fixture.componentInstance;

    // Provide mock inputs
    component.dataSourceInput = [
      {
        name: 'Folder1',
        isFile: false,
        children: [
          { name: 'File1.txt', isFile: true }
        ]
      }
    ];
    component.pathPrefix = 'assets/';

    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the folder structure on reset()', () => {
    component['reset'](); // private method access workaround
    expect(component.currentNodes).toEqual(component.dataSourceInput);
    expect(component.path.length).toBe(1);
    expect(component.path[0].label).toBe('Root');
  });

  it('should navigate into a folder and update path', () => {
    const folderNode = component.dataSourceInput[0];
    component.onFolderClick(folderNode);
    expect(component.currentNodes).toEqual(folderNode.children || []);
    expect(component.path.length).toBe(2);
  });

  it('should select a file and set selectedFileName', () => {
    const fileNode: TreeNodeI = { name: 'notes.txt', isFile: true };
    component.onFileClick(fileNode);
    expect(component.selectedFileName).toBe('notes.txt');
  });

it('should add a new folder when confirmed', fakeAsync(() => {
  component.navigateTo(0); // Reset view to root

  const folderName = 'New Folder';
  const confirmSubject = new Subject<boolean>();

  dialogServiceMock.openConfirm.and.returnValue(confirmSubject.asObservable());

  component.openAddFolderDialog(); // Resets newFolderName to ''

  // Simulate user entering the folder name after the dialog is opened
  component.newFolderName = folderName;

  // Confirm the dialog
  confirmSubject.next(true);
  confirmSubject.complete();
  tick();

  expect(component.currentNodes.find(f => f.name === folderName)).toBeTruthy();
}));

  it('should not add a folder if not confirmed', () => {
    dialogServiceMock.openConfirm.and.returnValue(of(false));
    const initialLength = component.currentNodes.length;
    component.newFolderName = 'IgnoredFolder';
    component.openAddFolderDialog();
    expect(component.currentNodes.length).toBe(initialLength);
  });

// it('should add uploaded files when confirmed', fakeAsync(() => {
//   component.navigateTo(0); // Reset view to root

//   const testFile = new File(['dummy content'], 'test1.txt', { type: 'text/plain' });
//   component.files = [testFile];
//   dialogServiceMock.openConfirm.and.returnValue(of(true));

//   component.openAddFileDialog();

//   tick();

//   expect(component.currentNodes.map(n => n.name)).toContain('test1.txt');
// }));


  it('should not add files if confirmation is false', () => {
    dialogServiceMock.openConfirm.and.returnValue(of(false));
    component.files = [new File([], 'nope.txt')];
    const prevLength = component.currentNodes.length;
    component.openAddFileDialog();
    expect(component.currentNodes.length).toBe(prevLength);
  });

  it('should navigate to a specific breadcrumb index', () => {
    const folderNode = component.dataSourceInput[0];
    component.onFolderClick(folderNode);
    component.navigateTo(0); // back to root
    expect(component.currentNodes).toEqual(component.dataSourceInput);
    expect(component.path.length).toBe(1);
  });
});
