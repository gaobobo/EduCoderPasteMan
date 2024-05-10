// ==UserScript==
// @name         头歌复制粘贴
// @name:en      EduCoder Freedom Paste
// @description  用于解除头歌的关卡的复制粘贴。本脚本默认只在公网上启用，如要在私网/校内网启用，请手动编辑脚本，脚本内附有编辑说明。
// @description  Copy and paste for unlocking the level of the EduCoder. This script is only enabled on the public network EduCoder by default. If you want to enable it on the private network/school network EduCoder, please edit the script manually. Editing instructions are included in the script.
// @namespace    https://bbs.tampermonkey.net.cn/
// @source       https://github.com/gaobobo/EduCoderPasteMan
// @version      1.0.5
// @author       Gao Shibo, Lydia
// @match        https://www.educoder.net/*
// @match        https://vpn.zcst.edu.cn/*
// @match        https://tg.zcst.edu.cn/*
// @license        MIT
// ==/UserScript==

// 按照第10行格式添加匹配的网址，使用*代替变化的部分。
// 例如第12行表示所有https://tg.zcst.edu.cn/XXXXXX的网址。
// 将其添加到第10行的@match下即可。

/**
 * Pop up a flyout.
 * 
 * @param {String} message Message Content.
 * @param {int} showTime Show time(ms). -1 never close.
 */
function flyoutMessage (message, showTime) {

    const insetAlertHTML = '<div id="alersContainer" class="ant-message ant-message-top css-13xy8lc" style="left: 50%; transform: translateX(-50%); top: 8px;"><div class="ant-message-notice ant-message-notice-warning css-13xy8lc"><div class="ant-message-notice-content"><div class="ant-message-custom-content ant-message-warning"><span role="img" aria-label="exclamation-circle" class="anticon anticon-exclamation-circle"><svg viewBox="64 64 896 896" focusable="false" data-icon="exclamation-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"></path></svg></span><span>'+ message +'</span></div></div></div></div>';

    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = insetAlertHTML;
    document.body.appendChild(tempDiv.firstChild);

    const alersContainer = document.getElementById("alersContainer");

    if (showTime >= 0) { 
    setTimeout(function() {alersContainer.remove();}, showTime);
    }
}

/**
 * Accelerate timer.
 * 
 * @param {int} rate Timer acceleration rate. 0 stop Timer.
 */
function timerFaster (rate) {
    let hookSetInterval = window.setInterval;

    unsafeWindow.setInterval=function(a,b){
        return hookSetInterval(a,rate === 0 ? 0 : b/rate);
    }
}


/**
 * Hook listeners to remove copy and paste restrictions.
 * 
 */
function hookListener () {
    const Listener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener=function (...args){
        if (args.length != 0 && args[0] === "keydown" && args[1].name === "checkPaste") {
            return null;
        } else if (args.length != 0 && args[0] === "paste" && args[1].name === "checkPaste") {
            return null;
        }
        else {
            Listener.call(this,...args);
        }

    }
}

/**
 * Check current page type.
 * 
 * @returns {String} Return current page type, like "com.educoder.shixun.code". Return "com" for unknow page.
 */
function checkPage () {

    if (document.getElementById("educoder") !== null) {

        if (document.getElementById("monica-content-root") !== undefined) 
            return "com.educoder.shixun.code";
        else if (document.getElementsByClassName("vnc-panel animated fadeIn").length > 0) 
            return "com.educoder.shixun.linux"
        else if (document.getElementsByClassName("xterm-screen").length > 0) 
            return "com.educoder.shixun.terminal"
        else
            return "com.educoder";

    } else 
        return "com";

}

(function() {
    'use strict';

    if (checkPage() !== "com.educoder.shixun.code") 
        return;

    hookListener();

    // 一些可爱的msg
    const messages = [
        "脚本已运行。你现在可以自由地复制粘贴了。",
        "什么垃圾edocoder，monaco写的一坨💩",
        "已破解头歌的复制粘贴，Enjoy It ！",
        "FBI Warning⚠️⚠️⚠️! Already F***ed Educoder's ass! Damn!",
    ]

    // ramdom取index
    const randomIndex = Math.floor(Math.random() * Math.random() * messages.length);
    const message = messages[randomIndex]   // 拿出一些美妙语言
    flyoutMessage(message,5000);

})();