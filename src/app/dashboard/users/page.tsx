'use client'
// import Search from "@/app/ui/dashboard/search/search";
import styles from "./users.module.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";


const UsersPage =  () => {

  const router = useRouter();
  const [data, setData] = useState([]);

   useEffect(()=>{
       const fetchAchievements = async ()=>{
        try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/achievements`,{
          credentials: 'include'
        });
        const data = await response.json();
        setData(data);
        console.log(data);
      } catch (error) {
      // console.log(error)
      toast.error("Failed to fetch achievement!!");
    }
  };
    fetchAchievements();
   },[])


   const handleDelete = async (id:any)=>{
    // e.preventDefault();

    try {
      const responseDelete = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/achievement/${id}`, {
      method : "DELETE",
      credentials: 'include'
    })

    if (!responseDelete.ok) {
      throw new Error("error");
    }
    router.push("/dashboard/users")
    
    } catch (error) {
      console.log(error);
    }
  }
  

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Link href="/dashboard/users/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Title</td>
            <td>Description</td>
            <td>Image</td>
            <td>Created At</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {data.map((user:any) => (
            <tr key={user._id}>
              <td>
                <div className={styles.user}>
                  <Image
                    src={user.imageUrl || "/noavatar.png"}
                    alt=""
                    width={40}
                    height={40}
                    className={styles.userImage}
                  />
                  {user.username}
                </div>
              </td>
              <td>{user.title}</td>
              <td>{user.description}</td>
              <td>{user.createdAt?.toString().slice(4, 16)}</td>
              <td>
                <div className={styles.buttons}>
                    <Link href={`/dashboard/users/${user._id}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                    </Link>
                  <form >
                    <input value={user._id} type="hidden" name="id"  />
                    <button onClick={()=>{
                      handleDelete(user._id)
                    }} className={`${styles.button} ${styles.delete}`}>
                      Delete
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <Pagination count={count} /> */}
    </div>
  );
};

export default UsersPage;
