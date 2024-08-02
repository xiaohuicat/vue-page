import { downloadFileByData, downloadFileByUrl } from "./utils";

// 跳转页面
function goToUrl(url){
  if(url == "" || url == "#" || url == undefined){
    return
  }else if(url.indexOf('[hard]')>-1){
    url = url.replace('[hard]','');
    document.location.href = url;
  }else{
    if(this?.router){
      this.router.push({path:url});
    } else {
      document.location.href = url;
    }
  }
}

// 复制文本
async function copyText (text){
  try {
    await navigator.clipboard.writeText(text);
    this?.msg&&this.msg.showMsg('复制成功','success');
    /* Resolved - 文本被成功复制到剪贴板 */
  } catch (err) {
    /* Rejected - 文本未被复制到剪贴板 */
    let result = await navigator.permissions.query({ name: "write-on-clipboard" })
    if (result.state == "granted" || result.state == "prompt") {
      this?.msg&&this.msg.showMsg('没有权限','fail');
    } else {
      this?.msg&&this.msg.showMsg('复制失败','fail');
    }
  }
}


export default {
  downloadFileByData,
  downloadFileByUrl,
  copyText,
  goToUrl,
}