import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class PageTitleService {
  constructor(private titleService: Title) {}

  setTitle(title: string): void {
    const finalTitle = title ? `${title} - BPCN` : 'BPCN';
    this.titleService.setTitle(finalTitle);
  }
}
