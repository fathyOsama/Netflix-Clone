import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, filter } from 'rxjs';
import { VideoService } from '../../shared/services/video-service';
import { NotificationService } from '../../shared/services/notification-service';
import { UtilityService } from '../../shared/services/utility-service';
import { MediaService } from '../../shared/services/media-service';
import { DialogService } from '../../shared/services/dialog-service';
import { ErrorHandlerService } from '../../shared/services/error-handler-service';
import { WatchlistService } from '../../shared/services/watchlist-service';

@Component({
  selector: 'app-my-favorites',
  standalone: false,
  templateUrl: './my-favorites.component.html',
  styleUrl: './my-favorites.component.css'
})
export class MyFavoritesComponent implements OnInit,OnDestroy {
  allVideos: any = [];
  filteredVideos: any = [];
  loading = true;
  loadingMore= false;
  error = false;
  searchQuery: string = '';

  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  hasMoreVideo = true;

  private searchSubject = new Subject<string>();

  constructor(
    private videoService: VideoService,
    private watchlistService: WatchlistService,
    private notification: NotificationService,
    public utilityService: UtilityService,
    public mediaService: MediaService,
    private dialogService: DialogService,
    private errorHandlerService: ErrorHandlerService
  ){}

  ngOnInit(): void {
    this.loadVideos();
    this.initializeSearchDebounce();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  initializeSearchDebounce():void{
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.preformSearch();
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollPosition = window.pageYOffset + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 200 && !this.loadingMore && !this.loading && this.hasMoreVideo) {
      this.loadMoreVideos();
    }
  }

  loadVideos(page: number = 0){
    this.error = false;
    this.currentPage = 0;
    this.allVideos = [];
    this.filteredVideos = [];
    const search = this.searchQuery.trim() || undefined;
    this.loading = true;

    this.watchlistService.getWatchlist(page, this.pageSize, search).subscribe({
      next: (response: any) => {
        this.allVideos = response.content;
        this.filteredVideos = response.content;
        this.currentPage = response.number;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.hasMoreVideo = this.currentPage < this.totalPages - 1;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading videos:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadMoreVideos(){
    if(this.loadingMore || !this.hasMoreVideo) return;
    this.loadingMore = true;
    const nextPage  =this.currentPage + 1;
    const search = this.searchQuery.trim() || undefined;

    this.watchlistService.getWatchlist(nextPage, this.pageSize, search).subscribe({
      next: (response: any) => {
        this.allVideos = [...this.allVideos, ...response.content];
        this.filteredVideos = [...this.filteredVideos, ...response.content];
        this.currentPage = response.number;
        this.hasMoreVideo = this.currentPage < this.totalPages - 1;
        this.loadingMore = false;
      },
      error: (err) => {
        this.notification.error('Failed to load more videos');
        this.loadingMore = false;
      }
    });
  }

  onSearch() {
    this.searchSubject.next(this.searchQuery);
  }

  private preformSearch(){
    this.currentPage = 0;
    this.loadVideos();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentPage = 0;
    this.loadVideos();
  }

  toggleWatchlist(video:any, event?:Event){
    if(event){
      event.stopPropagation();
    }

    const videoId = video.id!;

    this.watchlistService.removeFormWatchlist(videoId).subscribe({
      next: () => {
        this.allVideos = this.allVideos.filter((v:any) => v.id !== videoId);
        this.filteredVideos = this.filteredVideos.filter((V:any) => V.id !== videoId);
        this.notification.success('Removed from My Favorites');
      },
      error: (err) => {
        this.errorHandlerService.handle(err, 'Failed to remove from My Favorites. Please try again.');
      }
    });
  }

  getPosterUrl(video:any){
    return this.mediaService.getMediaUrl(video, 'image', {
      userCache: true
    }) || '';
  }

  playVideo(video: any){
    this.dialogService.openVideoPlayer(video);
  }

  formatDuration(seconds:number | undefined): string{
    return this.utilityService.formDuration(seconds);
  }

}
