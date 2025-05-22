import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AutocompleteChipFieldComponent } from './autocomplete-chips-field.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('AutocompleteChipFieldComponent', () => {
  let component: AutocompleteChipFieldComponent;
  let fixture: ComponentFixture<AutocompleteChipFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteChipFieldComponent, ReactiveFormsModule, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AutocompleteChipFieldComponent);
    component = fixture.componentInstance;
    // Provide minimal valid config & control
    component.config = {
      type: 'chips',
      name: 'test',
      label: 'Test Label',
      options: [
        { label: 'Option1', value: 'opt1' },
        { label: 'Option2', value: 'opt2' }
      ]
    };
    component.control = new FormControl([]);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

it('should initialize static options', fakeAsync(() => {
  fixture.detectChanges();
  tick(); // Wait for async updates if any
  expect(component.filteredOptions.length).toBe(2);
}));

  it('should initialize and merge dynamic options (Observable)', fakeAsync(() => {
    const dynamic$ = of([{ label: 'Dynamic1', value: 'dyn1' }]);
    component.config.dynamicOptions = dynamic$;
    component.config.options = [{ label: 'Static1', value: 'stat1' }];

    fixture.detectChanges();
    tick(); // let async subscribe run
    expect(component.filteredOptions.some(o => o.label === 'Dynamic1')).toBeTrue();
    expect(component.filteredOptions.some(o => o.label === 'Static1')).toBeTrue();
  }));

  it('should initialize and merge dynamic options (Promise)', fakeAsync(() => {
    const dynamicFn = () => Promise.resolve([{ label: 'DynPromise', value: 'dynp' }]);
    component.config.dynamicOptions = dynamicFn;
    component.config.options = [{ label: 'Static1', value: 'stat1' }];

    fixture.detectChanges();
    tick(); // wait for promise resolution
    expect(component.filteredOptions.some(o => o.label === 'DynPromise')).toBeTrue();
    expect(component.filteredOptions.some(o => o.label === 'Static1')).toBeTrue();
  }));

  it('should sync initial selected values', () => {
    component.control.setValue(['opt1']);
    fixture.detectChanges();
    expect(component.selectedItems).toEqual(['opt1']);
  });

  it('should filter options based on search input', fakeAsync(() => {
    fixture.detectChanges();
    component.searchControl.setValue('option1');
    tick(300); // debounce
    expect(component.filteredOptions.length).toBe(1);
    expect(component.filteredOptions[0].label).toBe('Option1');
  }));

  it('should add selected option when optionSelected event fires', () => {
    fixture.detectChanges();
    const event = { option: { value: 'opt1' } };
    component.selected(event as any);
    expect(component.selectedItems).toContain('opt1');
    expect(component.control.value).toContain('opt1');
    expect(component.searchControl.value).toBe('');
  });

  it('should not add duplicate selected option', () => {
    component.selectedItems = ['opt1'];
    component.control.setValue(['opt1']);
    fixture.detectChanges();

    const event = { option: { value: 'opt1' } };
    component.selected(event as any);
    expect(component.selectedItems.length).toBe(1); // no duplicate
  });

  it('should remove item from selected items', () => {
    component.selectedItems = ['opt1', 'opt2'];
    component.control.setValue(['opt1', 'opt2']);
    fixture.detectChanges();

    component.remove('opt1');
    expect(component.selectedItems).not.toContain('opt1');
    expect(component.control.value).toEqual(['opt2']);
  });

  it('should add item from chip input (existing option)', () => {
    fixture.detectChanges();

    const event = {
      value: 'Option1',
      input: { value: 'Option1' }
    } as any;
    component.add(event);
    expect(component.selectedItems).toContain('opt1');
    expect(component.control.value).toContain('opt1');
    expect(event.input.value).toBe('');
    expect(component.searchControl.value).toBe('');
  });

  it('should add item from chip input (new free text)', () => {
    fixture.detectChanges();

    const event = {
      value: 'NewItem',
      input: { value: 'NewItem' }
    } as any;
    component.add(event);
    expect(component.selectedItems).toContain('NewItem');
    expect(component.control.value).toContain('NewItem');
    expect(event.input.value).toBe('');
    expect(component.searchControl.value).toBe('');
  });

  it('should not add empty trimmed input', () => {
    fixture.detectChanges();

    const event = {
      value: '   ',
      input: { value: '   ' }
    } as any;
    component.add(event);
    expect(component.selectedItems.length).toBe(0);
  });

  it('should handle enter key to add item (existing option)', () => {
    fixture.detectChanges();
    component.searchControl.setValue('Option2');

    const fakeEvent = { preventDefault: jasmine.createSpy('preventDefault') } as any;
    component.onEnter(fakeEvent);
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(component.selectedItems).toContain('opt2');
    expect(component.control.value).toContain('opt2');
    expect(component.searchControl.value).toBe('');
  });

  it('should handle enter key to add item (new free text)', () => {
    fixture.detectChanges();
    component.searchControl.setValue('NewVal');

    const fakeEvent = { preventDefault: jasmine.createSpy('preventDefault') } as any;
    component.onEnter(fakeEvent);
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(component.selectedItems).toContain('NewVal');
    expect(component.control.value).toContain('NewVal');
    expect(component.searchControl.value).toBe('');
  });

  it('should mark control as touched and dirty on value changes', fakeAsync(() => {
    fixture.detectChanges();

    spyOn(component.control, 'markAsTouched').and.callThrough();
    spyOn(component.control, 'markAsDirty').and.callThrough();

    component.searchControl.setValue('test');
    tick();
    expect(component.control.markAsTouched).toHaveBeenCalled();

    component.control.setValue(['test']);
    tick();
    expect(component.control.markAsDirty).toHaveBeenCalled();
  }));

  it('should unsubscribe on destroy', () => {
    fixture.detectChanges();
    spyOn(component['destroy$'], 'next').and.callThrough();
    spyOn(component['destroy$'], 'complete').and.callThrough();
    component.ngOnDestroy();
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

});
