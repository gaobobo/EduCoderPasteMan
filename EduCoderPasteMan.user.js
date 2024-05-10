// ==UserScript==
// @name         头歌复制粘贴
// @name:en      EduCoder Freedom Paste
// @description  用于解除头歌的关卡的复制粘贴。本脚本默认只在公网上启用，如要在私网/校内网启用，请手动编辑脚本，脚本内附有编辑说明。
// @description  Copy and paste for unlocking the level of the EduCoder. This script is only enabled on the public network EduCoder by default. If you want to enable it on the private network/school network EduCoder, please edit the script manually. Editing instructions are included in the script.
// @namespace    https://bbs.tampermonkey.net.cn/
// @source       https://github.com/gaobobo/EduCoderPasteMan
// @version      2.0.0-alpha
// @author       Gao Shibo, Lydia
// @match        https://www.educoder.net/*
// @match        https://vpn.zcst.edu.cn/*
// @match        https://tg.zcst.edu.cn/*
// @license        MIT
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant      GM_setValue
// @grant      GM_getValue
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

    let flyoutMessageHTML = document.createElement("div");

    if (document.getElementById("alersContainer") === null) {
        flyoutMessageHTML.id = "alersContainer";
        flyoutMessageHTML.style.position = "fixed";
        flyoutMessageHTML.style.top = "8px";
        flyoutMessageHTML.style.width = "100%";
        flyoutMessageHTML.style.zIndex = "9999";
        flyoutMessageHTML.style.margin = "10px auto";
        flyoutMessageHTML.style.alignItems = "center";
        flyoutMessageHTML.style.display = "flex";
        flyoutMessageHTML.style.flexDirection = "column";
    } else {
        flyoutMessageHTML = document.getElementById("alersContainer");
    }

    const flyoutMessageHTML_content = document.createElement("span");
    flyoutMessageHTML_content.style.margin = "5px"
    flyoutMessageHTML_content.style.padding = "9px 12px";
    flyoutMessageHTML_content.style.fontSize = "14px";
    flyoutMessageHTML_content.style.backgroundColor = "white";
    flyoutMessageHTML_content.style.borderRadius = "4px";
    flyoutMessageHTML_content.style.boxShadow = "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)";
    flyoutMessageHTML_content.style.width = "fit-content";

    flyoutMessageHTML_content.innerText = message;

    flyoutMessageHTML.appendChild(flyoutMessageHTML_content);

    document.body.appendChild(flyoutMessageHTML);

    if (showTime >= 0) { 
        setTimeout(function() {flyoutMessageHTML_content.remove();}, showTime);
    }

}

/**
 * Accelerate timer.
 * 
 * @description NOTICE: must be used before the timer is created.
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

        if (document.getElementById("monaco-editor no-user-select  showUnused showDeprecated vs-dark") !== undefined) 
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

/**
 * Initialize menu items
 * 
 */
function initializeMenu () {

    if (GM_getValue("timerRate") === undefined || GM_getValue("timerRate") === -1) {

        const menuItems = [

            GM_registerMenuCommand(
                "(beta)开启定时器加速-2X",
                function () {
                    GM_setValue("timerRate",2);
                    menuItems.forEach(GM_unregisterMenuCommand);
                    initializeMenu();
                    flyoutMessage("定时器加速已开启。刷新页面后生效。", 5000);
                }
            ),

            GM_registerMenuCommand(
                "(beta)开启定时器加速-20X",
                function () {
                    GM_setValue("timerRate",20);
                    menuItems.forEach(GM_unregisterMenuCommand);
                    initializeMenu();
                    flyoutMessage("定时器加速已开启。刷新页面后生效。", 5000);
                }
            ),

            GM_registerMenuCommand(
                "(beta)开启定时器加速-50X",
                function () {
                    GM_setValue("timerRate",50);
                    menuItems.forEach(GM_unregisterMenuCommand);
                    initializeMenu();
                    flyoutMessage("定时器加速已开启。刷新页面后生效。", 5000);
                }
            ),

            GM_registerMenuCommand(
                "(beta)开启定时器加速-500X",
                function () {
                    GM_setValue("timerRate",500);
                    menuItems.forEach(GM_unregisterMenuCommand);
                    initializeMenu();
                    flyoutMessage("定时器加速已开启。刷新页面后生效。", 5000);
                }
            ),

        ]

    } else {

        const menuItems = [
            
            GM_registerMenuCommand(
                "(beta)关闭定时器加速",
                function () {
                    GM_setValue("timerRate",-1);
                    menuItems.forEach(GM_unregisterMenuCommand);
                    initializeMenu();
                    flyoutMessage("定时器加速已关闭。刷新页面后生效。", 5000);
                }
            )

        ]
    }


}

/**
 * Main function.
 * 
 */
(function() {
    'use strict';

    initializeMenu();

    if (checkPage() !== "com.educoder.shixun.code") 
        return;

    if (GM_getValue("timerRate") !== -1) {
        timerFaster(GM_getValue("timerRate"));
        GM_setValue("timerRate", -1);

        flyoutMessage("定时器加速已开启。仅本次会话有效，刷新后将自动恢复。", 5000);
    }

    hookListener();

    let messages = [
        "✔️脚本已运行。你现在可以自由地复制粘贴了。",
        "✔️已破解头歌的复制粘贴，Enjoy It ！",
        "✔️什么垃圾edocoder，monaco写的一坨💩",
        "✔️FBI Warning⚠️⚠️⚠️! Already F***ed Educoder's ass! Damn!",
    ]

    const randomIndex = Math.floor(Math.random() * Math.random() * messages.length);
    messages = messages[randomIndex]
    flyoutMessage(messages,5000);

})();