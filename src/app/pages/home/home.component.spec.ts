import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { DataService } from '../../services/data.service';
import { OptionsService } from '../../services/options.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockDataService: jasmine.SpyObj<DataService>;
  let mockOptionsService: jasmine.SpyObj<OptionsService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj('DataService', ['getEmployees', 'getRoleByName']);
    mockOptionsService = jasmine.createSpyObj('OptionsService', ['getOption', 'updateOption']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent, CommonModule],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: OptionsService, useValue: mockOptionsService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should navigate to /employees if user and userRole exist', () => {
      mockOptionsService.getOption.and.callFake((key: string) => {
        return key === 'user' ? { name: 'Test' } : 'admin';
      });

      component.ngOnInit();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/employees']);
      expect(mockDataService.getEmployees).not.toHaveBeenCalled();
    });

    it('should fetch users if user or userRole do not exist', () => {
      const mockUsers = [{ name: 'Alice' }, { name: 'Bob' }];
      mockOptionsService.getOption.and.returnValue(null);
      mockDataService.getEmployees.and.returnValue(of(mockUsers));

      component.ngOnInit();

      expect(component.users).toEqual(mockUsers);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('loginAsGuest', () => {
    it('should update options and navigate to /employees', () => {
      const user = { name: 'Guest', crmRole: 'GuestRole' };
      const role = { name: 'GuestRole', permissions: [] };

      mockDataService.getRoleByName.and.returnValue(of(role));

      component.loginAsGuest(user);

      expect(mockDataService.getRoleByName).toHaveBeenCalledWith('GuestRole');
      expect(mockOptionsService.updateOption).toHaveBeenCalledWith('userRole', role);
      expect(mockOptionsService.updateOption).toHaveBeenCalledWith('user', user);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/employees']);
    });
  });
});
