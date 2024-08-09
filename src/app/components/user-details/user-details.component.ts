import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
})
export class UserDetailsComponent implements OnInit {
  user: any;
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const userId = Number(params.get('id'));
      this.isLoading = true;
      this.userService.getUserById(userId).subscribe(
        user => {
          if (user) {
            this.user = user;
          } else {
            console.warn('User not found');
          }
          this.isLoading = false;
        },
        error => {
          console.error('Error fetching user:', error);
          this.isLoading = false;
        }
      );
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
