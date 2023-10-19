import { Component, OnInit } from '@angular/core';
import { ProfileUser } from 'src/app/models/user';
import { ChatsService } from 'src/app/services/chats.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  userCurent: any;
  lstUser: any = [];
  lstChat: any = [];
  constructor(
    private usersService: UsersService,
    private chatService: ChatsService
  ) {}

  ngOnInit(): void {
    this.getUserCurent();
    this.getAllUsers();
  }

  getUserCurent() {
    this.usersService.currentUserProfile$.subscribe((res) => {
      this.userCurent = res;
      this.getListChat(this.userCurent.uid);
    });
  }
  getAllUsers() {
    this.usersService.getAllUser().subscribe((res: any) => {
      this.lstUser = res;
    });
  }

  createChat(item: ProfileUser) {
    let chat: object = {
      userIds: [this.userCurent?.uid, item.uid],
      users: [
        {
          displayName: this.userCurent?.displayName ?? '',
          photoURL: this.userCurent?.photoURL ?? '',
        },
        {
          displayName: item?.displayName ?? '',
          photoURL: item?.photoURL ?? '',
        },
      ],
    };
    this.chatService.createChat(chat);
  }

  getListChat(userId: any) {
    this.chatService.myListChat(userId).subscribe((res) => {
      this.lstChat = res;
      console.log('lstChat', this.lstChat);
    });
  }
}
