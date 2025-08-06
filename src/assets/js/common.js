export let copy = (text) => {
    let doc = document.createElement("textarea");
    doc.textContent = text;
    document.body.append(doc);
    doc.select();
    document.execCommand("copy");
    doc.remove();

    let copyMsg = document.getElementById("copy-msg");
    copyMsg.textContent = "Copy completed!";
    copyMsg.classList.add("show");

    setTimeout(() => {
        copyMsg.classList.remove("show");
    }, 2000);
};
