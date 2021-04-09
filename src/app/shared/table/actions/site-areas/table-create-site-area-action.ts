import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogData } from 'types/Authorization';

import { SiteAreaButtonAction } from '../../../../types/SiteArea';
import { TableActionDef } from '../../../../types/Table';
import { TableCreateAction } from '../table-create-action';

export interface TableCreateSiteAreaActionDef extends TableActionDef {
  action: (siteAreaDialogComponent: ComponentType<unknown>, dialog: MatDialog, data?: DialogData,
    refresh?: () => Observable<void>) => void;
}

export class TableCreateSiteAreaAction extends TableCreateAction {
  public getActionDef(): TableCreateSiteAreaActionDef {
    return {
      ...super.getActionDef(),
      id: SiteAreaButtonAction.CREATE_SITE_AREA,
      action: this.createSiteArea,
    };
  }

  private createSiteArea(siteAreaDialogComponent: ComponentType<unknown>, dialog: MatDialog,
    data?: DialogData, refresh?: () => Observable<void>) {
    super.create(siteAreaDialogComponent, dialog, data, refresh);
  }
}
