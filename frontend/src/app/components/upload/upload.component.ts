import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MemeService } from '../../services/meme.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upload.component.html'
})
export class UploadComponent {

  uploadForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    tags: new FormControl('')
  });

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  errorMessage = signal('');
  isLoading = signal(false);

  constructor(
    private memeService: MemeService,
    private router: Router
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.imagePreview = URL.createObjectURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.uploadForm.invalid || !this.selectedFile) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.memeService.uploadMeme(
      this.uploadForm.value.title!,
      this.selectedFile,
      this.uploadForm.value.tags || ''
    ).subscribe({
      next: (meme) => {
        this.router.navigate(['/meme', meme.id]);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.error || 'Errore durante il caricamento.');
      }
    });
  }
}