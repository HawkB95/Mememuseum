import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isCollapsed = true;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  onLogout(): void {
    this.authService.logout();
    this.isCollapsed = true;
    this.router.navigate(['/login']);
  }
}