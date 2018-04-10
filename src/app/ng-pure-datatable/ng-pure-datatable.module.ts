import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgPureDatatableComponent } from './ng-pure-datatable.component';
import {NgPureDataTableEventService} from "./ng-pure-datatable-event.service";
import {NgPaginateComponent} from "./ng-paginate/ng-paginate.component";
import {NgSearchComponent} from "./ng-search/ng-search.component";
import {NgSearchService} from "./ng-search/ng-search.service";
import {NgPaginateService} from "./ng-paginate/ng-paginate.service";
import {HttpModule} from "@angular/http";

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  declarations: [NgPureDatatableComponent, NgPaginateComponent, NgSearchComponent],
  exports: [NgPureDatatableComponent, NgPaginateComponent, NgSearchComponent],
})
export class NgPureDatatableModule {
  static forRoot() {
    return {
      ngModule: NgPureDatatableModule,
      providers: [NgPureDataTableEventService, NgSearchService, NgPaginateService]
    };
  }
}
