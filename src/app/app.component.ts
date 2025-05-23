import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from "./shared/feature/footer/footer.component";
import { HeaderComponent } from "./shared/feature/header/header.component";
import { PanelStore } from './shared/ui/panel/panel.store';
import { NavigationStart } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ThemeSelectorComponent } from './shared/feature/theme-selector/theme-selector.component';
import { NavComponent } from './shared/feature/nav/nav.component';
import { NotificationsComponent } from './shared/ui/notifications/notifications.component';
import { SearchComponent } from './shared/feature/search/search.component';
import { PanelComponent } from './shared/ui/panel/panel.component';
import { ToastComponent } from './shared/ui/toast/toast.component';
import { DnaBackgroundComponent } from "./shared/ui/dna-background/dna-background.component";
import { DeviceCapabilityService } from './shared/utils/device-capability-check.service';
import { SsrPlatformService } from './shared/utils/ssr/ssr-platform.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    HeaderComponent,
    FooterComponent,
    PanelComponent,
    ThemeSelectorComponent,
    CommonModule,
    NavComponent,
    SearchComponent,
    NotificationsComponent,
    DnaBackgroundComponent,
    ToastComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly router = inject(Router);

  readonly device = inject(DeviceCapabilityService);
  readonly panelStore = inject(PanelStore);
  readonly platform = inject(SsrPlatformService);

  constructor() {
    console.log('[AppComponent] Booted at', new Date().toISOString());

    this.router.events
    .pipe(
      filter(
        (event): event is NavigationStart => event instanceof NavigationStart
      ),
      takeUntilDestroyed()
    )
    .subscribe(() => {
      this.panelStore.close();
    });
  }
}
