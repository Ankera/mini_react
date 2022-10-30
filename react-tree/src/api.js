const Koa = require('koa');
const koaStatic = require('koa-static');
const { koaBody } = require('koa-body');
const path = require('path');
const fs = require('fs');

const app = new Koa();

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method === 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }
});

app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.resolve(__dirname, 'uploads'),
    maxFileSize: 200 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
  }
}))

app.use(koaStatic(path.resolve(__dirname, 'uploads')));

app.use(async (ctx, next) => {
  if (ctx.url === '/upload') {
    const file = ctx.request.files.file;
    const filename = file.originalFilename;
    fs.renameSync(file.filepath, path.join(path.dirname(file.filepath), filename));
    ctx.body = {
      url: `http://localhost:8181/${filename}`
    }
  } else {
    await next();
  }
});

app.listen(8181, () => {
  console.log('8181 server success');
});