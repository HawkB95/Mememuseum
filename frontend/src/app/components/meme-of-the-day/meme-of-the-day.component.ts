import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemeViewComponent } from '../meme-view/meme-view.component';
import { MemeAbstractComponent } from '../meme-abstract/meme-abstract.component';
import { MemeService } from '../../services/meme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-meme-of-the-day',
  standalone: true,
  imports: [CommonModule, MemeViewComponent],
  templateUrl: './meme-of-the-day.component.html',
  styleUrl: '../meme-view/meme-view.component.css',
})
export class MemeOfTheDayComponent extends MemeAbstractComponent {

  constructor(
    memeService: MemeService,
    authService: AuthService
  ) {
    super(memeService, authService);
  }

  override ngOnInit(): void {
    this.memeService.getMemeOfTheDay().subscribe({
      next: (meme) => this.loadMeme(meme.id),
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}