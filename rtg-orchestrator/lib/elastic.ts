// lib/elastic.ts

/**
 * Sends a prompt to an Elastic Agent and parses the JSON response.
 * @param agentId - The ID of the agent (e.g., 'sentinel-x-triage')
 * @param input - The payload (can be a string or object)
 */
export async function askAgent(agentId: string, input: any) {
  const kibanaUrl = process.env.KIBANA_URL;
  const apiKey = process.env.API_KEY;

  if (!kibanaUrl || !apiKey) {
    throw new Error("Missing Elastic credentials in .env.local");
  }

  // The Agent Builder 'converse' endpoint is the programmatic way to chat
  const endpoint = `${kibanaUrl}/api/agent_builder/converse`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "kbn-xsrf": "true", // Required for Kibana security
      "Authorization": `ApiKey ${apiKey}`,
    },
    body: JSON.stringify({
      input: typeof input === "string" ? input : JSON.stringify(input),
      agent_id: agentId,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Elastic Agent API Error [${response.status}]: ${err}`);
  }

  const data = await response.json();

  /**
   * ELastic Agent Builder returns the message nested in response.message.
   * We need to strip out any LLM markdown ticks (```json ... ```)
   */
  let rawContent = data.response?.message || data.message || "";
  
  // Clean markdown and whitespace
  const cleanedContent = rawContent
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleanedContent);
  } catch (e) {
    console.error("Failed to parse Agent JSON. Raw output:", rawContent);
    // If it's not JSON, return it as a reasoning string for the UI
    return { reasoning: rawContent, status: "NON_JSON_RESPONSE" };
  }
}