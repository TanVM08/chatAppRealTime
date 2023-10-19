import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  createChat(chat: any): Observable<any> {
    const ref = collection(this.firestore, 'chats');
    return from(addDoc(ref, chat));
  }

  myListChat(userId: any): Observable<any> {
    const ref = collection(this.firestore, 'chats');
    const sqlquery = query(ref, where('userIds', 'array-contains', userId));
    return collectionData(sqlquery, { idField: 'id' });
  }
}
