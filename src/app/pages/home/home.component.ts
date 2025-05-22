import { Component, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { OptionsService } from '../../services/options.service';
import { Router } from '@angular/router'; // Add this import

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  dataService = inject(DataService);
  optionsService = inject(OptionsService);
  router = inject(Router); // Inject Router
  users: any[] = [];

  ngOnInit() {
    // Check for existing user and role
    const user = this.optionsService.getOption('user');
    const userRole = this.optionsService.getOption('userRole');
    
    if (user && userRole) {
      this.router.navigate(['/employees']); // Redirect if both exist
    } else {
      this.dataService.getEmployees().subscribe(data => this.users = data);
    }
  }

  loginAsGuest(user: any) {
    this.dataService.getRoleByName(user.crmRole).subscribe((role: any) => {
      this.optionsService.updateOption('userRole', role);
      this.optionsService.updateOption('user', user);
      this.router.navigate(['/employees']); // Redirect after setting options
    });
  }
}