<template lang="pug">
._codeWrap
    div(style="text-align:right")
        //- .copy(v-if='cpy_btn' @click="copy")
            span.copyMsg Copy code
            svg(height="16" width="16" style="margin-left: 5px;")
                use(xlink:href="@/assets/img/material-icon.svg#icon-file-copy-fill")          
        button.inline.icon-text.gray.btn-copy(v-if='cpy_btn' @click="copy")
            .icon
                svg
                    use(xlink:href="@/assets/img/material-icon.svg#icon-copy")            
            span.copyMsg Copy
    .code
        slot

</template>

<script setup>
let props = defineProps(["hidecopy"]);
let cpy_btn = !props.hidecopy;

let copy = (e) => {
    let allcopy = document.querySelectorAll(".copyMsg");
    for (let i = 0; i < allcopy.length; i++) {
        allcopy[i].textContent = "Copy";
    }
    let code =
        e.currentTarget.parentElement.nextElementSibling.querySelector(
            ".code > pre"
        );
    let doc = document.createElement("textarea");
    doc.textContent = code.textContent;
    document.body.append(doc);
    doc.select();
    document.execCommand("copy");
    doc.remove();

    // let copyMsg = e.currentTarget.querySelector('.copyMsg');
    // copyMsg.textContent = 'Copied!';

    let copyMsg = document.getElementById("copy-msg");
    copyMsg.textContent = "The code copied!";
    copyMsg.classList.add("show");

    setTimeout(() => {
        // copyMsg.textContent = 'Copy code';
        copyMsg.classList.remove("show");
    }, 2000);
};
</script>

<style lang="less">
._codeWrap {
    position: relative;
    margin-top: 8px;

    .btn-copy {
        position: absolute;
        // bottom: 22px;
        bottom: 18px;
        right: 18px;
        // background-color: #1E1E20;
        // padding: 9px 14px;
        // border: 1px solid rgba(255, 255, 255, 0.1);
        // border-radius: 7px;
        // // display: inline-block;
        // text-align: right;
        // font-size: 15px;
        // font-weight: 400;
        // cursor: pointer;

        // svg {
        //     fill: #fff;
        // }
    }

    .copyMsg {
        vertical-align: middle;
    }

    .code {
        // background: var(--black-8);
        margin-top: 8px;
        border-radius: 6px;
        box-shadow: 2px 2px 3px 0px rgba(0, 0, 0, 0.15);
        color: #fff;
        overflow-x: auto;
        background: #121214;

        pre {
            font-family: "Space Mono", monospace;
            // display: flex;
            align-items: center;
            font-size: 16px;
            margin: 0;
            padding: 28px 0 68px 32px;
            // padding: 28px 0 28px 32px;
            min-height: 44px;
        }
    }
}
</style>
