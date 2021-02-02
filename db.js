// 获取到home目录
const homedir = require("os").homedir();
// 获取到home变量，优先使用home变量，因为home变量可能是用户自己设置的
const home = process.env.HOME || homedir;

const path = require("path");
const fs = require("fs");
// 拼接数据库路径
const dbPath = path.join(home, ".todo");
const db = {
  read(path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(dbPath, { flag: "a+" }, (error, data) => {
        if (error) {
          return error;
        } else {
          let list;
          try {
            list = JSON.parse(data.toString());
          } catch (error2) {
            list = [];
          }
          resolve(list);
        }
      });
    });
  },
  write(list, path = dbPath) {
    return new Promise((resolve, reject) => {
      //   console.log(list);
      const string = JSON.stringify(list);
      //   console.log(string);
      fs.writeFile(path, string, (error) => {
        if (error) {
          return reject(error);
        } else {
          resolve();
        }
      });
    });
  },
};

module.exports = db;
