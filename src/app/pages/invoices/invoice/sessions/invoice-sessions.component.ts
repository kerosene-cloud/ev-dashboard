import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BillingInvoice } from 'types/Billing';

@Component({
  selector: 'app-invoice-sessions',
  templateUrl: 'invoice-sessions.component.html'
})
export class InvoiceSessionsComponent implements OnInit {
  @Input() public formGroup: FormGroup;
  @Input() public invoice!: BillingInvoice;

  // eslint-disable-next-line no-useless-constructor
  public constructor() {
  }

  public ngOnInit() {
  }
}
