import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { EmitterService } from './_shared/services/emitter.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ bottom: '20px' })),
      transition('void => *', [
        style({ bottom: '20px' }),
        animate(500)
      ]),
      transition('* => void', [
        animate(500, style({ bottom: '-50px' }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy {

  message;
  lat;
  lon;

  allSub: Subject<any> = new Subject<any>();

  ngOnInit() {
    this.prepareShowMessage();
    this.initCurrentGeo();
  }

  initCurrentGeo() {
    navigator.geolocation.getCurrentPosition((res) => {
      const coords = res.coords;
      this.lat = coords.latitude;
      this.lon = coords.longitude;
    }, err => {
      this.showMessage(err.message);
    });
  }

  prepareShowMessage() {
    EmitterService.get(EmitterService.ToastMessage)
      .pipe(
        takeUntil(this.allSub)
      )
      .subscribe(res => {
        if (this.message) {
          return;
        }

        this.message = res;
        this.removeMessage();
      });
  }

  ngOnDestroy() {
    this.allSub.unsubscribe();
  }

  showMessage(msg) {
    EmitterService.get(EmitterService.ToastMessage)
      .emit(msg);
  }

  removeMessage() {
    setTimeout(() => {
      this.message = '';
    }, 7500);
  }
}
