'use client'
import styles from "./addUser.module.css";
import { useState, useEffect, useRef  } from "react";
import axios from "axios";
import * as LR from '@uploadcare/blocks';
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
LR.registerBlocks(LR);
type Datatype = {
  uuid: "string",
  cdnUrl: "string",
  fileInfo: FileInfoType,
  originalFilename: string,
  imageUrl: string,
  cdnUrlModifiers: "string",
  allEntries: "string",
  status: string
};
type FileInfoType = {
  originalFilename: string;
  size: number;
  imageInfo: {
    width: number;
    height: number;
  };
};
type Tdetail = {
  allEntries: string[];
  status: string;
  detail: {
    allEntries: Datatype[];
  };
};


const AddUserPage = () => {

  const router = useRouter()
 const ctxProviderRef = useRef<typeof LR.UploadCtxProvider.prototype & UploadCtxProvider>(null);
 const [files, setFiles] = useState<Datatype[]>([]);
const [uploadSuccess, setUploadSuccess] = useState(false); 

useEffect(() => {
  const ctxProvider = ctxProviderRef.current;
  if (!ctxProvider) return;

  const handleChangeEvent = (e:Tdetail) => {

    setFiles([...e.detail.allEntries.filter(f => f.status === 'success')]);
    setUploadSuccess(true);
  };

  ctxProvider.addEventListener('change', handleChangeEvent);
  return () => {
    ctxProvider.removeEventListener('change', handleChangeEvent);
  };
}, [setFiles]);

    useEffect(() => {
      if (uploadSuccess) {
        toast.success("Image uploaded successfully. You can now submit the form.")
      }
    }, [uploadSuccess]);

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    try {
      if (!uploadSuccess) {
        toast.error(" Please upload an image first.");
        return;
      }

      const formData = new FormData(e.target);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/achievement`, {
        title: formData.get("title"),
        imageUrl:(files[0]?.cdnUrl ) || "",
        description: formData.get("address"),
      },{
        withCredentials: true
      });

      if (res.status === 200) {
        toast.success("Achievement added successfully!");
       router.push("/dashboard/users");
      } else {
        toast.error("Failed to add faculty")
      }
    } catch (err) {
      console.error("Error during Achievement add request", err);
      toast.error("An error occurred. Please try again.");
    }

  };
  return (
    <div className={styles.container}>
       <h1 className={styles.heading}>Upload Acheivement </h1>
       <div className="flex flex-wrap ">
      <lr-config
        ctx-name="my-uploader"
        pubkey="760b5896368dc596ec82"
        maxLocalFileSizeBytes={5000000}
        multiple={false}
        imgOnly={true}
        sourceList="local, url, camera, gdrive"
      ></lr-config>
      <lr-file-uploader-regular
        ctx-name="my-uploader"
        css-src={`https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.33.2/web/lr-file-uploader-regular.min.css`}
        class="my-config"
      ></lr-file-uploader-regular>
      <lr-upload-ctx-provider ref={ctxProviderRef} ctx-name="my-uploader"> </lr-upload-ctx-provider>
      <h1 className="ml-36 font-bold text-2xl">Achievement image needed to be under 1000x650 px</h1>
      </div>

      <div className={styles.previews} >
        {files.map((file:Datatype) => (
          <div key={file.uuid}>
            <img
              className={styles.previewImage}
              key={file.uuid}
              src={`${file.cdnUrl}/-/preview/-/scale_crop/984x600/center/`}
              width="200"
              height="200"
              alt={file.fileInfo.originalFilename  || ''}
              title={file.fileInfo.originalFilename || ''}
            />
            <span className={styles.previewTitle} >
             FileName: {file.fileInfo.originalFilename}&nbsp;&nbsp;&nbsp; Filesize:&nbsp;{formatSize(file.fileInfo.size)}&nbsp;&nbsp;&nbsp; Dimensions:&nbsp;{file.cdnUrlModifiers && file.cdnUrlModifiers.split('/')[2]?`${file.cdnUrlModifiers.split('/')[2]}PX`: `${file.fileInfo.imageInfo.width}X${file.fileInfo.imageInfo.height} PX`}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" placeholder="title" name="title" required />
        <textarea
          name="address"
          id="address"
          placeholder="Description"
          maxLength={200}
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddUserPage;


function formatSize(bytes:number) {
  if (!bytes) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}
