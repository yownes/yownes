import React, {
  useState,
  useEffect,
  useRef,
  ReactNode,
  RefObject,
} from "react";
import { Button, Popconfirm } from "antd";
import {
  DeleteOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import styles from "./FileUpload.module.css";

type ImageUploadProps = {
  value?: string | Blob | null;
  onChange?: (value: string | Blob) => void;
  onDeleteClicked: () => void;
  size?: "large" | undefined;
  alt?: string;
  uploadMessage?: string;
  confirmMessage?: string;
  deleteTitle?: string;
};

type UploadButtonProps = {
  loading: boolean;
  children: ReactNode;
};

type FilePreview = {
  loading: boolean;
  file?: string | ArrayBuffer | null;
};

function reset(ref: RefObject<HTMLInputElement>) {
  if (ref.current) {
    ref.current.value = "";
  }
}

const UploadButton = ({ loading, children }: UploadButtonProps) => (
  <>
    {loading ? <LoadingOutlined /> : <UploadOutlined />}
    <div className="ant-upload-text">{children}</div>
  </>
);

const ImageUpload = ({
  value: file,
  onChange,
  onDeleteClicked,
  size,
  alt,
  uploadMessage,
  confirmMessage,
}: ImageUploadProps) => {
  const { t } = useTranslation(["translation", "client"]);
  const [filePreview, setFilePreview] = useState<FilePreview>({
    loading: false,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadElement = useRef<HTMLLabelElement>(null);
  const fileToPreview = (file: Blob) => {
    const reader = new FileReader();
    setFilePreview({
      ...filePreview,
      loading: true,
    });
    reader.onloadend = () => {
      setFilePreview({
        loading: false,
        file: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (file && typeof file !== "string") {
      fileToPreview(file);
    } else if (file && typeof file === "string") {
      setFilePreview({ loading: false, file });
    } else {
      setFilePreview({ loading: false, file: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);
  return (
    <>
      <div>
        <input
          type="file"
          accept="image/png"
          onChange={({ target: { validity, files } }) => {
            if (files && validity.valid) {
              const [file] = Array.from(files);
              onChange?.(file);
            }
          }}
          hidden
          id="fileupload"
          ref={inputRef}
        />
        <label
          ref={uploadElement}
          className={`${styles.upload} ${
            size === "large" && styles.uploadLarge
          }`}
          htmlFor="fileupload"
          onDragOver={(ev) => ev.preventDefault()}
          onDragEnter={() => {
            if (uploadElement.current) {
              uploadElement.current.style.borderColor = "#a8a8a8";
            }
          }}
          onDragLeave={() => {
            if (uploadElement.current) {
              uploadElement.current.style.borderColor = "#d7d7d7";
            }
          }}
          onDrop={(ev) => {
            ev.preventDefault();
            if (ev.dataTransfer.items) {
              // Use DataTransferItemList interface to access the file(s)
              for (let i = 0; i < ev.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them
                if (ev.dataTransfer.items[i].kind === "file") {
                  const file = ev.dataTransfer.items[i].getAsFile();
                  if (file) {
                    onChange?.(file);
                  }
                }
              }
            } else {
              // Use DataTransfer interface to access the file(s)
              for (let i = 0; i < ev.dataTransfer.files.length; i++) {
                const file = ev.dataTransfer.files[i];
                onChange?.(file);
              }
            }
          }}
        >
          {file ? (
            <img
              src={filePreview.file as string}
              alt={alt ? alt : t("logo")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <UploadButton loading={filePreview.loading}>
              {uploadMessage ? uploadMessage : t("uploadLogo")}
            </UploadButton>
          )}
        </label>
        {file && (
          <Popconfirm
            cancelText={t("cancel")}
            okText={t("delete")}
            title={confirmMessage ? confirmMessage : t("client:warnings.logo")}
            onConfirm={() => {
              onDeleteClicked();
              reset(inputRef);
            }}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        )}
      </div>
    </>
  );
};

export default ImageUpload;
