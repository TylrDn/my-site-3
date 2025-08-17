export const DEFAULT_PORT = 4173;
const parsedPort = Number(process.env.PORT);
export const PORT = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : DEFAULT_PORT;
