'use client'
import Image from "next/image";
import Link from "next/link";
 import styles from "./faculty.module.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
//import { useRouter } from "next/navigation";


type Datatype = {
  _id: string;
  fullname: string;
  post: string;
  degree: string;
  imageUrl: string;
  createdAt: Date;
};

const ProductsPage = () => {
  const [data, setData] = useState([]);
 // const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty`,{
          credentials: 'include'
        });
        const data = await response.json();
        setData(data);
        // console.log(data);
      } catch (error) {
        toast.error("Failed to fetch faculty!!");
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id:Datatype)=>{
    // e.preventDefault();

    try {
      const responseDelete = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/${id}`, {
      method : "DELETE",
      credentials: 'include'
    })
    toast.success("Faculty Deleted!!");

    if (!responseDelete.ok) {
      // throw new Error("error");
      toast.error("Failed to fetch faculty!!");
    }
  //  router.push("/dashboard/faculty")
    
    } catch (error) {
      // console.log(error);
      toast.error("Failed to fetch faculty!!");
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
          {data.map((item:Datatype) => (
            <tr key={item._id}>
              <td>
                <div className={styles.product}>
                  <img
                    src={item.imageUrl || "/noproduct.jpg"}
                    className={styles.productImage}
                  ></img>
                  {item.fullname}
                </div>
              </td>
              <td>{item.post}</td>
              <td>{item.degree}</td>
              <td>{item.createdAt?.toLocaleString().slice(0, 10)}</td>
              <td>
                <div className={styles.buttons}>
                  {/* <Link href={''}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link> */}
                  <form >
                    <input value={item._id} className="text-black" type="hidden" name="id" />
                    <button onClick={()=>{
                      handleDelete(item._id as any) 
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
