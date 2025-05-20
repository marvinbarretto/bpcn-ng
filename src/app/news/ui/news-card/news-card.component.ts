import { Component, Input } from '@angular/core';
import { NewsSnippet } from '../../utils/news/news.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-news-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.scss'
})
export class NewsCardComponent {
  @Input() news!: NewsSnippet;

}
