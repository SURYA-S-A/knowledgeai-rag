import { apiPost } from "../lib/apiClient";
import { KnowledgeBotRequest, KnowledgeBotResponse } from "@/types/knowledge-bot";

const KNOWLEDGE_BOT_UPLOAD_DOCS_API_URL = process.env.NEXT_PUBLIC_KNOWLEDGE_BOT_UPLOAD_DOCS_API_URL as string;
const KNOWLEDGE_BOT_INVOKE_GRAPH_API_URL = process.env.NEXT_PUBLIC_KNOWLEDGE_BOT_INVOKE_GRAPH_API_URL as string;

export const sendKnowledgeBotMessage = async (payload: KnowledgeBotRequest): Promise<KnowledgeBotResponse> => {
  const response = await apiPost(KNOWLEDGE_BOT_INVOKE_GRAPH_API_URL, payload);
  const data = await response.json() as KnowledgeBotResponse;
  return data;
};

// For FormData-based file upload
export const sendKnowledgeBotUploadFiles = async (conversationId: string, files: File[]): Promise<KnowledgeBotResponse> => {
  const formData = new FormData();
  formData.append("collection_name", conversationId);
  files.forEach(file => formData.append("files", file));
  formData.append("file_paths", "");

  const response = await fetch(KNOWLEDGE_BOT_UPLOAD_DOCS_API_URL, {
    method: "POST",
    body: formData,
  });

  const data = await response.json() as KnowledgeBotResponse;
  return data;
};
