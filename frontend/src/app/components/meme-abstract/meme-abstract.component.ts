import { Directive, OnInit, signal } from '@angular/core';
import { MemeService } from '../../services/meme.service';
import { AuthService } from '../../services/auth.service';
import { Meme, Comment } from '../../models/data.models';

@Directive()
export abstract class MemeAbstractComponent implements OnInit {
  meme = signal<Meme | null>(null);
  comments = signal<Comment[]>([]);
  userVote = signal<number | null>(null);
  isLoading = signal(true);
  isSubmittingComment = signal(false);

  constructor(
    protected memeService: MemeService,
    public authService: AuthService
  ) {}

  abstract ngOnInit(): void;

  protected loadMeme(id: number): void {
    this.isLoading.set(true);

    this.memeService.getMemeById(id).subscribe({
      next: (meme) => {
        this.meme.set(meme);
        this.comments.set(meme.comments || []);
        this.isLoading.set(false);

        if (this.authService.isAuthenticated()) {
          this.loadUserVote(id);
        }
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  protected loadUserVote(memeId: number): void {
    this.memeService.getUserVote(memeId).subscribe({
      next: (response) => {
        this.userVote.set(response.vote ? response.vote.value : null);
      },
      error: () => {}
    });
  }

  onVote(value: number): void {
    if (!this.meme() || !this.authService.isAuthenticated()) return;

    this.memeService.vote(this.meme()!.id, value).subscribe({
      next: (response) => {
        this.userVote.set(response.vote ? response.vote.value : null);
        this.loadMeme(this.meme()!.id);
      },
      error: () => {}
    });
  }

  onCommentAdded(text: string): void {
    if (!this.meme()) return;

    this.isSubmittingComment.set(true);

    this.memeService.addComment(this.meme()!.id, text).subscribe({
      next: (comment) => {
        this.comments.update(current => [comment, ...current]);
        this.isSubmittingComment.set(false);
      },
      error: () => {
        this.isSubmittingComment.set(false);
      }
    });
  }
}