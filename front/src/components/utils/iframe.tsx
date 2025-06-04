import { useImperativeHandle, forwardRef } from "react";

export interface IframePrintHandle {
  handlePrint: () => void;
}

interface IframePrintProps {
  base64Pdf: string;
}

const IframePrint = forwardRef<IframePrintHandle, IframePrintProps>(
  ({ base64Pdf }, ref) => {
    const handlePrint = () => {
      const iframe = document.createElement("iframe");

      iframe.style.position = "absolute";
      iframe.style.width = "0px";
      iframe.style.height = "0px";
      iframe.style.border = "none";

      // Convert base64 to blob
      const byteCharacters = atob(base64Pdf);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      iframe.src = blobUrl;
      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      };

      document.body.appendChild(iframe);
    };

    useImperativeHandle(ref, () => ({
      handlePrint,
    }));

    return null;
  }
);

export default IframePrint;
