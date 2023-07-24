import { Injectable } from '@nestjs/common';
import nock from 'nock';
import { promises } from 'fs';

@Injectable()
export class ExternalApis {
  isProd = process.env.NODE_ENV === 'production';

  get revolutApiUrl() {
    return this.isProd
      ? 'http://official-production/api/revolut'
      : 'http://mocked-banks/api/revolut';
  }

  get monzoApiUrl() {
    return this.isProd
      ? 'http://official-production/api/monzo'
      : 'http://mocked-banks/api/monzo';
  }

  get sterlingApiUrl() {
    return this.isProd
      ? 'http://official-production/api/sterling'
      : 'http://mocked-banks/api/sterling';
  }

  serveMockedApi = async () => {
    if (!this.isProd) {
      for (const [bank, path] of BANK_TO_MOCK_PATH_MAP) {
        const data = await promises.readFile(path);
        const parsedJSON = JSON.parse(data.toString());

        nock('http://mocked-banks')
          .get(`/api/${bank}`)
          .times(Infinity)
          .reply(200, parsedJSON);
      }
    }
  };
}

const MOCKED_DATA_PATH = './src/bank-services/external-apis/mocked-data';

const BANK_TO_MOCK_PATH_MAP = new Map<string, string>([
  ['revolut', `${MOCKED_DATA_PATH}/revolut-tx.json`],
  ['monzo', `${MOCKED_DATA_PATH}/monzo-tx.json`],
  ['sterling', `${MOCKED_DATA_PATH}/sterling-tx.json`],
]);
