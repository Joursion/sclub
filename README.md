# sclub
a school-club appliction using  node.js ,  run at   http://nbut.club:3000   for test

#基本功能
- 发布，查看，评论闲置/活动/问答
- 浏览职位信息
- 收藏闲置，参加活动
- 简单的消息通知功能
- 注册激活

#Install
1. cloen项目 git clone https://github.com/Joursion/sclub.git
2. 进入目录 cd sclub 
3. 安装依赖 npm install
4. 设置参数 setting the mongoose in config/default , router/sendmail.js , routes/config 等.
5. 运行测试 npm start

#Photoes
- activity page
![activity page](https://raw.githubusercontent.com/Joursion/Sclub/master/show_img/1.png)

- goods page
![goods page](https://raw.githubusercontent.com/Joursion/Sclub/master/show_img/2.png)

- question page
![question page](https://raw.githubusercontent.com/Joursion/Sclub/master/show_img/3.png)

#File tree

```
├── app.js
├── bin
├── config
│   ├── default.js
│   ├── filters.js
│   └── scheme.js
├── dest
│   ├── club.css
│   ├── reset.css
│   ├── sclub.css
│   └── st.css
├── gulpfile.js
├── lib
│   ├── activity_comment.js
│   ├── activity.js
│   ├── core.js
│   ├── good_comment.js
│   ├── good.js
│   ├── job.js
│   ├── join.js
│   ├── message.js
│   ├── question_comment.js
│   ├── question.js
│   ├── star.js
│   ├── test.js
│   ├── ug.js
│   └── user.js
├── models
│   ├── activity_comment.js
│   ├── activity.js
│   ├── good_comment.js
│   ├── good.js
│   ├── index.js
│   ├── job.js
│   ├── join.js
│   ├── message.js
│   ├── question_comment.js
│   ├── question.js
│   ├── star.js
│   ├── ug.js
│   └── user.js
├── package.json
├── README.md
├── routes
│   ├── app.js
│   ├── md5.js
│   ├── notify.js
│   ├── sendmail.js
│   └── signup.js
├── show_img
│   ├── 1.png
│   ├── 2.png
│   └── 3.png
├── test.js
├── tmp
└── view
    ├── 404.ejs
    ├── about.ejs
    ├── act.ejs
    ├── activity_create.ejs
    ├── activity_edit.ejs
    ├── activity.ejs
    ├── activity_index.ejs
    ├── ada.ejs
    ├── adas.ejs
    ├── adj.ejs
    ├── admin.ejs
    ├── adu.ejs
    ├── adug.ejs
    ├── config.js
    ├── footer.ejs
    ├── good_create.ejs
    ├── good_edit.ejs
    ├── good.ejs
    ├── good_index.ejs
    ├── header.ejs
    ├── index.ejs
    ├── job_create.ejs
    ├── job.ejs
    ├── job_index.ejs
    ├── message.ejs
    ├── partials
    │   ├── activity_detail.ejs
    │   ├── activity_list.ejs
    │   ├── activity_pagination.ejs
    │   ├── ad.ejs
    │   ├── admin.ejs
    │   ├── good_comment.ejs
    │   ├── good_detail.ejs
    │   ├── good_pagination.ejs
    │   ├── good_tag.ejs
    │   ├── job_detail.ejs
    │   ├── part_user.ejs
    │   └── question_detail.ejs
    ├── publices
    │   ├── css
    │   │   ├── reset.css
    │   │   └── sclub.css
    │   ├── jquery-1.11.2.min.js
    │   └── js
    │       └── sclub.js
    ├── putup.ejs
    ├── question_create.ejs
    ├── question.ejs
    ├── question_index.ejs
    ├── signin.ejs
    ├── signup.ejs
    ├── testimg.ejs
    └── user.ejs


```