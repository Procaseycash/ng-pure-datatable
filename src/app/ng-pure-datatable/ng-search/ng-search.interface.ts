import {NgSearchTypesEnum} from "./ng-search-types.enum";

export interface NgSearchInterface<T> {
  path: string;
  placeholder: string;
  data: Array<Object>;
  searchKeys: Array<string>;
  from: string;
  borderColor: string;
  buttonColor: string;
  queryField: string;
  position: string;
  positionStyle: PositionStyle,
  width: number;
  searchType: NgSearchTypesEnum;
}

export interface PositionStyle {
  right: number;
  top: number;
}
