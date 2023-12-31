import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { ProfileUser } from 'src/app/models/user';
import { ChatsService } from 'src/app/services/chats.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild('scrollBottom') scrollBottom!: ElementRef;
  userCurent: any;
  background: string = 'white';
  lstUser: any = [];
  lstChat: any = [];
  chatSelect: any;
  lstMessage: any;
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
    let isCheck = this.isCheckChat(this.lstChat, item.uid);
    if (isCheck == 0) {
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
    });
  }

  selectChat(chat: any) {
    this.chatSelect = chat;
    this.chatService.getChatSelect(chat.id).subscribe((res) => {
      this.lstMessage = res;
    });
  }

  sendMessage() {
    if (this.messagesControl.value && this.chatSelect) {
      let message: Object = {
        text: this.messagesControl.value,
        senderId: this.userCurent.uid,
        sentDate: Timestamp.fromDate(new Date()),
      };
      this.chatService
        .addChatMessage(this.chatSelect.id, message)
        .subscribe(() => {
          this.scrollToBottom();
        });
      this.messagesControl.setValue('');
    }
  }

  isCheckChat(lstChat: any, uid: string): number {
    let rs: number = 0;
    lstChat.map((chat: any) => {
      if (chat.userIds.includes(uid)) {
        this.selectChat(chat);
        rs = 1;
      }
    });
    return rs;
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.scrollBottom) {
        this.scrollBottom.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
}
