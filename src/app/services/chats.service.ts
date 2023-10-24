import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, concatMap, from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  constructor(private firestore: Firestore, private authService: AuthService) { }

  createChat(chat: any): Observable<any> {
    const ref = collection(this.firestore, 'chats');
    return from(addDoc(ref, chat));
  }

  myListChat(userId: any): Observable<any> {
    const ref = collection(this.firestore, 'chats');
    const sqlquery = query(ref, where('userIds', 'array-contains', userId));
    return collectionData(sqlquery, { idField: 'id' });
  }

  addChatMessage(chatId: string, message: any): Observable<any> {
    const ref = collection(this.firestore, 'chats', chatId, 'messages');
    const chatRef = doc(this.firestore, 'chats', chatId);
    return from(addDoc(ref, message)).pipe(
      switchMap((res) => {
        return updateDoc(chatRef, { lastMessage: message.text, lastMessageDate: message.sentDate })
      })
    );
  }

  getChatSelect(chatId: string): Observable<any> {
    const ref = collection(this.firestore, 'chat', chatId, 'message')
    const sqlquery = query(ref, orderBy('sentDate', 'asc'));
    return collectionData(sqlquery) as Observable<any>
  }
}
