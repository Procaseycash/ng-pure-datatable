import {Component, Input, OnInit} from '@angular/core';
import {NgSearchInterface} from "./ng-search/ng-search.interface";
import {NgSearchTypesEnum} from "./ng-search/ng-search-types.enum";
import {NgPureDataTableEventService} from "./ng-pure-datatable-event.service";

@Component({
  selector: 'ng-pure-datatable',
  templateUrl: './ng-pure-datatable.component.html',
  styleUrls: ['./ng-pure-datatable.component.css']
})
export class NgPureDatatableComponent implements OnInit {
  @Input() key = '';
  @Input() id = '';
  @Input() disableSearch = false;
  @Input() disablePaging = false;
  @Input() paginateSettings: paginateSettings = {
    data: {},
    path: '',
    limit: 50,
    from: '',
    perNav: 5,
    viewPage: 'page',
    paginate: 'paginate',
    textColor: '#000'
  };

  @Input() searchSettings: NgSearchInterface<Object> = {
    path: null,
    placeholder: 'What are you looking for?',
    data: [],
    searchKeys: [],
    position: 'right',
    positionStyle: {
      right: null,
      top: null,
    },
    width: 40,
    from: null,
    queryField: 'search',
    borderColor: '#eee000',
    buttonColor: '#83e6bc',
    searchType: NgSearchTypesEnum.EMPTY_TABLE_APPLY_BACKEND
  };

  public top = 0;
  public style = {position: 'absolute', 'margin-bottom': '100px'};
  public limitStyle;
  public ranges = [];
  constructor(private ngPureDataTableEventService: NgPureDataTableEventService) {
  }

  ngOnInit() {
    this.paginateSettings['viewPage'] = (!this.paginateSettings['viewPage']) ? 'page' : this.paginateSettings['viewPage'];
    this.paginateSettings['paginate'] = (!this.paginateSettings['paginate']) ? 'paginate' : this.paginateSettings['paginate'];
    this.paginateSettings['from'] = this.key;
    this.searchSettings['from'] = this.key;
    this.searchSettings['position'] = (this.searchSettings['position']) ? this.searchSettings['position'] : 'right';
    this.searchSettings['positionStyle'] = (this.searchSettings['positionStyle']) ? this.searchSettings['positionStyle'] : null;
    this.searchSettings['width'] = (this.searchSettings['width']) ? this.searchSettings['width'] : 40;
    this.paginateSettings['textColor'] = (this.paginateSettings['textColor']) ? this.paginateSettings['textColor'] : '#000';
    this.style['width'] =  this.searchSettings['width'] + '%';
    this.limitStyle = JSON.parse(JSON.stringify(this.style));
    this.limitStyle['width'] =  '200px';
    // console.log('width', this.searchSettings['width'], this.searchSettings['position']);
    this.configSearchDisplay();
    this.processLimit();
  }

  /**
   * This is used to generate limit range.
   */
  processLimit() {
    const div = Math.floor(+this.paginateSettings.limit / 2);
    this.ranges = [];
    let range = 0;
    // console.log('div=', div);
    if ((div % 2) === 0) {
      range = 10;
    } else {
      range = 15;
    }
    const ranges = (range === 10) ? 101 : 106;
    for (let i = range; i < ranges; i+= range) {
      if (i > this.paginateSettings.data['total']) {
        break;
      }
      this.ranges.push(i);
    }
  }


  /**
   * This is used to update limit
   * @param limit
   */
  updateLimit(limit) {
    this.paginateSettings.limit = +limit;
    // console.log('this.paginateSettings.limit', this.paginateSettings.limit);
    this.ngPureDataTableEventService.broadcast('resetLimitCalled', this.paginateSettings.limit);
  }


  /**
   * This is used to set the border color for the div
   * @returns {{border-bottom: string}}
   */
  public setBorderColor() {
    this.searchSettings.borderColor = (this.searchSettings.borderColor) ? this.searchSettings.borderColor : '#eee000';
    return {'border-bottom': '3px solid ' + this.searchSettings.borderColor};
  }


  /**
   * This is used to configure search and limit position
   */
  configSearchDisplay(): void {
    this.id = (this.id.indexOf('#') > -1) ? this.id : '#' + this.id;
    const element = document.querySelector(this.id);
    this.top = element.getBoundingClientRect().top;
    if (this.top < 50) {
      this.style['margin-top'] = '20px';
      this.limitStyle['margin-top'] = this.style['margin-top'];
      element['style'].marginTop = '80px';
    }
    const right = (this.searchSettings['positionStyle'] && (this.searchSettings['positionStyle']['right'] <= -1 || this.searchSettings['positionStyle']['right'] >= 0)) ? this.searchSettings['positionStyle']['right']: '10px';
    const top = (this.searchSettings['positionStyle'] && (this.searchSettings['positionStyle']['top'] >= 0 || this.searchSettings['positionStyle']['top'] <= -1 )) ? this.searchSettings['positionStyle']['top']: null;

    if (this.searchSettings['position'].toLowerCase() === 'right') {
      this.style['right'] = right + 'px';
      this.limitStyle['left'] =  this.style['right'];
    } else {
      this.style['left'] = right + 'px';
      this.limitStyle['right'] =  this.style['left'];
    }
    this.top = (top) ? top : (this.top && this.top > 50) ? this.top - 50 : this.top;
    this.style['top'] = this.top + 'px';
    this.limitStyle['top'] = this.style['top'];
   // console.log('element=', element.getBoundingClientRect().top);
  }
}

export interface paginateSettings {
  data: Object;
  path: string;
  limit: number;
  from: string;
  perNav: number;
  viewPage: string;
  paginate: string;
  textColor: string;
}
