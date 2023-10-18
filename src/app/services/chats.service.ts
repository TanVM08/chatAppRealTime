import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection } from 'firebase/firestore';
import { AuthService } from './auth.service';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  createChat(chat: any):Observable<any> {
    const ref = collection(this.firestore, 'chats');
    return from(addDoc(ref, chat));
  }
}
