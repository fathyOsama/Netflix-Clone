import { ErrorHandlerService } from './../../shared/services/error-handler-service';
import { Component, HostListener, OnInit } from '@angular/core';
import { DialogService } from '../../shared/services/dialog-service';
import { NotificationService } from '../../shared/services/notification-service';
import { VideoService } from '../../shared/services/video-service';
import { UtilityService } from '../../shared/services/utility-service';
import { MediaService } from '../../shared/services/media-service';

@Component({
  selector: 'app-video-list',
  standalone: false,
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.css'
})
export class VideoListComponent implements OnInit {

  pagedVideos: any = [];
  loading = false;
  loadingMore = false;
  searchQuery = '';

  pageSize = 10;
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  hasMoreVideos = true;

  totalVideos = 0;
  publishedVideos = 0;
  totalDurationSeconds = 0;

  constructor(
    private dialogService: DialogService,
    private notification: NotificationService,
    private videoService: VideoService,
    public utilityService: UtilityService,
    public mediaService: MediaService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.load();
    this.loadStats();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollPosition = window.pageYOffset + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 200 && !this.loading && !this.loadingMore && this.hasMoreVideos) {
      this.loadMoreVideos();
    }
  }

  load(): void {
    this.loading = true;
    this.currentPage = 0;
    this.pagedVideos = [];
    const search = this.searchQuery.trim() || undefined;

    this.videoService.getAllAdminVideos(this.currentPage, this.pageSize, search).subscribe({
      next: (response: any) => {
        this.pagedVideos = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.hasMoreVideos = this.currentPage < this.totalPages - 1;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;       // ✅ fixed
        this.loadingMore = false;
        this.errorHandlerService.handle(err, 'Failed to load videos');
      }
    });
  }

  loadMoreVideos(): void {
    this.loadingMore = true;        // ✅ use loadingMore not loading
    const nextPage = this.currentPage + 1;
    const search = this.searchQuery.trim() || undefined;

    this.videoService.getAllAdminVideos(nextPage, this.pageSize, search).subscribe({
      next: (response: any) => {
        this.pagedVideos = [...this.pagedVideos, ...response.content];
        this.currentPage = response.number;
        this.hasMoreVideos = this.currentPage < this.totalPages - 1;
        this.loadingMore = false;   // ✅ fixed
      },
      error: (err) => {
        this.loadingMore = false;   // ✅ fixed
        this.errorHandlerService.handle(err, 'Failed to load more videos');
      }
    });
  }

  loadStats(): void {
    this.videoService.getStatsByAdmin().subscribe({
      next: (stats: any) => {
        this.totalVideos = stats.totalVideo;       // ✅ fixed field name
        this.publishedVideos = stats.publishVideo; // ✅ fixed field name
        this.totalDurationSeconds = stats.totalDuration;
      },
      error: (err) => {
        this.errorHandlerService.handle(err, 'Failed to load stats');
      }
    });
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.currentPage = 0;
    this.load();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentPage = 0;
    this.load();
  }

  play(video: any): void {
    this.dialogService.openVideoPlayer(video);
  }

  createNew(): void {
    const dialogRef = this.dialogService.openVideoFormDialog('create');
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.load();
        this.loadStats();
      }
    });
  }

  edit(video: any): void {
    const dialogRef = this.dialogService.openVideoFormDialog('edit', video);
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.load();
        this.loadStats();
      }
    });
  }

  remove(video: any): void {
    this.dialogService.openConfirmation(
      'Delete Video?',
      `Are you sure you want to delete "${video.title}"? This action cannot be undone.`,
      'Delete',
      'Cancel',
      'danger'
    ).subscribe(response => {
      if (response) {
        this.loading = true;
        this.videoService.deleteVideoByAdmin(video.id).subscribe({
          next: () => {
            this.notification.success('Video deleted successfully');
            this.load();
            this.loadStats();
          },
          error: (err) => {
            this.loading = false;
            this.errorHandlerService.handle(err, 'Failed to delete video. Please try again.');
          }
        });
      }
    });
  }

  togglePublish(event: any, video: any): void {
    const newPublishState = event.checked;
    this.videoService.setPublishedByAdmin(video.id, newPublishState).subscribe({
      next: () => {
        video.published = newPublishState;
        this.notification.success(`Video ${newPublishState ? 'published' : 'unpublished'} successfully`);
        this.loadStats();
      },
      error: (err) => {
        video.published = !newPublishState;
        this.errorHandlerService.handle(err, 'Failed to update publish status. Please try again.');
      }
    });
  }

  getTotalDuration(): string {
    const total = this.totalDurationSeconds;
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }

  formDuration(seconds: number): string {
    return this.utilityService.formDuration(seconds);
  }

  getPosterUrl(video: any): string | null {
    return this.mediaService.getMediaUrl(video, 'image', { userCache: true });
  }

}
