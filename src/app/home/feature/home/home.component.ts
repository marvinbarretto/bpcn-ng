import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStore } from '../../../auth/data-access/auth.store';
import { NextEventWidgetComponent } from '../next-event-widget/next-event-widget.component';
import { RecentNewsWidgetComponent } from '../recent-news-widget/recent-news-widget.component';
import { HeroComponent } from "../../../shared/ui/hero/hero.component";
import { AdvertWidgetComponent } from '../advert-widget/advert-widget.component';
import { FeedbackWidgetComponent } from '../feedback-widget/feedback-widget.component';
import { FeaturedEventWidgetComponent } from '../featured-event-widget/featured-event-widget.component';
import { RegisterWidgetComponent } from "../register-widget/register-widget.component";

@Component({
  selector: 'app-home',
  imports: [
    RouterModule,
    CommonModule,
    NextEventWidgetComponent,
    RecentNewsWidgetComponent,
    HeroComponent,
    AdvertWidgetComponent,
    FeedbackWidgetComponent,
    FeaturedEventWidgetComponent,
    RegisterWidgetComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  authStore = inject(AuthStore);
}
