'use client'
import Image from "next/image";
import Link from "next/link";
 import styles from "./faculty.module.css";
// import Search from "@/app/ui/dashboard/search/search";
//import Pagination from "@/app/ui/dashboard/pagination/pagination";
import { useEffect, useState } from "react";
//import { useRouter } from "next/navigation";

const ProductsPage = () => {
  const [data, setData] = useState([]);
 // const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://auth-akgu-backend.vercel.app/faculty');
        const data = await response.json();
        setData(data);
        // console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id:any)=>{
    // e.preventDefault();

    try {
      const responseDelete = await fetch(`https://auth-akgu-backend.vercel.app/faculty/${id}`, {
      method : "DELETE",
    })

    if (!responseDelete.ok) {
      throw new Error("error");
    }
  //  router.push("/dashboard/faculty")
    
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Link href="/dashboard/faculty/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>POST</td>
            <td>Degree</td>
            <td>Created At</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {data.map((item:any) => (
            <tr key={item._id}>
              <td>
                <div className={styles.product}>
                  <Image
                    src={item.imageUrl || "/noproduct.jpg"}
                    alt=""
                    width={40}
                    height={40}
                    className={styles.productImage}
                  />
                  {item.fullname}
                </div>
              </td>
              <td>{item.post}</td>
              <td>${item.degree}</td>
              <td>{item.createdAt?.toString().slice(4, 16)}</td>
              <td>
                <div className={styles.buttons}>
                  <Link href={''}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
                  <form >
                    <input value={item._id} className="text-black" type="hidden" name="id" />
                    <button onClick={()=>{
                      handleDelete(item._id)
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

export default ProductsPage;
