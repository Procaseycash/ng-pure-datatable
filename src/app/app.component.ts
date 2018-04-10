import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NgSearchTypesEnum} from "./ng-pure-datatable/ng-search/ng-search-types.enum";
import {NgPureDataTableEventService} from "./ng-pure-datatable/ng-pure-datatable-event.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'app';

  key = 'app_component';
  public paginator = {
    path: 'http://localhost:8088/api/organizations',
    limit: 20,
    perNav: 5,
    data: null
  };

  public searchSettings = {
    path: 'http://localhost:8088/api/organizations',
    searchType: NgSearchTypesEnum.EMPTY_TABLE_APPLY_BACKEND,
    searchKeys: ['name', 'email'], // can be empty array to enable deep searching
    borderColor: '',
    buttonColor: '',
    queryField: 'search',
    data: null,
    placeholder: 'Filter information...'
  };


  constructor(private ngPureDataTableEventService: NgPureDataTableEventService, private http: HttpClient) {

    this.ngPureDataTableEventService.on(this.key, (res) => {
      if (res['type'] && res['type'] === 'search') {
        console.log('search=', res);
        if (res['error']) {
          return alert('Error Encountered');
        }
        this.searchSettings.data = (res['result'].constructor === Array) ? res['result'] : res['result'].data['data']; // update table data in view
        this.paginator.data['data'] = this.searchSettings.data; // updating list of the paginated data
        return;
      }
      if (res['type'] && res['type'] === 'paging') {
        if (res['error']) {
          return alert('Error Encountered');
        }
        console.log('paging=', res);
        this.paginator.data = res.data; // the full laravel object structure
        this.searchSettings.data = res.data['data']; // the list of the paginated table information
      }
    });

  }

  private getTransactions() {
    this.http.get(this.paginator.path + `?page=1&paginate=${this.paginator.limit}`).subscribe(
      (res) => {
        this.paginator.data = res['data'];
        this.searchSettings.data = res['data']['data'];
      },
      (err) => {

      }
    );
  }

  ngOnInit() {
    this.getTransactions();
  }
}
