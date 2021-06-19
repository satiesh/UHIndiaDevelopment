import * as pbi from 'powerbi-client';
import { environment } from 'src/environments/environment';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
declare var powerbi: any;

@Component({
  selector: 'app-report-control',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})

export class ReportComponent implements OnInit {
  @ViewChild('embeddedReport')
  embeddedReport: ElementRef;
  config: any;
  screenHeight: number;
  isLoading: boolean = true;
  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.screenHeight = (window.screen.height);
    this.httpClient.get<any>("https://uhazurerestapi.azurewebsites.net/api/token/GetPowerBIAccessToken/27a2b5f4-e69c-4611-a985-aec0761e9146/9de38435-f745-44da-b6a3-35d4f63c906d")
      .subscribe(config => {
        this.config = config;
        const filter = {
          $schema: "http://powerbi.com/product/schema#basic",
          target: {
            table: "Invoked Function",
            column: "GroupName"
          },
          operator: "eq",
          values: ["SILVER MEMBERS"]
        };
        const model = pbi.models;// window['powerbi-client'].models;
        const embedConfig = {
          type: 'report',
          tokenType: model.TokenType.Embed,
          accessToken: config.token,
          embedUrl: config.embedUrl,
          permissions: model.Permissions.All,
          filters: [filter],
          settings: {
            filterPaneEnabled: true,
            navContentPaneEnabled: true
          }
        };
        this.isLoading = false;
        powerbi.embed(this.embeddedReport.nativeElement, embedConfig);
      });
  }
}
