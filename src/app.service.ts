import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, catchError, map, throwError } from 'rxjs';
import axios from 'axios';
import { error } from 'console';

const CONTRACT_API_URL = 'https://api.gopluslabs.io/api/v1/token_security/1?contract_addresses=0x6982508145454ce325ddbe47a25d4ec3d2311933';

const OpenAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const PromptAI = 'You are a crypto token security auditor and you are capable of breaking down complex inputs into simple explanation text . You will receive a json file which contains a report about a smart contract and you will point out the red flags. Based on this you create a score between 0 and 100 at the beginning of the conversation, where 100 is the safest and best possible result. Structure it in a best readable way, separate it into good and bad functions. Use headlines for each section and explain the critical points in a simple readable language. You are also capable of receiving further questions about this contract and answer those for the user. Always end a conversation with a call to action question to the user to keep him engaged. Here is the JSON:';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  getContractInformation(): Observable<Contract> {
    return this.httpService.get(CONTRACT_API_URL).pipe(
      map((response: AxiosResponse<Contract>) => {
        return response.data;
      }),
      catchError((error: any) => {
        console.log(error);
        return throwError(error);
      }),
    );
  }
  getOpenAiResponse(data: Observable<Contract>) {
    return this.httpService.get(CONTRACT_API_URL).pipe(
      map((response: AxiosResponse<Contract>) => {
        return response.data;
      }),
      catchError((error: any) => {
        console.log(error);
        return throwError(error);
      }),
    
    async function generateText(inputText: string): Promise<string> {
      const response = await axios.post(`${OpenAI_API_URL}/engines/davinci-codex/completions`, {
        prompt: PromptAI + data,
        max_tokens: 1000,
        n: 1,
        stop: ['\n']
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OpenAI_API_URL}`
        }
      });
      return response.data.choices[0].text.trim();
    })
  }
}

interface ContractHolder {
  address: string;
  tag: string;
  is_contract: number;
  balance: string;
  percent: string;
  is_locked: number;
}

interface ContractDex {
  name: string;
  liquidity: string;
  pair: string;
}

interface ContractResult {
  anti_whale_modifiable: string;
  buy_tax: string;
  can_take_back_ownership: string;
  cannot_buy: string;
  cannot_sell_all: string;
  creator_address: string;
  creator_balance: string;
  creator_percent: string;
  dex: ContractDex[];
  external_call: string;
  hidden_owner: string;
  holder_count: string;
  holders: ContractHolder[];
  honeypot_with_same_creator: string;
  is_anti_whale: string;
  is_blacklisted: string;
  is_honeypot: string;
  is_in_dex: string;
  is_mintable: string;
  is_open_source: string;
  is_proxy: string;
  is_whitelisted: string;
  lp_holder_count: string;
  lp_holders: ContractHolder[];
}

export interface Contract {
  code: number;
  message: string;
  result: Record<string, ContractResult>;
}

