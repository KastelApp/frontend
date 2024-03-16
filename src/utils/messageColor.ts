const getMessageColor = (state: "sent" | "deleted" | "sending" | "failed" = "sent") => {

    const theme = localStorage.getItem("chakra-ui-color-mode");

    if (state === "sending") return "gray";
    if (state === "sent") return theme === "light" ? "black" : "white";
    if (state === "failed") return "red";

    return "gray"
};

export default getMessageColor;