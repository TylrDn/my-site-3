/**
 * Public configuration for connecting the site to a Langflow deployment.
 * Only include values that are safe to expose on the client.
 */
window.langflowConfig = {
  /**
   * Base URL of the Langflow deployment that exposes the REST API.
   * Example: "http://localhost:7860" or a hosted URL.
   */
  baseUrl: "https://your-langflow-host",

  /**
   * ID of the flow to execute. This is included in REST calls to Langflow.
   */
  flowId: "replace-with-flow-id",

  /**
   * Optional path prefix for the run endpoint if your deployment uses one.
   */
  apiPath: "/api/v1/run",

  /**
   * Public headers to send with each request. Do NOT place secrets here; use
   * server-side middleware if you need to sign requests with an API token.
   */
  defaultHeaders: {
    "Content-Type": "application/json"
  }
};
