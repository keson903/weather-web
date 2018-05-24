import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError, } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class WeatherService {

  constructor(
    private http: HttpClient
  ) { }

  current(lat: Number, lon: Number) {
    const url = `${environment.remoteUrl}api/current?lat=${lat.toFixed(3)}&lon=${lon.toFixed(3)}`;
    return this.getOrStore<Weather>(url);
  }

  antipode(lat: Number, lon: Number) {
    const url = `${environment.remoteUrl}api/antipode?lat=${lat.toFixed(3)}&lon=${lon.toFixed(3)}`;
    return this.getOrStore<Weather>(url);
  }

  private getOrStore<T>(url) {
    return this.http.get<T>(url)
      .pipe(
        map(s => {
          sessionStorage[`wa.${url}`] = JSON.stringify(s);
          return s;
        }),
        catchError(err => {
          const error = err.error || { message: 'Ops! Error appear in API' };
          return throwError(this.getStorage(`wa.${url}`));
        })
      );
  }

  private getStorage(id) {
    try {
      return JSON.parse(sessionStorage[id]);
    } catch {
      return null;
    }
  }
}
