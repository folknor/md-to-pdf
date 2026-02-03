import type { Theme } from "@mdforge/core/browser";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import type {
  ConversionConfig,
  ConversionProgress,
  ConversionResult,
} from "../types";
import ConfigPanel from "./components/ConfigPanel";
import DropZone from "./components/DropZone";
import FileList from "./components/FileList";

declare global {
  interface Window {
    electron: import("../types").ElectronAPI;
  }
}

interface FileItem {
  path: string;
  name: string;
  status: "pending" | "converting" | "done" | "error";
  progress: number;
  error?: string;
}

export default function App(): React.ReactElement {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [outputDir, setOutputDir] = useState<string>("");
  const [theme, setTheme] = useState<Theme>("beryl");
  const [fontPairing, setFontPairing] = useState("beryl");
  const [author, setAuthor] = useState("");
  const [isConverting, setIsConverting] = useState(false);

  // Listen for conversion progress
  useEffect(() => {
    const unsubscribe = window.electron.onConversionProgress(
      (progress: ConversionProgress) => {
        setFiles((prev) =>
          prev.map((f) =>
            f.path === progress.file
              ? {
                  ...f,
                  status: progress.progress === 100 ? "done" : "converting",
                  progress: progress.progress,
                }
              : f,
          ),
        );
      },
    );
    return unsubscribe;
  }, []);

  const handleFilesAdded = useCallback((paths: string[]) => {
    const newFiles: FileItem[] = paths.map((path) => ({
      path,
      name: path.split(/[/\\]/).pop() ?? path,
      status: "pending",
      progress: 0,
    }));
    setFiles((prev) => {
      const existingPaths = new Set(prev.map((f) => f.path));
      const unique = newFiles.filter((f) => !existingPaths.has(f.path));
      return [...prev, ...unique];
    });
  }, []);

  const handleSelectOutputDir = async (): Promise<void> => {
    const dir = await window.electron.selectOutputDir();
    if (dir) {
      setOutputDir(dir);
    }
  };

  const handleConvert = async (): Promise<void> => {
    if (files.length === 0 || !outputDir) return;

    setIsConverting(true);
    setFiles((prev) =>
      prev.map((f) => ({ ...f, status: "converting" as const, progress: 0 })),
    );

    const config: ConversionConfig = {
      theme,
      fontPairing,
      author: author || undefined,
      outputDir,
    };

    const results = await window.electron.convertFiles(
      files.map((f) => f.path),
      config,
    );

    setFiles((prev) =>
      prev.map((f) => {
        const result = results.find(
          (r: ConversionResult) => r.inputPath === f.path,
        );
        if (result) {
          return {
            ...f,
            status: result.success ? "done" : "error",
            progress: 100,
            error: result.error,
          };
        }
        return f;
      }),
    );

    setIsConverting(false);
  };

  const handleRemoveFile = (path: string): void => {
    setFiles((prev) => prev.filter((f) => f.path !== path));
  };

  const handleClearFiles = (): void => {
    setFiles([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <DropZone onFilesAdded={handleFilesAdded} />

        {files.length > 0 && (
          <FileList
            files={files}
            onRemove={handleRemoveFile}
            onClear={handleClearFiles}
          />
        )}

        <ConfigPanel
          theme={theme}
          fontPairing={fontPairing}
          author={author}
          onThemeChange={setTheme}
          onFontPairingChange={setFontPairing}
          onAuthorChange={setAuthor}
        />

        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleSelectOutputDir}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              Output Folder
            </button>
            <span className="text-sm text-gray-600 truncate flex-1">
              {outputDir || "No output folder selected"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleConvert}
          disabled={files.length === 0 || !outputDir || isConverting}
          className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg font-semibold
                     hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                     transition-colors"
        >
          {isConverting ? "Converting..." : "Generate PDFs"}
        </button>
      </div>
    </div>
  );
}
