import React, { useRef } from "react";
import { Send, Download, FileText } from "lucide-react";
import { ChatMessage } from "@/types/chat-message";
import { exportChatAsTXT } from "@/utils/chatUtils";
import { getCurrentDatetime } from "@/utils/dateUtils";
import { sendKnowledgeBotMessage, sendKnowledgeBotUploadFiles } from "@/services/knowledgeBotService";
import FileUploadSection from "./FileUploadSection";

interface KnowledgeBotChatActionBarProps {
  threadId: React.RefObject<string | "">;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setIsBotTyping: React.Dispatch<React.SetStateAction<boolean>>;
  isBotTyping: boolean;
  inputPlaceholder: string;
  messages: ChatMessage[];
}

export default function KnowledgeBotChatActionBar({
  threadId,
  setMessages,
  setIsBotTyping,
  isBotTyping,
  inputPlaceholder,
  messages,
}: KnowledgeBotChatActionBarProps) {

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);

  // Add these state variables after your existing useState declarations:
  const [uploadedDocuments, setUploadedDocuments] = React.useState<Array<{ name: string, filename: string, uploaded: boolean }>>([]);
  const [selectedDocuments, setSelectedDocuments] = React.useState<Array<{ name: string, filename: string, uploaded: boolean }>>([]);
  const [showDocumentSelector, setShowDocumentSelector] = React.useState(false);

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);

    try {
      const data = await sendKnowledgeBotUploadFiles(threadId.current, selectedFiles);
      console.log("Upload successful:", data);

      // Add uploaded files to the document list
      const newDocs = selectedFiles.map(file => ({
        name: file.name,
        filename: file.name.replace(/\.[^/.]+$/, "").toLowerCase().replace(/\s+/g, "_"),
        uploaded: true,
      }));

      setUploadedDocuments(prev => [...prev, ...newDocs]);
      setSelectedFiles([]);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Add these helper functions:
  const toggleDocumentSelection = (document: { name: string, filename: string, uploaded: boolean }) => {
    setSelectedDocuments(prev => {
      const isSelected = prev.some(doc => doc.filename === document.filename);
      if (isSelected) {
        return prev.filter(doc => doc.filename !== document.filename);
      } else {
        return [...prev, document];
      }
    });
  };

  const selectAllDocuments = () => {
    setSelectedDocuments([...uploadedDocuments]);
  };

  const clearDocumentSelection = () => {
    setSelectedDocuments([]);
  };

  const sendBotMessage = async (messageText: string) => {

    const data = await sendKnowledgeBotMessage({
      user_query: messageText,
      thread_id: threadId.current,
        metadata: {
          selected_files: selectedDocuments.map(doc => doc.filename)
        }
    });

    const botMessage: ChatMessage = { sender: "bot", text: data.response, timestamp: getCurrentDatetime() };
    setMessages(prev => [...prev, botMessage]);

    return data;
  };

  const sendMessage = async () => {
    const messageText = inputRef.current?.value.trim();

    if (!messageText) return;

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    const timestamp = getCurrentDatetime();

    const newMessage: ChatMessage = { sender: "user", text: messageText, timestamp: timestamp };
    setMessages(prev => [...prev, newMessage]);
    setIsBotTyping(true);
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    try {
      await sendBotMessage(messageText);
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Error fetching reply. Please try again.", timestamp: getCurrentDatetime() },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendButtonClick();
    }
  };

  const handleSendButtonClick = async () => {
    await sendMessage();
  };


  const adjustHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"; // Reset to calculate correct height
      const newHeight = inputRef.current.scrollHeight;
      const maxHeight = 150; // Set a max height limit (adjust as needed)

      if (newHeight > maxHeight) {
        inputRef.current.style.height = `${maxHeight}px`; // Set max height
        inputRef.current.style.overflowY = "auto"; // Enable vertical scrollbar
      } else {
        inputRef.current.style.height = `${newHeight}px`; // Expand normally
        inputRef.current.style.overflowY = "hidden"; // Hide scrollbar if below max height
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800">
      <div className="px-4 pb-4 max-w-4xl mx-auto">
        {/* Document Upload Section - Moved to Top */}
        <div className="mb-4">
          <FileUploadSection
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            isUploading={isUploading}
            uploadFiles={uploadFiles}
          />

          {/* Uploaded Documents Selection */}
          {uploadedDocuments.length > 0 && (
            <div className="mt-3 bg-white dark:bg-gray-700 rounded-2xl shadow-md border border-gray-200 dark:border-gray-600 p-4">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setShowDocumentSelector(!showDocumentSelector)}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2"
                >
                  <FileText size={16} />
                  Select Documents ({selectedDocuments.length}/{uploadedDocuments.length})
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllDocuments}
                    className="text-xs px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 font-medium"
                    disabled={uploadedDocuments.length === 0}
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearDocumentSelection}
                    className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {showDocumentSelector && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                  {uploadedDocuments.map((doc, index) => (
                    <div
                      key={index}
                      onClick={() => toggleDocumentSelection(doc)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 text-sm ${selectedDocuments.some(selected => selected.filename === doc.filename)
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${selectedDocuments.some(selected => selected.filename === doc.filename)
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-400 dark:border-gray-500'
                          }`}>
                          {selectedDocuments.some(selected => selected.filename === doc.filename) && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M9 1L3.5 6.5L1 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <FileText size={14} className="text-gray-500 dark:text-gray-400" />
                        <span className="truncate text-gray-700 dark:text-gray-300 font-medium">{doc.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedDocuments.length > 0 && (
                <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                    📄 Selected for querying: {selectedDocuments.map(doc => doc.name).join(', ')}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-md border border-gray-200 dark:border-gray-600 p-1">
          <div className="flex items-end gap-3">
            <textarea
              className="text-base w-full p-3 pr-12 rounded-xl resize-none focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
              placeholder={inputPlaceholder}
              ref={inputRef}
              onKeyDown={handleKeyDown}
              disabled={isBotTyping}
              onInput={adjustHeight}
              rows={1}
            />
          </div>
          <div className="p-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">

                <button
                  className="p-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
                  onClick={() => exportChatAsTXT(messages, threadId.current)}
                  title="Download chat as TXT"
                >
                  <Download size={18} />
                </button>
              </div>

              <button
                onClick={handleSendButtonClick}
                disabled={isBotTyping}
                className="p-2 bg-primary text-white hover:bg-secondary rounded-lg disabled:opacity-50"
                title="Send"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
