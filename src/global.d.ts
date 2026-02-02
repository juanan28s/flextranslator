/**
 * global.d.ts
 * 
 * GLOBAL TYPE DEFINITIONS
 * Extends standard Web API interfaces that are either non-standard (webkit prefixes)
 * or part of newer specifications not yet in the default TypeScript DOM library.
 */

export {};

declare global {
  interface Window {
    /** Legacy WebKit-prefixed AudioContext for older iOS/Safari support. */
    webkitAudioContext: typeof AudioContext;
    
    /** 
     * File System Access API: showSaveFilePicker 
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/showSaveFilePicker
     */
    showSaveFilePicker?: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
  }

  /** Options for the File System Access API showSaveFilePicker method. */
  interface SaveFilePickerOptions {
    suggestedName?: string;
    types?: Array<{
      description?: string;
      accept: Record<string, string[]>;
    }>;
    excludeAcceptAllOption?: boolean;
    id?: string;
    startIn?: 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos' | FileSystemHandle;
  }
}
