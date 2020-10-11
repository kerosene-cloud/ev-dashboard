import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TableChargingStationsRebootAction } from 'app/pages/charging-stations/table-actions/table-charging-stations-reboot-action';
import { CentralServerService } from 'app/services/central-server.service';
import { DialogService } from 'app/services/dialog.service';
import { MessageService } from 'app/services/message.service';
import { SpinnerService } from 'app/services/spinner.service';
import { TableSaveAction } from 'app/shared/table/actions/table-save-action';
import { ChargingStation, ChargingStationButtonAction, OCPPConfigurationStatus, OcppParameter } from 'app/types/ChargingStation';
import { KeyValue } from 'app/types/GlobalType';
import { ButtonType, TableActionDef } from 'app/types/Table';
import { Utils } from 'app/utils/Utils';
import { Observable } from 'rxjs';

export interface TableSaveOCPPParameterActionDef extends TableActionDef {
  action: (charger: ChargingStation, param: OcppParameter, dialogService: DialogService,
    translateService: TranslateService, messageService: MessageService, centralServerService: CentralServerService,
    spinnerService: SpinnerService, router: Router, refresh?: () => Observable<void>) => void;
}

export class TableSaveOCPPParameterAction extends TableSaveAction {
  public getActionDef(): TableSaveOCPPParameterActionDef {
    return {
      ...super.getActionDef(),
      id: ChargingStationButtonAction.SAVE_OCPP_PARAMETER,
      name: 'general.save',
      action: this.saveOcppParameter,
      disabled: true,
      formRowAction: true,
    };
  }

  private saveOcppParameter(charger: ChargingStation, param: OcppParameter, dialogService: DialogService,
    translateService: TranslateService, messageService: MessageService, centralServerService: CentralServerService,
    spinnerService: SpinnerService, router: Router, refresh?: () => Observable<void>) {
    // Show yes/no dialog only if fields are not empty
    if (param.key !== null && param.key !== '' && param.value !== null && param.value !== '') {
      dialogService.createAndShowYesNoDialog(
        translateService.instant('chargers.set_configuration_title'),
        translateService.instant('chargers.set_configuration_confirm', { chargeBoxID: charger.id, key: param.key }),
      ).subscribe((result) => {
        if (result === ButtonType.YES) {
          spinnerService.show();
          const params: KeyValue = { key: param.key, value: param.value, readonly: param.readonly };
          if (param.custom) {
            params.custom = param.custom;
          }
          centralServerService.updateChargingStationOCPPConfiguration(charger.id, params).subscribe((response) => {
            spinnerService.hide();
            // Ok?
            if (response.status === OCPPConfigurationStatus.ACCEPTED ||
              response.status === OCPPConfigurationStatus.REBOOT_REQUIRED) {
              messageService.showSuccessMessage(
                translateService.instant('chargers.change_params_success', { paramKey: param.key, chargeBoxID: charger.id }));
              // Reboot Required?
              if (response.status === OCPPConfigurationStatus.REBOOT_REQUIRED) {
                const chargingStationsRebootAction = new TableChargingStationsRebootAction().getActionDef();
                if (chargingStationsRebootAction.action) {
                  chargingStationsRebootAction.action(charger, dialogService, translateService,
                    messageService, centralServerService, spinnerService, router);
                }
              }
              if (refresh) {
                refresh().subscribe();
              }
            } else {
              Utils.handleError(JSON.stringify(response), messageService,
                translateService.instant('chargers.change_params_error', { paramKey: param.key, chargeBoxID: charger.id }));
            }
          }, (error) => {
            spinnerService.hide();
            Utils.handleHttpError(error, router, messageService, centralServerService, translateService.instant('chargers.change_params_error', { paramKey: param.key, chargeBoxID: charger.id }));
          });
        }
      });
    }
  }
}
