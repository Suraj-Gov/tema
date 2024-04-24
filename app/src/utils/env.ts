const get = (key: string) => process.env[key];

export const env = {
  SERVER_BASE_URL: get("http://localhost:4000") as string,
};
