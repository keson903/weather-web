import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { WeatherService } from '../_shared/services/weather.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EmitterService } from '../_shared/services/emitter.service';

@Component({
  selector: 'app-weather-card',
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.scss']
})
export class WeatherCardComponent implements OnChanges {

  @Input() isAntipode;
  @Input() lat;
  @Input() lon;

  weather: Weather;
  allSub: Subject<any> = new Subject<any>();


  constructor(
    private weatherSvc: WeatherService
  ) { }

  ngOnChanges() {
    this.refresh();
  }

  refresh() {
    if (this.lat === undefined || this.lon === undefined) {
      return;
    }
    this.get(this.isAntipode, this.lat, this.lon);
  }


  get(isAntipode, lat, lon) {
    const obs$ = isAntipode
      ? this.weatherSvc.antipode(lat, lon)
      : this.weatherSvc.current(lat, lon);

    this.weather = null;
    obs$
      .pipe(
        takeUntil(this.allSub)
      )
      .subscribe((res) => {
        this.weather = res;
      }, err => {
        this.weather = err || this.defaultWeather();
        console.log(this.weather);
        const msg = err ? 'API not available. Retrieve last weather' : 'Ops! API not available';
        this.showMessage(msg);
      });
  }

  defaultWeather() {
    return {
      location: 'unknown',
      icon: 'unavailable',
      description: 'Unavailable',
      temperature: 88,
      now: new Date(),
      last_update: new Date()
    };
  }

  showMessage(msg) {
    EmitterService.get(EmitterService.ToastMessage)
      .emit(msg);
  }

}
