import nock from 'nock';
import { BANK_TO_MOCK_PATH_MAP } from './config';
import { promises } from 'fs';

export const serveMockedApi = async () => {
  for (const [bank, path] of BANK_TO_MOCK_PATH_MAP) {
    const data = await promises.readFile(path);
    const parsedJSON = JSON.parse(data.toString());

    nock('http://mocked-banks')
      .get(`/api/${bank}`)
      .times(Infinity)
      .reply(200, parsedJSON);
  }
};
