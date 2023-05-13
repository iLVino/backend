import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, catchError, map, throwError } from 'rxjs';
import axios from 'axios';

const CONTRACT_API_URL =
  'https://api.gopluslabs.io/api/v1/token_security/1?contract_addresses=0x6982508145454ce325ddbe47a25d4ec3d2311933';

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


async function getChatResponse(message: string): Promise<string> {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const apiKey = 'YOUR_API_KEY'; // Replace with your OpenAI API key

  try {
    const response = await axios.post(apiUrl, {
      prompt: message,
      max_tokens: 50, // Adjust the response length as needed
      temperature: 0.6, // Adjust the temperature to control randomness
      n: 1, // Number of responses to generate
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const chatResult = response.data.choices[0].text.trim();
    return chatResult;
  } catch (error) {
    console.error('Error making the API call:', error);
    throw error;
  }
}

// Example usage
async function main() {
  const message = "Hello, how are you?";
  const response = await getChatResponse(message);
  console.log('ChatGPT response:', response);
}

main();