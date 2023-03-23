import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase";
import { Notification } from "./Notification";

export const Notifications = () => {
  const { currentUser } = useContext(AuthContext);
  const [not, setNot] = useState([]);
  useEffect(() => {
    const getNotifications = async () => {
      const nots = await getDocs(
        query(
          collection(db, "users", currentUser.uid, "notifications"),
          orderBy("timestamp", "desc")
        )
      );
      if (nots.empty === true) {
        return;
      }
      let notList = [];
      nots.forEach(
        (not) => (
          console.log(not.data()),
          notList.push({ id: not.id, data: not.data() }),
          setNot(notList)
        )
      );
      nots.forEach((not) =>
        updateDoc(not.ref, {
          state: "read",
        })
      );
    };
    getNotifications();
  }, [currentUser.uid]);
  return (
    <div className="post notifications">
      <div className="post-header">Notifications</div>
      {not.map((not) => (
        <Notification key={not.id} not={not.data} />
      ))}
    </div>
  );
};
