import {
  Component,
  HostBinding,
  OnInit,
  inject,
  AfterViewInit,
  computed,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FeatureFlagPipe } from '../../utils/feature-flag.pipe';
import { UserInfoComponent } from '../user-info/user-info.component';
import { SsrPlatformService } from '../../utils/ssr/ssr-platform.service';
import { PageStore } from '../../../pages/data-access/page.store';
import { PanelStore, PanelType } from '../../ui/panel/panel.store';
import { ViewportService } from '../../data-access/viewport.service';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [
    RouterModule,
    CommonModule,
    FeatureFlagPipe,
    UserInfoComponent,
    NavComponent,
  ],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  private readonly router = inject(Router);
  private readonly platform = inject(SsrPlatformService);
  readonly pageStore = inject(PageStore);
  readonly panelStore = inject(PanelStore);
  readonly isMobile$$ = inject(ViewportService).isMobile$$;
  readonly isHomepage$$ = computed(() => this.router.url === '/');

  @ViewChild('headerRef', { static: false }) headerRef!: ElementRef;
  @ViewChild('panelTrigger', { static: false }) panelTriggerRef!: ElementRef;

  ngOnInit(): void {
    if (this.platform.isServer) return;
    this.pageStore.loadPrimaryNavLinks();
  }


  ngAfterViewInit(): void {
    if (this.platform.isServer) return;
    this.updatePanelOrigin();
  }


  private updatePanelOrigin() {
    const rect = this.headerRef?.nativeElement?.getBoundingClientRect();
    const offsetY = rect.bottom + window.scrollY; // in case page is scrolled
    this.panelStore.setOriginY(offsetY);
  }


  openPanel(theme: PanelType) {
    if (this.platform.isServer) return;

    const button = this.panelTriggerRef?.nativeElement as HTMLElement;

    // Get distance from top of page to bottom of button
    const y = button?.getBoundingClientRect().bottom + window.scrollY;

    this.panelStore.openAt(theme, y);
  }



  @HostBinding('class.is-mobile') get isMobileClass() {
    return this.isMobile$$();
  }

  @HostBinding('class.is-homepage') get isHomepageClass() {
    return this.isHomepage$$();
  }
}
