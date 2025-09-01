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

export async function downloadFile(url, filename) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("파일을 불러올 수 없습니다.");

        // Blob 변환
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        // <a> 태그를 동적으로 생성해 클릭
        const link = document.createElement("a");
        link.href = objectUrl;

        // 파일명 없을 경우 URL에서 자동 추출
        link.download = filename || url.split("/").pop() || "download";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 메모리 해제
        URL.revokeObjectURL(objectUrl);
    } catch (error) {
        // console.error(error);
        alert("file download failed");
    }
}
