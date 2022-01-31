import { BaseFilter } from '../../../shared/filters/filter/base-filter';
import { FilterDef, FilterType } from '../../../types/Filters';
import { KeyValue } from '../../../types/GlobalType';

export class UserFreeAccessFilter extends BaseFilter {
  public constructor(defaultValue = false) {
    super();
    // Define filter
    const filterDef: FilterDef = {
      id: 'freeAccess',
      httpId: 'FreeAccess',
      type: FilterType.DROPDOWN,
      multiple: true,
      exhaustive: true,
      name: 'users.access_mode',
      class: 'col-md-6 col-lg-3 col-xl-2',
      label: 'users.access_mode',
      cleared: true,
      currentValue: defaultValue,
      items: Object.assign([], freeAccessValues),
    };
    this.setFilterDef(filterDef);
  }
}

export const freeAccessValues: KeyValue[] = [
  { key: 'true', value: 'users.user_with_freeAccess' },
  { key: 'false', value: 'users.user_without_freeAccess' },
];
