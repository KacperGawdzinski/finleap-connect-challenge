const MOCKED_DATA_PATH = './src/mockedApi/mockedData';

export const BANK_TO_MOCK_PATH_MAP = new Map<string, string>([
  ['revolut', `${MOCKED_DATA_PATH}/revolut-tx.json`],
  ['monzo', `${MOCKED_DATA_PATH}/monzo-tx.json`],
  ['sterling', `${MOCKED_DATA_PATH}/sterling-tx.json`],
]);
