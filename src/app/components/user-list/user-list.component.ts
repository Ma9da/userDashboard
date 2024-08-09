import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, OnChanges {
  @Input() searchTerm: string = '';
  displayedColumns: string[] = ['id', 'avatar', 'firstName', 'lastName'];
  dataSource = new MatTableDataSource<any>();
  totalUsers: number = 0;
  pageSize: number = 0;
  isLoading: boolean = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.loadUsers(); 
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchTerm'] && !changes['searchTerm'].isFirstChange()) {
      this.loadUsers(); 
    }
  }

  loadUsers(pageIndex: number = 0) {
    this.isLoading = true;
    if (this.searchTerm) {
      this.userService.searchUsers(this.searchTerm).subscribe(
        (data) => {
          this.dataSource.data = data.data;
          this.totalUsers = data.total;
          this.pageSize = data.per_page;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading users:', error);
          this.isLoading = false;
        }
      );
    } else {
      this.userService.getUsers(pageIndex + 1).subscribe(
        (data) => {
          this.dataSource.data = data.data;
          this.totalUsers = data.total;
          this.pageSize = data.per_page;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading users:', error);
          this.isLoading = false;
        }
      );
    }
  }

  viewUser(id: number) {
    this.router.navigate(['user/', id]);
  }
}
