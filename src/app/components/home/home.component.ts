import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  lstUser: any = [];
  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.getAllUsers();
  }
  getAllUsers() {
    this.usersService.getAllUser().subscribe((res: any) => {
      this.lstUser = res;
    });
  }
}
