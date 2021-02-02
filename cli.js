#!/usr/bin/env node
// 引入api
const api = require("./index.js");

// 引入commander
const { program } = require("commander");
const pkg = require("./package.json");

program.version(pkg.version);
// 实现add子命令
program
  .command("add <taskName...>")
  .description("add a task")
  .action((args) => {
    let task = args.join(" ");
    api.add(task).then(
      () => {
        console.log("添加成功");
      },
      () => {
        console.log("添加失败");
      }
    );
  });
// 实现clear子命令
program
  .command("clear")
  .description("clear all tasks")
  .action(() => {
    api.clear().then(
      () => {
        console.log("清空成功");
      },
      () => {
        console.log("清空失败");
      }
    );
  });
// console.log(process.argv);
// 如果直接执行node cli.js，直接弹出主界面，进行增改
if (process.argv.length === 2) {
  // 说明用户直接运行node cli.js
  api.showAll();
} else {
  program.parse(process.argv); //执行会打印出所有相关的options或command
}
