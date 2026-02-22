import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MemeViewComponent } from '../meme-view/meme-view.component';
import { MemeAbstractComponent } from '../meme-abstract/meme-abstract.component';
import { MemeService } from '../../services/meme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-meme-detail',
  standalone: true,
  imports: [CommonModule, MemeViewComponent],
  templateUrl: './meme-detail.component.html',
  styleUrl: '../meme-view/meme-view.component.css',
})
export class MemeDetailComponent extends MemeAbstractComponent {

  constructor(
    private route: ActivatedRoute,
    memeService: MemeService,
    authService: AuthService
  ) {
    super(memeService, authService);
  }

  override ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadMeme(+params['id']);
    });
  }
}