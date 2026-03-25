import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user-service';
import { AuthService } from '../../shared/services/auth-service';
import { DialogService } from '../../shared/services/dialog-service';
import { ErrorHandlerService } from '../../shared/services/error-handler-service';
import { NotificationService } from '../../shared/services/notification-service';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

  paginatedUsers: any = [];
  loading = false;
  loadingMore = false;
  error = false;
  currentUserEmail: string | null = null;
  searchQuery: string = '';

  pageSize = 3;
  currentPage = 0;
  totalPages = 0;
  totalUsers = 0;
  hasMoreUsers = true;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private dialogService: DialogService,
    private errorHandlerService: ErrorHandlerService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserEmail = currentUser?.email || null;
    this.loadUsers();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollPosition = window.pageYOffset + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 200 && !this.loadingMore && !this.loading && this.hasMoreUsers) {
      this.loadMoreUsers();
    }
  }

  loadUsers(): void {
    this.loading = true;
    this.error = false;
    this.currentPage = 0;
    this.paginatedUsers = [];
    const search = this.searchQuery.trim() || undefined;

    this.userService.getAllUsers(this.currentPage, this.pageSize, search).subscribe({
      next: (response: any) => {
        this.paginatedUsers = response.content;
        this.totalUsers = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.hasMoreUsers = this.currentPage < this.totalPages - 1;
        this.loading = false;
      },
      error: (err) => {
        this.error = true;
        this.loading = false;
        this.errorHandlerService.handle(err, 'Failed to load users.');
      }
    });
  }

  loadMoreUsers(): void {
    this.loadingMore = true;
    const nextPage = this.currentPage + 1;
    const search = this.searchQuery.trim() || undefined;

    this.userService.getAllUsers(nextPage, this.pageSize, search).subscribe({
      next: (response: any) => {
        this.paginatedUsers = [...this.paginatedUsers, ...response.content];
        this.currentPage = response.number;
        this.hasMoreUsers = this.currentPage < this.totalPages - 1;
        this.loadingMore = false;
      },
      error: (err) => {
        this.loadingMore = false;
        this.errorHandlerService.handle(err, 'Failed to load more users.');
      }
    });
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.currentPage = 0;
    this.loadUsers();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentPage = 0;
    this.loadUsers();
  }

  createUser(): void {
    this.dialogService.openManageUserDialog('create').afterClosed().subscribe(response => {
      if (response) this.loadUsers();
    });
  }

  editUser(user: any): void {
    this.dialogService.openManageUserDialog('edit', user).afterClosed().subscribe(response => {
      if (response) this.loadUsers();
    });
  }

  deleteUser(user: any): void {
    this.dialogService.openConfirmation(
      'Delete User?',
      `Are you sure you want to delete "${user.fullName}"? This action cannot be undone.`,
      'Delete', 'Cancel', 'danger'
    ).subscribe(response => {
      if (response) {
        this.userService.deleteUser(user.id).subscribe({
          next: (response: any) => {
            this.notification.success(response?.message || 'User deleted successfully');
            this.loadUsers();
          },
          error: (err) => this.errorHandlerService.handle(err, 'Failed to delete user.')
        });
      }
    });
  }

  toggleUserStatus(user: any): void {
    this.userService.toggleUserStatus(user.id).subscribe({
      next: (response: any) => {
        this.notification.success(response?.message || 'Status updated successfully');
        this.loadUsers();
      },
      error: (err) => {
        this.errorHandlerService.handle(err, 'Failed to update user status.');
      }
    });
  }

  changeUserRole(user: any): void {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';

    this.dialogService.openConfirmation(
      'Change User Role?',
      `Are you sure you want to change ${user.fullName}'s role to ${newRole}?`,
      'Change Role', 'Cancel', 'warning'
    ).subscribe(response => {
      if (response) {
        this.userService.changeUserRole(user.id, newRole).subscribe({
          next: (response: any) => {
            this.notification.success(response?.message || 'Role updated successfully');
            this.loadUsers();
          },
          error: (err) => {
            this.errorHandlerService.handle(err, 'Failed to change user role.');
          }
        });
      }
    });
  }

  isCurrentUser(user: any): boolean {
    return user.email === this.currentUserEmail;
  }

  getRoleBadgeClass(role: string): string {
    return role === 'ADMIN' ? 'role-badge admin' : 'role-badge user'; // ✅ fixed typo
  }

  getStatusBadgeClass(active: boolean): string {
    return active ? 'status-badge active' : 'status-badge inactive'; // ✅ fixed typo
  }

  formatDate(dateString: string): string { // ✅ fixed parameter name
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }


}
