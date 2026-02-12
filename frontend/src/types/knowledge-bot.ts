export interface KnowledgeBotRequest {
    user_query: string;
    thread_id: string;
    metadata: {
        selected_files: string[];
    };
}

export interface KnowledgeBotResponse {
    status: string;
    response: string;
}