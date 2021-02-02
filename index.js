const db = require("./db.js");

const inquirer = require("inquirer");
const { action } = require("commander");
module.exports.add = async (name) => {
  //读
  const list = await db.read();
  //写
  list.push({ name, status: false });
  //存
  await db.write(list);
};

module.exports.clear = async (name) => {
  await db.write([]);
};

module.exports.showAll = async () => {
  const list = await db.read();
  printTasks(list);
};
function markAsDown(list, index) {
  list[index].status = true;
  db.write(list);
}
function markAsUndown(list, index) {
  list[index].status = false;
  db.write(list);
}
function updateName(list, index) {
  inquirer
    .prompt({
      type: "input",
      name: "name",
      message: "新标题",
      default: list[index].name,
    })
    .then((answer) => {
      list[index].name = answer.name;
      db.write(list);
    });
}
function remove(list, index) {
  list.splice(index, 1);
  db.write(list);
}
// askForCreateTask
function askForCreateTask(list) {
  inquirer
    .prompt({
      type: "input",
      name: "name",
      message: "输入任务标题",
    })
    .then((answer) => {
      list.push({
        name: answer.name,
        status: false,
      });
      db.write(list);
    });
}
// askForActions
function askForActions(list, index) {
  const actions = {
    markAsDown,
    markAsUndown,
    updateName,
    remove,
  };
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "请选择操作",
      choices: [
        { name: "退出", value: "quit" },
        { name: "已完成", value: "markAsDown" },
        { name: "未完成", value: "markAsUndown" },
        { name: "改标题", value: "updateName" },
        { name: "删除", value: "remove" },
      ],
    })
    .then((answer2) => {
      const action = actions[answer2.action];
      action && action(list, index);
    });
}
// printTasks
function printTasks(list) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "index",
        message: "选择你要操作的任务",
        choices: [
          { name: "退出", value: "-1" },
          ...list.map((task, index) => {
            return {
              name: `${task.status ? "[X]" : "[_]"}${index + 1}-${task.name}`,
              value: index.toString(),
            };
          }),
          { name: "添加任务", value: "-2" },
        ],
      },
    ])
    .then((answer) => {
      const index = parseInt(answer.index);
      if (index >= 0) {
        askForActions(list, index);
      } else if (index === -2) {
        askForCreateTask(list);
      }
    });
}
