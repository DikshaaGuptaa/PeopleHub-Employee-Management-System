
import { Component } from '@angular/core';
import {
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  NavigationEnd
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  showMainLayout = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {

    this.updateLayout(this.router.url);

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.updateLayout(event.urlAfterRedirects);
        }
      });

  }

  private updateLayout(url: string): void {

    this.showMainLayout =
      !url.startsWith('/login') &&
      !url.startsWith('/signup');

  }

  logout(): void {

    this.authService.logout();

    this.router.navigate(['/login']);

  }

}
