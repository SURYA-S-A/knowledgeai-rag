"use client";

import { BotLoadingScreen } from "@/components/BotLoadingScreen";
import KnowledgeBotChatActionBar from "@/app/bot/knowledge/_components/KnowledgeBotChatActionBar";
import ChatBotTitleBar from "@/components/ChatBotTitleBar";
import ChatWindow from "@/components/ChatWindow";
import { ChatMessage } from "@/types/chat-message";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";


async function loadConversationHistory(threadId: string): Promise<ChatMessage[]> {
    try {
        return [];
        // const response = await fetch(`/api/conversations/${threadId}`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        // });

        // if (response.ok) {
        //     const data = await response.json();
        //     return data.messages || [];
        // } else if (response.status === 404) {
        //     // Conversation doesn't exist yet - that's fine for new conversations
        //     console.log(`Conversation ${threadId} not found - starting fresh`);
        //     return [];
        // } else {
        //     throw new Error(`Failed to load conversation: ${response.statusText}`);
        // }
    } catch (error) {
        console.error('Error loading conversation history:', error);
        // Return empty array on error - don't break the chat
        return [];
    }
}

export default function KnowledgeChatBot() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [isStartingNewChat, setIsStartingNewChat] = useState(false);

    const threadId = useRef<string>("");

    // Load existing conversation messages
    const loadConversation = useCallback(async (convId: string) => {
        setIsLoadingHistory(true);
        try {
            const existingMessages = await loadConversationHistory(convId);
            setMessages(existingMessages);
            console.log(`Loaded ${existingMessages.length} messages for conversation ${convId}`);
        } catch (error) {
            console.error('Failed to load conversation:', error);
            // Start with empty messages on error
            setMessages([]);
        } finally {
            setIsLoadingHistory(false);
        }
    }, []);

    // Initialize conversation ID and load history
    const initializeConversation = useCallback(async () => {
        const existingId = searchParams.get("threadId");

        if (existingId) {
            // Use existing ID from URL and load its history
            threadId.current = existingId;
            await loadConversation(existingId);
        } else {
            // Generate new ID and update URL (no history to load)
            const newId = crypto.randomUUID?.() ||
                Math.random().toString(36).substring(2, 15);
            threadId.current = newId;

            // Update URL without causing a page reload
            const params = new URLSearchParams(searchParams.toString());
            params.set("threadId", newId);
            router.replace(`?${params.toString()}`, { scroll: false });

            // New conversation starts with empty messages
            setMessages([]);
        }

        setIsInitialized(true);
    }, [searchParams, router, loadConversation]);

    // Start a new chat
    const startNewChat = useCallback(async () => {
        setIsStartingNewChat(true);

        try {
            // Generate new conversation ID
            const newId = crypto.randomUUID?.() ||
                Math.random().toString(36).substring(2, 15);

            // Update conversation ID
            threadId.current = newId;

            // Clear messages immediately for instant feedback
            setMessages([]);

            // Update URL
            const params = new URLSearchParams();
            params.set("conversationId", newId);
            router.replace(`?${params.toString()}`, { scroll: false });

            console.log(`Started new conversation: ${newId}`);
        } catch (error) {
            console.error('Error starting new chat:', error);
            // If there's an error, we already cleared messages, so user gets a fresh start anyway
        } finally {
            setIsStartingNewChat(false);
        }
    }, [router]);


    useEffect(() => {
        if (!threadId.current) {
            initializeConversation();
        }
    }, [initializeConversation]);

    if (!isInitialized || isLoadingHistory) {
        return <BotLoadingScreen />;
    }

    if (!threadId.current) {
        return <BotLoadingScreen />;
    }

    return (
        <div className="fixed inset-0 flex flex-col bg-gray-50 dark:bg-gray-900">
            <ChatBotTitleBar title="Jarvis - AI Knowledge Bot" subtitle="Knowledge Support Bot" onNewChat={startNewChat} isStartingNewChat={isStartingNewChat} isBotTyping={isBotTyping} />
            <ChatWindow messages={messages} botName="Jarvis" chatWindowPlaceholder="Upload the document and ask queries regarding document!" isBotTyping={isBotTyping} />
            <KnowledgeBotChatActionBar threadId={threadId} setMessages={setMessages} setIsBotTyping={setIsBotTyping} isBotTyping={isBotTyping} inputPlaceholder="Ask queries related to documents once you uploaded..." messages={messages} />
        </div>
    );
};