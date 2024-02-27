"use client"
import Image from "next/image";
import MenuLink from "./menuLinks/MenuLinks";
import styles from "./sidebar.module.css";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdLogout,
} from "react-icons/md";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

const menuItems = [
  {
    title: "Pages",
    list: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <MdDashboard />,
      },
      {
        title: "Achievement",
        path: "/dashboard/users",
        icon: <MdSupervisedUserCircle />,
      },
      {
        title: "Faculty",
        path: "/dashboard/faculty",
        icon: <MdShoppingBag />,
      },
    ],
  },
];

const Sidebar = () => {
  const router = useRouter()

  const handleLogout = async (event:any)=>{
    event.preventDefault();
    try {
      const res = await fetch (`${process.env.NEXT_PUBLIC_API_URL}/admin/logout`,{
      method:"GET",
      credentials:"include"
      // headers:{
      //   "Content-Type":"application/json"
      // },
    })

    if (res.ok) {
      Cookies.remove('status');
      router.push("/admin/login");
      console.log("logout sucessfully");
    } else {
      throw new Error('Logout was not successful');
    }
    }
     catch (error) {
      console.log(error)
    }

  }

  

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <Image
          className={styles.userImage}
          src={"/noavatar.png"}
          alt=""
          width="50"
          height="50"
        />
        <div className={styles.userDetail}>
          <span className={styles.username}>username</span>
          <span className={styles.userTitle}>Administrator</span>
        </div>
      </div>
      <ul className={styles.list}>
        {menuItems.map((cat:any) => (
          <li key={cat.title}>
            <span className={styles.cat}>{cat.title}</span>
            {cat.list.map((item:any) => (
              <MenuLink item={item} key={item.title} />
            ))}
          </li>
        ))}
      </ul>
      {/* <form
        onSubmit={handleLogin}
      >
        <button className={styles.logout} >
          <MdLogin />
          <h3>Login</h3>
        </button>
      </form> */}
      <form
        onSubmit={handleLogout}
      >
        <button className={styles.logout} >
          <MdLogout />
          <h3>Logout</h3>
        </button>
      </form>
    </div>
  );
};

export default Sidebar;
