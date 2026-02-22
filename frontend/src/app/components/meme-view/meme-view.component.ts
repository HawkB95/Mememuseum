import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Meme, Comment } from '../../models/data.models';

@Component({
  selector: 'app-meme-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './meme-view.component.html',
  styleUrl: './meme-view.component.css',
})
export class MemeViewComponent {
  @Input() meme: Meme | null = null;
  @Input() comments: Comment[] = [];
  @Input() userVote: number | null = null;
  @Input() isMemeOfTheDay = false;
  @Input() isAuthenticated = false;
  @Input() isLoading = true;
  @Input() isSubmittingComment = false;

  @Output() vote = new EventEmitter<number>();
  @Output() commentAdded = new EventEmitter<string>();

  newComment = '';

  onVote(value: number): void {
    this.vote.emit(value);
  }

  onAddComment(): void {
    if (!this.newComment.trim()) return;
    this.commentAdded.emit(this.newComment.trim());
    this.newComment = '';
  }

  getImageUrl(imageUrl: string): string {
    return 'http://localhost:3000' + imageUrl;
  }
}