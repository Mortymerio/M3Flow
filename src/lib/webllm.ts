import { MLCEngine, CreateMLCEngine } from "@mlc-ai/web-llm";
import { useStore } from "../store";

// Global singleton to prevent double-loading during React strict-mode or remounts
let globalEngine: MLCEngine | null = null;
let isInitializing = false;

// We use the lightest available model in MLC ecosystem (Qwen2.5 0.5B parameters, quantized to 4-bit)
const MODEL_ID = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";

export async function initWebLlm() {
  if (globalEngine) return globalEngine;
  if (isInitializing) return null; // Avoid racing conditions
  
  if (!(navigator as any).gpu) {
    console.error("WebGPU is not supported in this environment");
    useStore.getState().setWebLlmState({ 
        webLlmStatusText: "Error: WebGPU Not Supported on this machine.",
        isWebLlmLoaded: false 
    });
    return null;
  }

  isInitializing = true;
  useStore.getState().setWebLlmState({ 
      webLlmStatusText: "Initializing WebLLM Engine...",
      webLlmProgress: 0,
      isWebLlmLoaded: false
  });

  try {
    const initProgressCallback = (initProgress: import("@mlc-ai/web-llm").InitProgressReport) => {
        const percentage = Math.round(initProgress.progress * 100);
        useStore.getState().setWebLlmState({ 
            webLlmProgress: percentage,
            webLlmStatusText: initProgress.text
        });
    };

    // Check if user has set a custom model mirror URL (e.g. GitHub)
    const customModelUrl = useStore.getState().webLlmModelUrl;
    
    let engineConfig: any = { initProgressCallback };
    
    if (customModelUrl && customModelUrl.trim()) {
      // Override model source with user's custom URL (GitHub mirror, etc.)
      engineConfig.appConfig = {
        model_list: [
          {
            model: customModelUrl.trim(),
            model_id: MODEL_ID,
            model_lib:
              "https://raw.githubusercontent.com/niceduckdev/web-llm-assets/main/wasm/Qwen2.5-0.5B-Instruct-q4f16_1-MLC/Qwen2.5-0.5B-Instruct-q4f16_1-MLC-webgpu.wasm",
          },
        ],
      };
    }

    globalEngine = await CreateMLCEngine(
      MODEL_ID,
      engineConfig
    );
    
    useStore.getState().setWebLlmState({ 
        isWebLlmLoaded: true,
        webLlmProgress: 100,
        webLlmStatusText: "Model Loaded Successfully."
    });

  } catch (err: any) {
    console.error("Failed to load WebLLM:", err);
    useStore.getState().setWebLlmState({ 
        webLlmStatusText: `Error: ${err.message}`,
        isWebLlmLoaded: false 
    });
    globalEngine = null;
  } finally {
    isInitializing = false;
  }

  return globalEngine;
}

export function getEngine() {
    return globalEngine;
}
