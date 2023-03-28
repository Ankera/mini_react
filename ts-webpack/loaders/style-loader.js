'use strict';
 
const path=require('path');
 
const matchRelativePath=/^\.\.?[/\\]/;//相对路径正则表达式
 
function isAbsolutePath(str) {//是否为绝对路径
    return path.posix.isAbsolute(str) || path.win32.isAbsolute(str);
    //前者为跨平台 后者为windows 判断是否为绝对路径
}
 
function isRelativePath(str) {//是否是相对路径 是返回true 否则返回false
    return matchRelativePath.test(str);
}
 
function stringifyRequest(loaderContext, request) {
    const splitted = request.split('!');//分割!
    const context =
      loaderContext.context ||
      (loaderContext.options && loaderContext.options.context);//获取内容
  
    return JSON.stringify(
      splitted
        .map((part) => {
          // First, separate singlePath from query, because the query might contain paths again
          const splittedPart = part.match(/^(.*?)(\?.*)/);
          const query = splittedPart ? splittedPart[2] : '';
          let singlePath = splittedPart ? splittedPart[1] : part;
  
          if (isAbsolutePath(singlePath) && context) {
            singlePath = path.relative(context, singlePath);
  
            if (isAbsolutePath(singlePath)) {
              // If singlePath still matches an absolute path, singlePath was on a different drive than context.
              // In this case, we leave the path platform-specific without replacing any separators.
              // @see https://github.com/webpack/loader-utils/pull/14
              return singlePath + query;
            }
  
            if (isRelativePath(singlePath) === false) {
              // Ensure that the relative path starts at least with ./ otherwise it would be a request into the modules directory (like node_modules).
              singlePath = './' + singlePath;
            }
          }
  
          return singlePath.replace(/\\/g, '/') + query;
        })
        .join('!')
    );
}



function styleLoader(css){
  // console.log('================================',css);
  // const style = `

  //   var style = document.createElement('style');

  //   style.innerHTML = ${JSON.stringify(css)};

  //   document.head.appendChild(style)
  // `;

  // return style;
  // return '{color: red}'
}

const loaderUtils = require('loader-utils');

styleLoader.pitch = function(a, b) {
  // const lu = loaderUtils.urlToRequest(this, "!!" + a);
  // console.log('====', lu)
  const lu = JSON.stringify(
    this.utils.contextify(this.context, "!!" + a)
  )
  
  // !! 防止死循环
  const style = `
    var style = document.createElement('style');

    style.innerHTML = require(${lu})

    document.head.appendChild(style)
  `;

  console.log('=11=------==', lu, style)
  return style;
}

module.exports = styleLoader;