import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';  // Firebase modules for Database, Data list and Single object
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore'
import { Profile, ProfileId } from '../models/profile';

@Injectable({
    providedIn: 'root'
  })

  export class UserService {
    userssRef: AngularFireList<any>;    // Reference to User data list, its an Observable
    userRef: AngularFireObject<any>;   // Reference to User object, its an Observable too
    private profileCollection: AngularFirestoreCollection<Profile>;
     // Inject AngularFireDatabase Dependency in Constructor
  constructor(private db: AngularFirestore) { }

  // Fetch Single Student Object
  GetUserProfile(id: string) {
    const citiesRef = this.db.collection('/userprofile',ref=>ref.where('uid',"==",id));
    var userDt:any;
    citiesRef.valueChanges().subscribe(data=>{userDt=data[0];console.log(userDt.firstName)});
    return userDt;
  }
  }