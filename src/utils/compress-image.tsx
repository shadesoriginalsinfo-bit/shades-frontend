import imageCompression from "browser-image-compression";

export const compressImageClient = async (file: File) => {
    
    const options = {
      maxSizeMB: 1, // try to target ~1MB 
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      fileType:  file.type || "image/jpeg",
      // onProgress: (p: number) => console.log("compress progress", p)
    };

    // `imageCompression` returns a Blob (or File)
    const compressedBlob = await imageCompression(file, options);
    const compressedFile = new File([compressedBlob], file.name || "image", { type: file.type || "image/jpeg" });
    return compressedFile;
  };

  // compress and convert to jpeg
  export const compressAndConvert = async (file: File) => {

    const options = {
      maxSizeMB: 1.5,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      fileType: "image/jpeg",
    };

    const compressedBlob = await imageCompression(file, options);
   
    const newName = (file.name || "image").replace(/\.[^.]+$/, "") + ".jpg";
    const compressedFile = new File([compressedBlob], newName, { type: "image/jpeg" });
    return compressedFile;
  };