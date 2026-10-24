import { Client } from "@gradio/client";

async function main() {
  try {
    console.log("Connecting to mrfakename/E2-F5-TTS on Hugging Face...");
    const client = await Client.connect("mrfakename/E2-F5-TTS");
    console.log("Connected successfully!");
    const apiInfo = await client.view_api();
    console.log("API endpoints:", JSON.stringify(apiInfo, null, 2));
  } catch (err) {
    console.error("Connection error:", err);
  }
}

main();
