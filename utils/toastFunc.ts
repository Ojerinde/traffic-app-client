import { toast } from "react-toastify";

export const emitToastMessage = (message: string, type: 'error' | 'success') => {

    if (type === "error") {
        return toast(message, {
            position: "top-right",
            autoClose: 10000, // Set autoClose to 10 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            style: {
                background: "#181a40",
                color: "white",
                fontSize: "1.7rem",
                fontFamily: "Poetsen One",
                letterSpacing: "0.15rem",
                lineHeight: "1.7",
                padding: "1rem",
            },
        });
    }

    return toast(message, {
        position: "top-right",
        autoClose: 10000, // Set autoClose to 10 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
            background: "#181a40",
            color: "white",
            fontSize: "1.7rem",
            fontFamily: "Poetsen One",
            letterSpacing: "0.15rem",
            lineHeight: "1.7",
            padding: "1rem",
        },
    });
};