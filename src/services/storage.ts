
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param file The file to upload.
 * @param path The path where the file should be stored in the bucket (e.g., 'profile-pictures/user123.jpg').
 * @returns A promise that resolves with the public download URL of the uploaded file.
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    // Depending on your error handling strategy, you might want to throw a custom error
    // or return a specific error message.
    throw new Error('File upload failed.');
  }
}
