import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsSnippet } from '../../utils/news/news.model';
import { NewsService } from '../../data-access/news.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { PaginationService } from '../../../shared/data-access/pagination.service';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../shared/ui/pagination/pagination.component';
import { NewsCardComponent } from '../../ui/news-card/news-card.component';
import { SsrPlatformService } from '../../../shared/utils/ssr/ssr-platform.service';
@Component({
  selector: 'app-news-list',
  imports: [CommonModule, FormsModule, PaginationComponent, NewsCardComponent],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.scss',
})
export class NewsListComponent implements OnInit, OnDestroy {
  readonly platform = inject(SsrPlatformService);

  readonly layoutSeed$$ = signal<number>(Math.random());

  private cleanupResize: (() => void) | null = null;


  readonly news$$ = signal<NewsSnippet[]>([]);
  readonly searchTerm$$ = signal('');
  readonly currentPage$$ = signal(1);
  readonly screenWidth$$ = signal<number>(
    this.platform.getWindow()?.innerWidth ?? 1024
  );


  private resizeListener = () => {
    const width = this.platform.getWindow()?.innerWidth;
    if (width) {
      this.screenWidth$$.set(width);
      console.log('[🖥️ screenWidth$$]', width);
    }
  };

  isFeatured(index: number): boolean {
    const cls = this.getNewsCardClass(index);
    return cls === 'wide' || cls === 'tall';
  }

  readonly pageSize$$ = computed(() => {
  const width = this.screenWidth$$();
    const size = width === null
      ? 6 // SSR fallback
      : width < 600
        ? 6
        : width < 1000
          ? 9
          : 12;

    console.log('[📄 pageSize$$]', size);
    return size;
  });

  readonly filteredNews$$ = computed(() => {
    const term = this.searchTerm$$().toLowerCase().trim();
    const all = this.news$$();
    const filtered = !term
      ? all
      : all.filter(item =>
          item.title.toLowerCase().includes(term) ||
          item.source?.toLowerCase().includes(term)
        );

    console.log('[🔍 filteredNews$$]', filtered.length);
    return filtered;
  });

  readonly totalPages$$ = computed(() => {
    const total = Math.ceil(
      this.filteredNews$$().length / this.pageSize$$()
    );
    console.log('[🔢 totalPages$$]', total);
    return total;
  });

  readonly paginatedNews$$ = computed(() => {
    const start = (this.currentPage$$() - 1) * this.pageSize$$();
    const result = this.filteredNews$$().slice(start, start + this.pageSize$$());

    console.log('[📑 paginatedNews$$]', {
      currentPage: this.currentPage$$(),
      result: result.length
    });

    return result;
  });

  constructor(
    private readonly newsService: NewsService,
  ) {
      this.platform.logContext('NewsListComponent loaded');
  }

  ngOnInit(): void {
    this.fetchNews();

    this.platform.onlyOnBrowser(() => {
      let timeout: any;

      const resizeHandler = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          const win = this.platform.getWindow();
          if (!win) return;

          const width = win.innerWidth;
          this.screenWidth$$.set(width);
          console.log('[🖥️ screenWidth$$ updated]', width);
        }, 200); // debounce 200ms
      };

      window.addEventListener('resize', resizeHandler);
      this.cleanupResize = () =>
        window.removeEventListener('resize', resizeHandler);
    });
  }


  ngOnDestroy(): void {
    if (this.cleanupResize) {
      this.cleanupResize();
    }
  }



  private fetchNews(): void {
    this.newsService
      .getNews()
      .pipe(
        catchError((error) => {
          console.error('Error fetching news', error);
          return of([]);
        })
      )
      .subscribe((news: NewsSnippet[]) => {
        this.news$$.set(news);
        console.log('[✅ News loaded]', news.length);
      });
  }

  onPageChange(page: number): void {
    console.log('[📄 onPageChange]', page);

    this.currentPage$$.set(page);
    this.layoutSeed$$.set(Math.random());
    console.log('[🔄 layoutSeed$$ updated]', this.layoutSeed$$());
  }

  getNewsCardClass(index: number): string {
    const seed = this.layoutSeed$$();
    const mod = Math.floor(seed * 10); // 0–9

    if ((index + mod) % 5 === 0) return 'wide';
    if ((index + mod) % 4 === 0) return 'tall';
    return 'default';
  }

  onSearch(term: string): void {
    this.searchTerm$$.set(term);
    this.currentPage$$.set(1); // reset on new search
  }
}

