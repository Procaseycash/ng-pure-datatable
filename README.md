# NgPureDatatable (Angular 4^ & ^5...)

This is a Angular datatable for tables which is not dependent on jquery. This is fully written with typescript and it uses observables to communicate events across the user defined table. This is inspired by previous libraries I wrote for `Larang-Paginator` && `Angular-Table-Searcher`

For other backend language to use this library. Please make sure your success response conforms with this response: 
 
Note: the "data" key holding the payload can either be 'resource' || 'resources' || 'content' || 'contents' || 'items' || 'list' || no key specified holding the payload in response
   
      
    data: {
             "total": 50, // total count of all paginated data
             "per_page": 15,
             "current_page": 1,
             "last_page": 4,
             "next_page_url": "http://laravel.app?page=2",
             "prev_page_url": null,
             "path": "http://laravel.app",
             "from": 1,
             "to": 15,
             "data":[
                  {
                      // Result Object
                  },
                  {
                      // Result Object
                  }
              ]
          }
    
  ## Release Note
  
  Due to compatibility issues in Angular 4 & 5, we will maintain all:
  ````
  Angular 4 from 4.0.0 and above.
  Angular 5 from 5.0.0 and above.
  ````
  

 ## Installation
 
 `npm install --save ng-pure-datatable`

## Sample Image in use

![Alt text](src/assets/datatable.jpg?raw=true "ng-pure-datatable")
   
## Usage in Application

Follow the instruction below to use ng-pure-datatable.

`import {NgPureDatatableModule} from 'ng-pure-datatable';`

Add `NgPureDatatableModule.forRoot()` in AppModule or Other Modules using `NgPureDatatableModule`
     
   # Notice for pagination Settings: 
  ```` 
  path: full path of the api url to call for data.
  data: (paginated response): Object related to laravel response, this must be the first data rendered from the component which information are picked to generate the pagination.
  limit: (optional)  paginated data per page, default is 50.
  perNav: (optional) navigation bar to show at a time: defualt is 5.
  viewPage:(optional)  string value to hold the Integer value for the next page. default is 'page'
  paginate: (optional) string value to hold the Integer value for limit in a view page. defualt is 'paginate'.
  textColor: (optional) this color will be applied to text for page information.
  
   
  Note that the query string in (next_page_url & prev_page_url) must be thesame to what is passed down in viewPage & paginate for paginator to work with.

  ````
 
  A sample NgPureDatatableModule pagination built url for paginating will be `http://localhost:8088/api/organizations?page=1&paginate=5`
 
 
    
 # Notice for search settings: 
   
   ```` 
   path: full path of the api url to call for search option.
   data: (paginated response list ): array, this must be the first data rendered from the component which information are picked to enable searching.
   searchKeys: Keys to tell the NgPureDatatable Search to use to filter data but can be empty array to search all through object and its child.
   searchType: We have three search types which can be from backend, table, table not found with backend. (Import NgSearchTypesEnum)
   placeholder: What to display in the input field as a message
   buttonColor: The background color of the table seacher.
   borderColor: (optional) The border-bottom color of the table seacher.
   queryField: The field name to pass search value into. such as search will be search='value entered'
   width: (optional) The width of the search,
   position: (optional) The position of the search (accept 'right' or 'left'),
   positionStyle: (optional) The position style is an object of top and right integer value only (eg {top: 35, right: 20}) but if position is set to left, the style right will be applied on the left position
   ````
   
   #### Notice for table mapping key and Id to communicate with your defined table

  ````
  key: The unique key per table to enable event broadcasting
  id: The table unique id generated to allow search injection 
  disableSearch: This is used to disable the search option by passing true (default is false)
  disablePaging:  This is used to disable the pagination option by passing true  (default is false)
  ````  
  
   ## *.component.ts
   
   Add/refactor the following code to the appropriate places in your component.ts

  
````
import {Component, OnInit} from '@angular/core';
import {Http} from "@angular/http";
import {NgSearchTypesEnum, NgPureDataTableEventService} from "ng-pure-datatable";


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
    width: 50,
    position: 'right',
    positionStyle: {
      right: 0,
      top: -50
    },
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

  ````
  
  ## *.component.html
  Add this below the table you want it to paginate data from backend.
  
  ````
<!--The content below is only a placeholder and can be replaced.-->
<div style="text-align:center;">
  <h1>
    Welcome to {{ title }}! 
  </h1>
  <img width="300" alt="Angular Logo"
       src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg==">
</div>
<div class="col-sm-12 content" *ngIf="paginator.data">
  <div style="display: block">
    <table id="userTable" width="100%" class="table table-striped table-responsive">
      <tr>
        <td>#</td>
        <td>Name</td>
        <td>Email</td>
      </tr>

      <tr *ngFor="let page of paginator.data['data']; let i = index;">
        <td>{{((paginator.data['current_page'] - 1) * paginator.limit + i + 1) || (i + 1)}}</td>
        <td>{{page?.name}}</td>
        <td>{{page?.email}}</td>
      </tr>

    </table>
  </div>

  <ng-pure-datatable [id]="'userTable'" [key]="key" [searchSettings]="searchSettings"
                     [paginateSettings]="paginator"></ng-pure-datatable>

</div>


````

## .component.css

````
.content {
  margin: 30px;
  position: relative;
  background: #fff;
  color: #000;
}

````

## Backend expected request

Your backend for pagination will expect 

````
viewPage: integer to determine next page
paginate: integer to determine limit of data per view page.
````
 
Your backend for search will expect 

````
queryField: query name to hold search value
````
 
## Build as a package

`npm run pack-build`


## Publish to npm

`npm publish dist`
