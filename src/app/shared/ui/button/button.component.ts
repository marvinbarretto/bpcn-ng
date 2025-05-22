import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly variant$$ = input<'primary' | 'secondary' | 'link'>('primary');
  readonly loading$$ = input(false);
  readonly disabled$$ = input(false);

  @Output() pressed = new EventEmitter<void>();
}
