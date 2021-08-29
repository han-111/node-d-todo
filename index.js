const homedir = require('os').homedir()
const db = require('./db')
const home = process.env.Home || homedir
const fs = require('fs')
const path = require('path')
const dbPath = path.join(home, '.list')
const inquirer = require('inquirer')

module.exports.add = async (title) => {
    //读取之前的任务
    const list = await db.read()
    //添加一个新的任务
    list.push({ title: title, done: false })
    //存储文件
    await db.write(list)
    //以上为代码优化后的
    // fs.readFile(dbPath, { flat: 'a+' }, (error, data) => {
    //     if (error) { console.log(error) } else {
    //         let list
    //         try {
    //             list = JSON.parse(data.toString())
    //         } catch (error) {
    //             list = []
    //         }
    //         const task = {
    //             title: title,
    //             done: false
    //         }
    //         list.push(task)
    //         const string = JSON.stringify(list)
    //         fs.writeFile(dbPath, string + '\n', (error3) => {
    //             if (error3) { console.log(error3) }
    //         })
    //         console.log(list)
    //     }

    // })

}
module.exports.clear = async (title) => {
    const list = []
    await db.write(list)
    console.log(list)
}
module.exports.showAll = async () => {
    const list = await db.read()
    // list.forEach((task, index) => {
    //     console.log(`${task.done ? '[_]' : '[x]'} ${index + 1}--${task.title}`)
    // });
    inquirer.prompt({
        type: 'list',
        name: 'index',
        message: '请选择你想操作的任务',
        choices: [{ name: '退出', value: '-1' }, ...list.map((task, index) => {
            return { name: `${task.done ? '[_]' : '[x]'} ${index + 1}--${task.title}`, value: index.toString() }
        }), { name: '+创建任务', value: '-2' }]
    }).then(answer => {
        const index = parseInt(answer.index)
        if (index >= 0) {
            //选中了一个任务
            inquirer.prompt({
                type: 'list', name: 'action', message: '请选择操作',
                choices: [
                    { name: '退出', value: 'quit' },
                    { name: '已完成', value: 'markAsDone' },
                    { name: '未完成', value: 'markAsUndone' },
                    { name: '改标题', value: 'updateTitle' },
                    { name: '删除', value: 'remove' },
                ]
            }).then(answer2 => {
                switch (answer2.action) {
                    case 'markAsDone':
                        list[index].done = true
                        db.write(list)
                        break
                    case 'markAsUndone':
                        list[index].done = false
                        db.write(list)
                        break
                    case 'remove':
                        list.splice(index, 1)
                        db.write(list)
                        break
                    case 'updateTitle':
                        inquirer.prompt({
                            type: 'input', name: 'title', message: '新的标题',
                            default: list[index].title

                        }).then(answer3 => {
                            list[index].title = answer3.title
                            db.write(list)
                        })
                        break
                    case 'quit':
                        break
                }
            })


        } else if (index === -1) {

        } else if (index === -2) {
            //创建任务
            inquirer.prompt({
                type: 'input', name: 'title', message: '输入任务标题',
            }).then(answer => {
                list.push({
                    title: answer.title,
                    done: false
                })
                db.write(list)
            })

        }
    })

}