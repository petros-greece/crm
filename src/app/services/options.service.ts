import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  private storageKey = 'crm-options';

  constructor() {}

  updateOption(name: string, value: any): void {
    const options = this.getAllOptions();
    options[name] = value;
    localStorage.setItem(this.storageKey, JSON.stringify(options));
  }

  getOption(name: string): any {
    const options = this.getAllOptions();
    return options[name];
  }

  deleteOption(name: string): void {
    const options = this.getAllOptions();
    delete options[name];
    localStorage.setItem(this.storageKey, JSON.stringify(options));
  }

  private getAllOptions(): { [key: string]: any } {
    const raw = localStorage.getItem(this.storageKey);
    try {
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }
}
