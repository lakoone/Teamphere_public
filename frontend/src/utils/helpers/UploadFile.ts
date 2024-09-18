import {getStorage, ref, uploadBytes} from 'firebase/storage';

export async function UploadFile(file:File,id:string){
  const storage = getStorage();
  const storageRef = ref(storage, id);
  await uploadBytes(storageRef,file)
  return true
}