import { Api } from 'figma-api';

const token = process.env.FIGMA_TOKEN!;

export const api = new Api({
  personalAccessToken: token,
});
