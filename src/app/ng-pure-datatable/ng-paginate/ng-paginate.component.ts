import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {NgPaginateService} from "./ng-paginate.service";
import {NgPureDataTableEventService} from "../ng-pure-datatable-event.service";

@Component({
  selector: 'ng-paginate',
  templateUrl: './ng-paginate.component.html',
  styleUrls: ['./ng-paginate.component.css']
})
export class NgPaginateComponent implements OnInit, AfterViewInit {
  @Input() data: Object;
  @Input() path = '';
  @Input() limit = 50;
  @Input() from = '';
  @Input() perNav = 5;
  @Input() viewPage: string = 'page';
  @Input() paginate: string = 'paginate';
  @Input() textColor: string = '#000';
  public next_page = '';
  public prev_page = '';
  public showLoad = 0;
  public totalPages = [];
  public pages: Array<number> = [];
  public total = 0;
  public perNavCopy = {
    nav: 5
  };

  constructor(private ngPaginateService: NgPaginateService,
              private ngPureDataTableEventService: NgPureDataTableEventService) {
    this.ngPureDataTableEventService.on('getUrlPath', (path) => {
      this.path = path;
    });
    this.ngPureDataTableEventService.on('resetLimitCalled', (limit) => {
      setTimeout(() => {
        const buildPage = this.viewPage + '=' + 1;
        this.limit = limit;
        this.loadData(( buildPage + '&' + this.paginate + '=' + this.limit), buildPage);
      }, 200);
    });
  }


  /**
   * This is used to get total pages array
   */
  getPages() {
    for (let i = 1; i <= this.data['last_page']; i++) {
      this.totalPages.push(i);
    }
    const perNav = JSON.parse(JSON.stringify(this.perNavCopy));
    this.perNav = perNav.nav;
    // console.log('thperVa=', this.perNav);
    this.getPaging();
    // console.log('pages=', this.totalPages, this.data['last_page'], this.data['current_page']);
  }

  /**
   * This is used get list of page navigation
   */
  getPaging() {
    this.perNav += this.pages.length;
    this.pages = this.totalPages.slice(0, this.perNav);
  }


  /**
   * This is used to load data
   * @param queryPath
   * @param page
   */
  loadData(queryPath, page?: any) {
    // console.log('queryPath=', queryPath, page);
    const posQ = this.path.indexOf('?');
    let url = '';
    if (posQ === -1) {
      url = this.path + '?' + queryPath;
    } else {
      url = this.path + '&' + queryPath;
    }
    this.showLoad = (typeof (page) === 'string') ? parseInt((page.substr(page.indexOf('=') + 1)), 10) : page;
    // console.log('showLoad= ', this.showLoad, page);
    this.ngPaginateService.listByPaginator(url).subscribe(
      (res: Res) => {
        if (this.showLoad > this.pages.length) {
          this.getPaging();
        }
        this.data = (res['last_page']) ? res : res.data || res.content || res.contents || res.resource || res.resources || res.list || res.items;
        this.nextPrevPage();
        res['type'] = 'paging';
        this.ngPureDataTableEventService.broadcast(this.from, res);
        this.showLoad = 0;
        this.total = this.data['total'] || this.limit;
        // console.log('data=>', data);
        this.processPerNav();
      },
      err => {
        err['type'] = 'paging';
        this.ngPureDataTableEventService.broadcast(this.from, err);
        this.showLoad = 0;
      }
    );
  }

  /**
   * This is used to adjust content per nav display based on limit selected
   */
  private processPerNav() {
    const page = Math.ceil(this.data['total'] / this.limit);
    // console.log('page==>', page, 'perNav=', this.perNav );
    if (this.perNav > page) {
      setTimeout(() => {
        this.totalPages = this.totalPages.slice(0, page);
        this.pages = this.totalPages.slice(0, page);
      }, 200);
    } else {
      setTimeout(() => {
        this.totalPages = [];
        this.pages = [];
        this.getPages();
        // console.log('this.totalPages', this.totalPages.toString());
      }, 200);
    }
  }

  /**
   * This is used to get next page number format from page url.
   * @returns {null}
   */
  nextPrevPage() {
    const queryString = this.viewPage.trim() + '=';
    if (Object.keys(this.data).length === 0) {
      return null;
    }
    if (this.data['next_page_url']) {
      const nextPos = this.data['next_page_url'].indexOf(queryString);
      this.next_page = this.data['next_page_url'].substr(nextPos).trim();
      // console.log('pois=', nextPos, this.next_page);
    }
    if (this.data['prev_page_url']) {
      const prevPos = this.data['prev_page_url'].indexOf(queryString);
      this.prev_page = this.data['prev_page_url'].substr(prevPos).trim();
      // console.log('prpos=', prevPos, this.prev_page);
    }
  }

  ngOnInit() {
    // console.log('this.data=', this.data);
    this.nextPrevPage();
    this.getPages();
    this.perNavCopy = JSON.parse(JSON.stringify({nav: this.perNav}));
    this.total = this.data['total'] || this.limit;
  }

  ngAfterViewInit() {
    // console.log('this.data=', this.data);
  }

}

interface DataRes {
  data: Array<Object>;

  [propName: string]: any;
}

interface Res {
  data: DataRes;
  content: DataRes,
  contents: DataRes,
  resource: DataRes,
  resources: DataRes,
  list: DataRes,
  items: DataRes,
  status: boolean;

  [propName: string]: any;
}
