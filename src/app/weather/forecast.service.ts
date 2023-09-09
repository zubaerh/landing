import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, switchMap, pluck, mergeMap, of, filter, toArray, tap, throwError, catchError, retry } from 'rxjs';
import { NotificationsService } from '../notifications/notifications.service';

interface OpenWeatherResponse {
  list: {
    dt_txt: string;
    main: {
      temp: number;
    }
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ForecastService {
  private url = 'https://api.openweathermap.org/data/2.5/forecast';
  constructor(private http: HttpClient, 
    private notificationsService: NotificationsService ) { }

  getForecast(){
    return this.getCurrentLocation().pipe(
      map(coords => {
        return new HttpParams()
        .set('lat', String(coords.latitude))
        .set('lon', String(coords.longitude))
        .set('units','metric')
        .set('appid', '56262ff45bbaaa030263ecf2f7d9e14b');
      }),
      switchMap(params => this.http.get<OpenWeatherResponse>(this.url, { params })
      ), pluck('list'),
      mergeMap( value => of(...value)),
      filter((value, index) => index % 8 === 0),
      map(value => {
        return{
          dateString: value.dt_txt,
          temp: value.main.temp
        };
      }),
      toArray()
    );
  }

  getCurrentLocation(){
    return new Observable<GeolocationCoordinates>((observer)=>{
      window.navigator.geolocation.getCurrentPosition(
        (position) =>{
          observer.next(position.coords);
          observer.complete();
        },
        err => observer.error(err)
      );

    }).pipe(
      retry(1),
      tap(() => {
        this.notificationsService.addSuccess('Got your location');
      }),
      catchError((err) => {
        this.notificationsService.addError('Failed to Get your location');
        return throwError(err);
      })
    );
  }
}
