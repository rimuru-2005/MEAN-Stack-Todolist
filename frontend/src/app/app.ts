import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Sidebar } from './components/sidebar/sidebar';
import { Navbar } from './navbar/navbar';
import { TasksComponent } from './components/tasks/tasks';
import { AuthService } from './service/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, Navbar, Sidebar, TasksComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');
  protected readonly authReady = signal(false);
  protected readonly authError = signal<string | null>(null);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.createGuestSession().subscribe({
      next: () => {
        console.log('Guest session created');
        this.authReady.set(true);
        this.authError.set(null);
      },
      error: (err) => {
        console.error('Auth error:', err);
        this.authReady.set(false);
        this.authError.set('Unable to start guest session. Please check the backend server.');
      },
    });
  }
}
