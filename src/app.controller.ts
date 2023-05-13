import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService, Contract } from './app.service';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { ContractInformation } from './models/ContractInfo.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Observable<Contract> {
    return this.appService.getContractInformation();
  
  }

  @Post('Processdata')
  getContractInformation() {
    const data = this.appService.getContractInformation(); //todo pipe this
    return this.appService.getOpenAiResponse(data);
  }
}
