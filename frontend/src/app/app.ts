import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { TasksComponent } from './components/tasks/tasks';
import { AuthService } from './service/auth/auth.service';
import { CurrentUser, UsersService } from './service/users/users.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, TasksComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  currentUser: CurrentUser | null = null;
  sessionLoading = true;
  sessionError: string | null = null;
  feedback: string | null = null;
  busy = false;

  signupForm = {
    username: '',
    email: '',
    password: '',
  };

  loginForm = {
    email: '',
    password: '',
  };

  upgradeForm = {
    email: '',
    password: '',
  };

  adminCreateForm = {
    username: '',
    email: '',
    password: '',
  };

  adminActionForm = {
    promoteUserId: '',
    demoteUserId: '',
    demoteKey: '',
  };

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  ngOnInit(): void {
    this.ensureInitialSession();
  }

  get isGuest(): boolean {
    return !!this.currentUser && !this.currentUser.email;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  get userInitials(): string {
    if (!this.currentUser?.username) {
      return 'G';
    }

    return this.currentUser.username.slice(0, 2).toUpperCase();
  }

  ensureInitialSession() {
    this.sessionLoading = true;
    this.sessionError = null;

    this.usersService
      .getCurrentUser()
      .pipe(
        finalize(() => {
          this.sessionLoading = false;
        }),
      )
      .subscribe({
        next: (user) => {
          this.currentUser = user;
        },
        error: () => {
          this.continueAsGuest();
        },
      });
  }

  continueAsGuest() {
    this.busy = true;
    this.feedback = null;
    this.sessionError = null;

    this.authService
      .createGuestSession()
      .pipe(
        finalize(() => {
          this.busy = false;
          this.sessionLoading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.refreshCurrentUser('Guest session ready.');
        },
        error: (err) => {
          console.error('Guest session error:', err);
          this.sessionError = 'Unable to start a guest session.';
        },
      });
  }

  refreshCurrentUser(message?: string) {
    this.usersService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.feedback = message ?? null;
      },
      error: (err) => {
        console.error('Current user error:', err);
        this.currentUser = null;
        this.sessionError = 'Unable to load current user.';
      },
    });
  }

  signup() {
    if (this.busy) return;

    this.busy = true;
    this.feedback = null;
    this.sessionError = null;

    this.authService
      .signup({ ...this.signupForm })
      .pipe(
        finalize(() => {
          this.busy = false;
        }),
      )
      .subscribe({
        next: () => {
          this.signupForm = { username: '', email: '', password: '' };
          this.refreshCurrentUser('Account created successfully.');
        },
        error: (err) => {
          console.error('Signup error:', err);
          this.sessionError = err.error?.message || err.error?.error || 'Unable to sign up.';
        },
      });
  }

  login() {
    if (this.busy) return;

    this.busy = true;
    this.feedback = null;
    this.sessionError = null;

    this.authService
      .login({ ...this.loginForm })
      .pipe(
        finalize(() => {
          this.busy = false;
        }),
      )
      .subscribe({
        next: () => {
          this.loginForm = { email: '', password: '' };
          this.refreshCurrentUser('Logged in successfully.');
        },
        error: (err) => {
          console.error('Login error:', err);
          this.sessionError = err.error?.message || err.error?.error || 'Unable to log in.';
        },
      });
  }

  logout() {
    if (this.busy) return;

    this.busy = true;
    this.feedback = null;
    this.sessionError = null;

    this.authService
      .logout()
      .pipe(
        finalize(() => {
          this.busy = false;
        }),
      )
      .subscribe({
        next: () => {
          this.currentUser = null;
          this.feedback = 'Logged out successfully.';
        },
        error: (err) => {
          console.error('Logout error:', err);
          this.sessionError = 'Unable to log out.';
        },
      });
  }

  upgradeGuest() {
    if (this.busy) return;

    this.busy = true;
    this.feedback = null;
    this.sessionError = null;

    this.usersService
      .upgradeGuest({ ...this.upgradeForm })
      .pipe(
        finalize(() => {
          this.busy = false;
        }),
      )
      .subscribe({
        next: () => {
          this.upgradeForm = { email: '', password: '' };
          this.refreshCurrentUser('Guest account upgraded successfully.');
        },
        error: (err) => {
          console.error('Upgrade error:', err);
          this.sessionError = err.error?.message || err.error?.error || 'Unable to upgrade guest.';
        },
      });
  }

  deleteAccount() {
    if (this.busy) return;
    if (!confirm('Delete this account and all of its tasks?')) return;

    this.busy = true;
    this.feedback = null;
    this.sessionError = null;

    this.usersService
      .deleteCurrentUser()
      .pipe(
        finalize(() => {
          this.busy = false;
        }),
      )
      .subscribe({
        next: () => {
          this.currentUser = null;
          this.feedback = 'Account deleted successfully.';
        },
        error: (err) => {
          console.error('Delete account error:', err);
          this.sessionError = 'Unable to delete account.';
        },
      });
  }

  createAdmin() {
    if (this.busy) return;

    this.busy = true;
    this.feedback = null;
    this.sessionError = null;

    this.authService
      .createAdmin({ ...this.adminCreateForm })
      .pipe(
        finalize(() => {
          this.busy = false;
        }),
      )
      .subscribe({
        next: () => {
          this.adminCreateForm = { username: '', email: '', password: '' };
          this.feedback = 'Admin account created successfully.';
        },
        error: (err) => {
          console.error('Create admin error:', err);
          this.sessionError = err.error?.message || err.error?.error || 'Unable to create admin.';
        },
      });
  }

  promoteUser() {
    if (this.busy || !this.adminActionForm.promoteUserId.trim()) return;

    this.busy = true;
    this.feedback = null;
    this.sessionError = null;

    this.usersService
      .promoteUser(this.adminActionForm.promoteUserId.trim())
      .pipe(
        finalize(() => {
          this.busy = false;
        }),
      )
      .subscribe({
        next: () => {
          this.adminActionForm.promoteUserId = '';
          this.feedback = 'User promoted successfully.';
        },
        error: (err) => {
          console.error('Promote error:', err);
          this.sessionError = err.error?.message || err.error?.error || 'Unable to promote user.';
        },
      });
  }

  demoteUser() {
    if (
      this.busy ||
      !this.adminActionForm.demoteUserId.trim() ||
      !this.adminActionForm.demoteKey.trim()
    ) {
      return;
    }

    this.busy = true;
    this.feedback = null;
    this.sessionError = null;

    this.usersService
      .demoteUser(
        this.adminActionForm.demoteUserId.trim(),
        this.adminActionForm.demoteKey.trim(),
      )
      .pipe(
        finalize(() => {
          this.busy = false;
        }),
      )
      .subscribe({
        next: () => {
          this.adminActionForm.demoteUserId = '';
          this.adminActionForm.demoteKey = '';
          this.feedback = 'User demoted successfully.';
        },
        error: (err) => {
          console.error('Demote error:', err);
          this.sessionError = err.error?.message || err.error?.error || 'Unable to demote user.';
        },
      });
  }
}
