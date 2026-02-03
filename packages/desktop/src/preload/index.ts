import { contextBridge, ipcRenderer } from "electron";
import type {
  ConversionConfig,
  ConversionProgress,
  ElectronAPI,
} from "../types";

const electronAPI: ElectronAPI = {
  // Conversion
  convertFiles: (files: string[], config: ConversionConfig) =>
    ipcRenderer.invoke("convert-files", files, config),

  // File dialogs
  selectFiles: () => ipcRenderer.invoke("select-files"),
  selectOutputDir: () => ipcRenderer.invoke("select-output-dir"),

  // Events
  onConversionProgress: (callback: (progress: ConversionProgress) => void) => {
    const handler = (
      _event: Electron.IpcRendererEvent,
      progress: ConversionProgress,
    ): void => {
      callback(progress);
    };
    ipcRenderer.on("conversion-progress", handler);
    return () => {
      ipcRenderer.removeListener("conversion-progress", handler);
    };
  },
};

contextBridge.exposeInMainWorld("electron", electronAPI);
