'use client';
import { useEffect, useState } from 'react';
import styles from "../users.module.css";
import { usePathname } from "next/navigation";
import Image from 'next/image';

type DataType = {
  title?: string;
  description?: string;
  imageUrl?: string;
};
const SingleUserPage = () => {
  const pathname = usePathname();
  const realpath = pathname.split("/").pop();
  // then use it like this
const [data, setData] = useState<DataType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/achievement/${realpath}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          console.error(`Error: ${response.status}`);
          return;
        }

        const achievementData = await response.json();
        setData(achievementData); 
      } catch (error) {
        console.error('Error fetching achievement:', error);
      }
    };

    fetchData();
  }, [realpath]); 

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        {data && data.imageUrl && (
          <Image alt="" width={40} height={40} src={data.imageUrl}></Image>
        )}
        {data && data.title && <h1>{data.title}</h1>}
        {data && data.description && <p>{data.description}</p>}
      </div>
      <div className={styles.formContainer}>
      </div>
    </div>
  );
};

export default SingleUserPage;
