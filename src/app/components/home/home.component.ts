import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  background: string = 'white';
  lstUser: any = [];
  lstChat: any = [];
  chatSelect: any;
  messagesControl = new FormControl('');
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
      if (this.userCurent.uid) {
        this.getListChat(this.userCurent.uid);
      }
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
      if (res) {
        this.lstChat = res;
        this.lstChat.map((item: any) => {
          let index = item.userIds.indexOf(userId) == 0 ? 1 : 0;
          item.chatName = item.users[index].displayName;
          item.avatar =
            item.users[index].photoURL == ''
              ? null
              : item.users[index].photoURL;
        });
      }
      console.log('lstChat', this.lstChat);
    });
  }

  selectChat(chat: any) {
    this.chatSelect = chat;
    console.log(chat);
  }
  sendMessage() {}
}
