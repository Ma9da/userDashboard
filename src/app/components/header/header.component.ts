import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Output() search = new EventEmitter<string>();
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.search.emit(input.value);
    }
  }
}
