import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import {NgSearchTypesEnum} from "./ng-search-types.enum";
import {NgSearchInterface} from "./ng-search.interface";
import {NgSearchService} from "./ng-search.service";
import {NgPureDataTableEventService} from "../ng-pure-datatable-event.service";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'ng-search',
  templateUrl: './ng-search.component.html',
  styleUrls: ['./ng-search.component.css'],
})
export class NgSearchComponent implements OnInit {

  public search$ = new Subject<string>();

  private static defaultAllSettings: NgSearchInterface<Object> = {
    path: null,
    placeholder: 'What are you looking for?',
    data: [],
    searchKeys: [],
    from: null,
    position: 'right',
    width: 40,
    positionStyle: {
      right: null,
      top: null
    },
    queryField: 'search',
    borderColor: '#eee000',
    buttonColor: '#83e6bc',
    searchType: NgSearchTypesEnum.EMPTY_TABLE_APPLY_BACKEND
  };

  @Input() allSettings: NgSearchInterface<Object> = {
    path: null,
    placeholder: 'What are you looking for?',
    data: [],
    searchKeys: [],
    from: null,
    position: 'right',
    positionStyle: {
      right: null,
      top: null
    },
    width: 40,
    queryField: 'search',
    borderColor: '#eee000',
    buttonColor: '#83e6bc',
    searchType: NgSearchTypesEnum.EMPTY_TABLE_APPLY_BACKEND
  };

  public searching = false;
  private copyData = [];


  constructor(private ngSearchService: NgSearchService,
              private ngPureDataTableEventService: NgPureDataTableEventService) {
    this.search$
      .distinctUntilChanged()
      .debounceTime(400)
      .subscribe(
        res => {
          if (res && res.length > 1) {
            this.doSearch(res);
            return;
          }
          if (res.length === 0) {
            this.ngPureDataTableEventService.broadcast(this.allSettings.from, {type: 'search', result: this.copyData, data: this.copyData});
          }
        },
        err => {
        }
      );
  }

  /**
   * This is used to set the border color for the div
   * @returns {{border-bottom: string}}
   */
  public setBorderColor() {
    return {'border-bottom': '3px solid ' + this.allSettings.borderColor};
  }

  /**
   * This is used to style the button background
   * @returns {{background: string}}
   */
  public setButtonColor() {
    return {'background': this.allSettings.buttonColor};
  }

  /**
   * This is used to initialize searching on a table.
   * @param query
   */
  doSearch(query) {
    this.copyData = JSON.parse(JSON.stringify(this.allSettings.data));
    if (!query) {
      return null;
    }
    this.searching = true;
    setTimeout(() => {
      switch (this.allSettings.searchType) {
        case NgSearchTypesEnum.EMPTY_TABLE_APPLY_BACKEND:
          this.processSearching(NgSearchTypesEnum.EMPTY_TABLE_APPLY_BACKEND, query);
          break;
        case NgSearchTypesEnum.ON_BACKEND:
          this.doSearchBackend(query);
          break;
        case NgSearchTypesEnum.ON_TABLE:
          this.processSearching(NgSearchTypesEnum.ON_TABLE, query);
          break;
        default:
          Observable.throw('Unknown search type');
          break;
      }
    }, 200);
  }

  /**
   * This is used to search query strings
   * @param type
   * @param query
   */
  private processSearching(type, query) {
    this.ngSearchService.initSearch(this.allSettings.data, query, this.allSettings.searchKeys)
      .subscribe(
        (result) => {
          // console.log('saerchResult=', result);
          if (result.length === 0 && type === NgSearchTypesEnum.EMPTY_TABLE_APPLY_BACKEND) {
            this.doSearchBackend(query);
            return;
          }
          this.ngPureDataTableEventService.broadcast(this.allSettings.from, {type: 'search', result: result, data: this.copyData});
          this.searching = false;
          // console.log('searching=', this.searching);
        },
        (err) => {
          this.searching = false;
          this.ngPureDataTableEventService.broadcast(this.allSettings.from, {type: 'search', error: err, data: this.copyData});
        }
      );
  }

  /**
   * This is used to make a request to a backend api for searching.
   * @param query
   */
  private doSearchBackend(query) {
    const pos = this.allSettings.path.indexOf('?');
    const path = (pos > -1) ? this.allSettings.path + `&${this.allSettings.queryField}=${query}` : this.allSettings.path + `?${this.allSettings.queryField}=${query}`;
    this.ngSearchService.searchResource(path)
      .subscribe(
        (res) => {
          this.ngPureDataTableEventService.broadcast(this.allSettings.from, {type: 'search', result: res, data: this.copyData});
          this.searching = false;
        },
        (err) => {
          this.searching = false;
          this.ngPureDataTableEventService.broadcast(this.allSettings.from, {type: 'search', error: err, data: this.copyData});
        }
      );
  }

  /**
   * This is used to validate object passed down to table searcher.
   * @constructor
   */
  ValidateSettings() {
    for (const key in this.allSettings) {
      if (!this.allSettings[key]) {
        this.allSettings[key] = NgSearchComponent.defaultAllSettings[key];
      }
    }
  }

  ngOnInit() {
    this.ValidateSettings();
    this.copyData = JSON.parse(JSON.stringify(this.allSettings.data));
  }

}



