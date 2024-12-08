import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ModelCurdService } from '../model-curd.service';
import { StrategyTemplate } from '@/models/strategy/strategy-template';


@Injectable()
export class StrategyTemplateService extends ModelCurdService<StrategyTemplate> {

  constructor(protected override http: HttpClient,
              protected override dialog: MatDialog) {
    super(http, dialog);
    this.baseUrl = this.apiBase + `/strategy-templates`;
  }

}
