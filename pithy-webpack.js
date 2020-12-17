const fs = require("fs");
const path = require("path");
const {parse} = require("@babel/parser"); //转换
const traverse = require("@babel/traverse").default; //遍历
const babel = require("@babel/core");//核心

let ID = 0;

// 读取内容并提取它的依赖关系
function createAsset(filename) {
  // 以字符串的形式读取文件
  const content = fs.readFileSync(filename, "utf-8");
  // 转换字符串为ast抽象语法树
  const ast = parse(content, {
    sourceType: "module"
  });

  const dependencies = [];

  // 遍历抽象语法树
  traverse(ast, {
    // 每当遍历到import语法的时候
    ImportDeclaration: ({ node }) => {
      // 把依赖的模块加入到数组中
      dependencies.push(node.source.value);
    }
  });

  const id = ID++;

  // 转换为浏览器可运行的代码
  const { code } = babel.transformFromAstSync(ast, null, {
    presets: ["@babel/preset-env"]
  });

  return {
    id,
    filename,
    dependencies,
    code
  };
}

// 从入口开始 分析依赖 生成依赖图 深度遍历
function createGraph(filename){
    let module = createAsset(filename);
//    深度遍历子节点生成依赖图
   //定义保存依赖项的队列
   let queue = [module];
   for(let asset of queue){
    // 相对定位地址
    const dirname = path.dirname(asset.filename)
    //定义保存子依赖项的属性
    asset.mapping={}
    //遍历子依赖项
    asset.dependencies.forEach(relativePath=>{
        //儿子的path 和 父亲的id 是对应关系
        const absolutePath = path.join(dirname,relativePath)
        //创建子依赖项  会不断地创建依赖
        const child = createAsset(absolutePath)
        // 把子依赖项赋给父亲  建立父子关系 上下级
        asset.mapping[path] = child.id
       queue.push(child)
    })
   }
   let modules = {};
   queue.forEach((item) => {
     modules[item.id] = item.code;
   });
   return modules;
}
let modules = createGraph("./index.js");
console.log(modules)
// 4. 执行模块
const exec = function (moduleId) {
  const fn = modules[moduleId];
  let exports = {};
  const require = function (filename) {
    const dirname = path.dirname(module.id);
    const absolutePath = path.join(dirname, filename);
    return exec(absolutePath);
  };
  fn(require, exports);
  return exports;
};
// 5. 写入文件
function createBundle(modules){
    let __modules = "";
    for (let attr in modules) {
      __modules += `"${attr}":${modules[attr]},`;
    }
    const result = `(function(){
      const modules = {${__modules}};
      const exec = function (moduleId) {
        const fn = modules[moduleId];
        let exports = {};
        const require = function (filename) {
          const dirname = path.dirname(module.id);
          const absolutePath = path.join(dirname, filename);
          return exec(absolutePath);
        };
        fn(require, exports);
        return exports;
      };
      exec("./index.js");
    })()`;
    fs.writeFileSync("./dist/bundle3.js", result);
  }
  
  createBundle(modules);