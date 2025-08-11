let copyTimer = null; // 타이머 저장용 변수

export let copy = (text) => {
    let doc = document.createElement("textarea");
    doc.textContent = text;
    document.body.append(doc);
    doc.select();
    document.execCommand("copy");
    doc.remove();

    let copyMsg = document.getElementById("copy-msg");

    // 기존 타이머가 있으면 클리어
    if (copyTimer) {
        clearTimeout(copyTimer);
    }

    // 기존 show 클래스 제거 (애니메이션 초기화)
    copyMsg.classList.remove("show");

    // 100ms 지연 후 다시 show 클래스 추가 (애니메이션이 보이도록)
    setTimeout(() => {
        copyMsg.textContent = "Copy completed!";
        copyMsg.classList.add("show");

        // 새로운 타이머 설정
        copyTimer = setTimeout(() => {
            copyMsg.classList.remove("show");
            copyTimer = null;
        }, 2000);
    }, 100); // 100ms 지연 추가
};
