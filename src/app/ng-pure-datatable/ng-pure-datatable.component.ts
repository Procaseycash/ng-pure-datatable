import {Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {NgSearchInterface} from "./ng-search/ng-search.interface";
import {NgSearchTypesEnum} from "./ng-search/ng-search-types.enum";

@Component({
  selector: 'ng-pure-datatable',
  templateUrl: './ng-pure-datatable.component.html',
  styleUrls: ['./ng-pure-datatable.component.css']
})
export class NgPureDatatableComponent implements OnInit {
  @Input() key = '';
  @Input() id = '';
  @Input() paginateSettings: paginateSettings = {
    data: {},
    path: '',
    limit: 50,
    from: '',
    perNav: 5,
    viewPage: 'page',
    paginate: 'paginate',
  };

  @Input() searchSettings: NgSearchInterface<Object> = {
    path: null,
    placeholder: 'What are you looking for?',
    data: [],
    searchKeys: [],
    position: 'right',
    width: 40,
    from: null,
    queryField: 'search',
    borderColor: '#eee000',
    buttonColor: '#83e6bc',
    searchType: NgSearchTypesEnum.EMPTY_TABLE_APPLY_BACKEND
  };

  public top = 0;
  public style = {position: 'absolute', 'margin-bottom': '100px'};

  constructor(private renderer: Renderer2, private elRef: ElementRef) {
  }

  ngOnInit() {
    this.paginateSettings['viewPage'] = (!this.paginateSettings['viewPage']) ? 'page' : this.paginateSettings['viewPage'];
    this.paginateSettings['paginate'] = (!this.paginateSettings['paginate']) ? 'paginate' : this.paginateSettings['paginate'];
    this.paginateSettings['from'] = this.key;
    this.searchSettings['from'] = this.key;
    this.searchSettings['position'] = (this.searchSettings['position']) ? this.searchSettings['position'] : 'right';
    this.searchSettings['width'] = (this.searchSettings['width']) ? this.searchSettings['width'] : 40;

    console.log('width', this.searchSettings['width'], this.searchSettings['position']);
    this.configSearchDisplay();
  }


  configSearchDisplay(): void {
    this.id = (this.id.indexOf('#') > -1) ? this.id : '#' + this.id;
    const element = document.querySelector(this.id);
    this.top = element.getBoundingClientRect().top;
    if (this.top < 50) {
      this.style['margin-top'] = '20px';
      element['style'].marginTop = '80px';
    }
    if (this.searchSettings['position'] === 'right') {
      this.style['right'] = '10px';
    } else {
      this.style['left'] = '10px';
    }
    this.top = (this.top && this.top > 50) ? this.top - 50 : this.top;
    this.style['top'] = this.top + 'px';
    console.log('element=', element.getBoundingClientRect().top);
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
}
