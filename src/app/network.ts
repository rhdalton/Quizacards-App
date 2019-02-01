import { Network } from '@ionic-native/network/ngx';
import { Injectable, OnInit } from '@angular/core';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NetworkClass {
  onlineStatus = false;

  constructor(
    private _net: Network,
    private dialog: Dialogs,
    private platform: Platform) {}

  setOnlineStatus() {
    if (this.platform.is('cordova')) {
      const connection = this._net.type;
      if (connection && connection !== 'unknown' && connection !== 'none') {
        console.log('online!');
        this.onlineStatus = true;
      }
    } else {
      this.onlineStatus = true;
    }
  }

  alertOffline() {
    this.dialog.alert("An Internet connection is required to download the QuizCard Sets. After downloading, you'll be able to access them offline.",
            'Network Offline');
    console.log('network offline');
  }
}
