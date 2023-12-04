import React, { useEffect, useState } from "react";
import messageStore from "../store/messageStore";

function MessageDefault() {
  const [timeout, setTimeOut] = useState();

  const { setMessage } = messageStore((state) => state);

  useEffect(() => {
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  const comingSoon = () => {
    setTimeOut(
      setTimeout(() => {
        setMessage({
          showModal: true,
          data: {
            title: "COMING SOON!",
            subtitle: "soon we will be able to access it...",
            status: "warning",
          },
        });
        clearTimeout(timeout);
      }, 250)
    );
  };
  return {
    comingSoon,
  };
}

export default MessageDefault;
