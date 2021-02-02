const db = require("./db.js");

const inquirer = require("inquirer");
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
function quit(list) {
  printTasks(list);
}
function markAsDown(list, index) {
  list[index].status = true;
  console.log("已完成");
  db.write(list);
  printTasks(list);
}
function markAsUndown(list, index) {
  list[index].status = false;
  console.log("未完成");
  db.write(list);
  printTasks(list);
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
      console.log("修改成功");
      db.write(list);
      printTasks(list);
    });
}
function remove(list, index) {
  list.splice(index, 1);
  console.log("删除成功");
  db.write(list);
  printTasks(list);
}
// askForCreateTask
function askForCreateTask(list) {
  inquirer
    .prompt({
      type: "input",
      name: "name",
      message: "输入任务",
    })
    .then((answer) => {
      list.push({
        name: answer.name,
        status: false,
      });
      console.log("添加成功");
      db.write(list);
      // -------
      printTasks(list);
      // ----------------------
    });
}
// askForActions
function askForActions(list, index) {
  const actions = {
    quit,
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
        { name: "修改任务", value: "updateName" },
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
        message: "选择操作",
        choices: [
          { name: "退出", value: "-1" },
          ...list.map((task, index) => {
            return {
              name: `${task.status ? "[X]" : "[_]"}${index + 1}-${task.name}`,
              value: index.toString(),
            };
          }),
          { name: "添加", value: "-2" },
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
