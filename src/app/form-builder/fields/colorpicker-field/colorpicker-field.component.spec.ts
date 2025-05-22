import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorPickerFieldComponent } from './colorpicker-field.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ColorPickerModule } from '@iplab/ngx-color-picker';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

describe('ColorPickerFieldComponent', () => {
  let component: ColorPickerFieldComponent;
  let fixture: ComponentFixture<ColorPickerFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ColorPickerFieldComponent,
        ReactiveFormsModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        ColorPickerModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ColorPickerFieldComponent);
    component = fixture.componentInstance;

    component.control = new FormControl('#ff0000');
    component.config = { type: 'color', name: 'color', label: 'Test Color' };

    fixture.detectChanges();
  });

  function hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
      : '';
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display button with label and background color', () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.textContent.trim()).toBe('Test Color');
    expect(button.style.backgroundColor).toBe(hexToRgb('#ff0000')); // Compare as RGB
  });

  it('should update control value on color change', () => {
    component.onColorChange('#00ff00');
    expect(component.control.value).toBe('#00ff00');
  });

  // describe('getTextColor()', () => {
  //   it('should return black for light backgrounds', () => {
  //     expect(component.getTextColor('#ffffff')).toBe('#000');
  //   });

  //   it('should return white for dark backgrounds', () => {
  //     expect(component.getTextColor('#000000')).toBe('#fff');
  //   });

  //   it('should handle invalid color string gracefully', () => {
  //     expect(component.getTextColor('invalid')).toBe('#000'); // Default fallback
  //   });
  // });

  // it('should default to white background if control value is null', async () => {
  //   component.control.setValue(null);
  //   fixture.detectChanges();
  //   await fixture.whenStable();

  //   const button = fixture.debugElement.query(By.css('button')).nativeElement;
  //   expect(button.style.backgroundColor.toLowerCase()).toBe(hexToRgb('#ffffff'));
  // });

});
