import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hero',
  imports: [CommonModule],
  template: `
    <section class="hero">
      <div class="hero-content">
        <h2 class="strapline">
          Supporting Black men through prostate cancer research, education, and community
        </h2>
      </div>
    </section>
  `,
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  constructor() {}
}
