import { FileText } from "lucide-react";

interface FileUploadSectionProps {
    selectedFiles: File[];
    setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
    isUploading: boolean;
    uploadFiles: () => Promise<void>;
}

export default function FileUploadSection({
    selectedFiles,
    setSelectedFiles,
    isUploading,
    uploadFiles,
}: FileUploadSectionProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const clearAllFiles = () => {
        setSelectedFiles([]);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="mt-3 space-y-3">
            {/* File Selection Area */}
            <div className="flex items-center gap-2">
                <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload-input"
                    disabled={isUploading}
                />
                <label
                    htmlFor="file-upload-input"
                    className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${isUploading
                        ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
                        }`}
                >
                    <FileText size={16} />
                    Choose Files
                </label>

                {selectedFiles.length > 0 && (
                    <>
                        <button
                            className="px-3 py-2 text-sm font-medium bg-primary hover:bg-secondary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            onClick={uploadFiles}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Uploading...
                                </span>
                            ) : (
                                `Upload ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}`
                            )}
                        </button>

                        <button
                            className="px-3 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 transition-colors"
                            onClick={clearAllFiles}
                            disabled={isUploading}
                        >
                            Clear All
                        </button>
                    </>
                )}
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 max-h-32 overflow-y-auto">
                    <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-white dark:bg-gray-700 p-2 rounded-md shadow-sm">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <FileText size={14} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                                {!isUploading && (
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0"
                                        title="Remove file"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Status */}
            {isUploading && (
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Uploading files to document collection...
                </div>
            )}
        </div>
    );
};