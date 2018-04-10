import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class NgPaginateService {

  constructor(private http: Http) {}

  /**
   * This is used to list all by paginator
   * @returns {Observable<any>}
   */
  listByPaginator(url): Observable<any> {
    return this.http.get(url).map((res) => res.json());
  }

}
