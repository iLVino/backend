import { Controller, Get } from '@nestjs/common';
import { AppService, Contract } from './app.service';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Observable<Contract> {
    return this.appService.getContractInformation();
  }
}