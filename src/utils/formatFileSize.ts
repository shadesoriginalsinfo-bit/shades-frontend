export const formatFileSize = (size: number) =>
  size > 1024 * 1024
    ? `${(size / (1024 * 1024)).toFixed(2)} MB`
    : `${(size / 1024).toFixed(0)} KB`;
