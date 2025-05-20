import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NewsSnippet } from '../../utils/news/news.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.scss'
})
export class NewsCardComponent implements OnChanges {
  @Input() news!: NewsSnippet;
  @Input() isFeatured?: boolean;

  imageError = false;
  imageUrl: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['news'] && this.news?.title && this.isFeatured) {
      this.imageUrl = this.getImageUrl(this.news.title);
      console.log('[🖼️ imageUrl]', this.imageUrl);
    }
  }

  // TODO: Fix image loading, make them unique and relevant

  getImageUrl(headline: string): string {
    const keywords = headline
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .slice(0, 3)
      .join(',');

    return `https://loremflickr.com/400/300/${encodeURIComponent(keywords)}`;
  }
}
