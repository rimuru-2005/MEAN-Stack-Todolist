import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Settings } from './settings/settings';
import { Sidebar } from './sidebar/sidebar';
import { Navbar } from './navbar/navbar';
import { TasksComponent } from './tasks/tasks';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Dashboard,Navbar,Settings,Sidebar,TasksComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}

