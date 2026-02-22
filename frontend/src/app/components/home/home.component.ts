import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MemeService } from '../../services/meme.service';
import { Meme } from '../../models/data.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  memes = signal<Meme[]>([]);
  currentPage = signal(1);
  totalPages = signal(0);
  totalItems = signal(0);
  isLoading = signal(false);

  searchTag = '';
  dateFrom = '';
  dateTo = '';
  sortBy = 'date_desc';

  constructor(private memeService: MemeService) {}

  ngOnInit(): void {
    this.loadMemes();
  }

  loadMemes(): void {
    this.isLoading.set(true);

    this.memeService.getMemes(
      this.currentPage(),
      this.searchTag || undefined,
      this.dateFrom || undefined,
      this.dateTo || undefined,
      this.sortBy
    ).subscribe({
      next: (response) => {
        this.memes.set(response.memes);
        this.totalPages.set(response.pagination.totalPages);
        this.totalItems.set(response.pagination.totalItems);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadMemes();
  }

  onReset(): void {
    this.searchTag = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.sortBy = 'date_desc';
    this.currentPage.set(1);
    this.loadMemes();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadMemes();
  }

  getImageUrl(imageUrl: string): string {
    return 'http://localhost:3000' + imageUrl;
  }
}