from knowledgeai_rag_api.services.embeddings_manager import EmbeddingsManager
from knowledgeai_rag_api.services.file_processor import FileProcessor
from knowledgeai_rag_api.services.knowledge_bot_app import KnowledgeBotApp
from knowledgeai_rag_api.services.llm_manager import LLMManager
from knowledgeai_rag_api.services.rag_pipeline import RAGPipeline
from knowledgeai_rag_api.services.knowledge_bot_tools import KnowledgeTools
from knowledgeai_rag_api.services.vector_store_manager import VectorStoreManager


file_processor = FileProcessor()
embeddings_manager = EmbeddingsManager()
vector_store_manager = VectorStoreManager(embeddings=embeddings_manager.embeddings)
llm_manager = LLMManager()
rag_pipeline = RAGPipeline(
    llm_manager=llm_manager, vector_store_manager=vector_store_manager
)
KnowledgeTools.set_rag_pipeline(rag_pipeline)
knowledge_bot_app = KnowledgeBotApp(llm_manager=llm_manager)
