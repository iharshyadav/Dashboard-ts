"use client"
import styles from "./addFaculty.module.css";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as LR from '@uploadcare/blocks';
import toast from "react-hot-toast";

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



const AddPage = () => {
  const [uploadSuccess, setUploadSuccess] = useState(false); // New state to track upload success
  const router = useRouter();
  const ctxProviderRef = useRef<typeof LR.UploadCtxProvider.prototype & UploadCtxProvider>(null);
  const [files, setFiles] = useState<Datatype[]>([]);

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

  //console.log(files);

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
  
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty`, {
          fullname: formData.get("fullname"),
          post: formData.get("post"),
          degree: formData.get("degree"),
          imageUrl: (files[0]?.cdnUrl ) || "",
        }, {
          withCredentials: true,
        });
  
      //  console.log("Request headers:", res.config.headers);
  
        if (res.data === "added successfully") {
          toast.success("Faculty added successfully!");
          //alert("Faculty added successfully!");
          router.push("/dashboard/faculty");
        } else {
          toast.error("Failed to add faculty")
        }
      } catch (err) {
        console.error("Error during POST request", err);
        toast.error("An error occurred. Please try again.")
      }
    };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Upload Faculty </h1>
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
      <h1 className="ml-48 font-bold text-2xl">Faculty image needed to be under 400x450 px</h1>
      </div>
      
      <div className={styles.previews} >
        {files.map((file:Datatype) => (
          <div key={file.uuid}>
            <img
              className={styles.previewImage}
              key={file.uuid}
              src={`${file.cdnUrl}/-/preview/-/scale_crop/400x450/smart_faces_objects/`}
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
      <input type="text" placeholder="title" name="fullname" required />
      <select name="post" id="post">
        <option value="general">Choose a Category</option>
        <option value="HOD">HOD</option>
        <option value="Professor">Professor</option>
        <option value="Associate Professor">Associate Professor</option>
      </select>
      <input type="text" placeholder="degree" name="degree" />
      <button type="submit">Submit Faculty</button>
    </form>
    
  </div>
  )
}

export default AddPage



function formatSize(bytes:number) {
  if (!bytes) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}