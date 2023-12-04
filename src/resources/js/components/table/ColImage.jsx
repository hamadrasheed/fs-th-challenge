import classNames from "classnames";
import React from "react";
import messageStore from "../../store/messageStore";
import Tooltip from "../Tooltip";

function ColImage({
  width = "w-48",
  className = "rounded-md cursor-pointer group hover:border hover:border-dashed hover:border-primary-50",
  imageUrl,
}) {

  const {setPreviewImage} = messageStore((state) => state);

  const previewImage = () => {
    setPreviewImage({ showModal: true, url: imageUrl });
  };

  return (
    <td
      className={classNames(
        "px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap",
        {
          [width]: width,
        }
      )}
    >
      <div className={className} onClick={previewImage}>
        <Tooltip content="Preview Image">
          <img
            className="object-cover w-full h-full rounded-md group-hover:p-[2px]"
            src={imageUrl}
            alt="picture"
          />
        </Tooltip>
      </div>
    </td>
  );
}

export default ColImage;
