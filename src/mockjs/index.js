
// src/mock/index.js
import Mock from 'mockjs'  //导入mockjs


//本地数据;
//##database##
const database =
{
  user_info: [
    { seq: 1, user_id: "222", user_name: "成员1", password: "123456", email: "222@22.com", phone_num: "222", sex: "男", birthday: "2023-11-21 12:00:22", address: "a", created_time: "2023-11-21 12:00:22", updated_time: "2023-11-21 12:00:22", age: 45, id: "a", deposit: 1.10, },
    { seq: 3, user_id: "111", user_name: "成员2", password: "123456", email: "111@11.com", phone_num: "111", sex: "女", birthday: null, address: null, created_time: null, updated_time: null, age: 23, id: null, deposit: null, },
    { seq: 4, user_id: "admin", user_name: "管理员", password: "911911", email: "911@qq.com", phone_num: "911", sex: "男", birthday: "2023-12-15 22:09:17", address: "", created_time: "2023-12-15 22:09:17", updated_time: "2023-12-15 22:09:17", age: 91, id: "", deposit: null }
  ],
  book_info: [
    { seq: 1, book_id: "a", book_name: "欧洲14国", author: "1", no: "a", press: "a", publication_date: "2023-12-11 22:15:40", book_class: "欧洲地区", loc: "国航", cover_url: "欧洲十四国.jpg", stock_num: 10, margin_num: 12.9, collect_num: 12.23, borrow_num: 6 },
    { seq: 2, book_id: "a", book_name: "德法意瑞", author: "2", no: "9787302558217", press: "a", publication_date: "2020-09-01", book_class: "欧洲地区", loc: "汉莎", cover_url: "德法意瑞.jpg", stock_num: 10, margin_num: 12.1, collect_num: 12.15, borrow_num: 2 },
    { seq: 4, book_id: "000", book_name: "巴黎罗马", author: "3", no: "2", press: "", publication_date: "2023-12-19 15:38:28", book_class: "欧洲地区", loc: "南航", cover_url: "巴黎罗马", stock_num: 10, margin_num: 12.6, collect_num: 12.20, borrow_num: 0 }
  ],
  PRE_BORROW_INFO: [
    { seq: 1, book_name: 'a', reader_name: 'a', ins_time: '2023-12-27 17:50:59', borrow_days: 1, borrow_price: 1, borrow_cost: 1.1, remark: 'a', book_id: 'a', reader_id: 'a', },
  ],
  COLLECT_INFO: [
    { seq: 1, book_name: '888888', reader_name: '666666', collect_time: '@', remark: '1', book_id: 'a', reader_id: 'a', },
  ],
  VISIT_INFO: [
    { seq: 1, reader_id: '巴黎', reader_name: '100', in_time: '200', out_time: '4', read_time: 1.1, },
  ],
  BORROW_INFO: [
    { seq: 1, book_name: '柏林', reader_name: '100', borrow_time: '240', return_time: '3', borrow_days: 1, returned: 'a', is_delayed: '@', delayed_hour: 1.1, delayed_cost: 1.1, remark: 'a', book_id: 'a', reader_id: 'a', },
  ],
  //@@tabledata@@//
}


//一套基本的增删改查
//(1)增. 参数: 表名; 增加的数据
function add(tableName, params) {
  var tableList = database[tableName];
  //console.log('1tableList:↓', tableList)

  //console.log('2params:↓', params)
  var paramsJson = JSON.parse(params)
  //新增数据
  if (paramsJson.hasOwnProperty('modelData')) {
    // console.log('3包含增加数据:↓')
    var addData = paramsJson.modelData;
    // console.log('3addData:↓', addData)

    //替换主键seq
    // 生成一个指定范围内的整数
    addData.seq = Mock.mock('@integer(1, 10000)');

    tableList.push(addData)
    //console.log('4tableList:↓', tableList)
  }
  return tableList
}
//(2)删 用主键删除;
function del(tableName, params) {
  var tableList = database[tableName];
  //console.log('1tableList:↓', tableList)

  //console.log('2params:↓', params)
  var paramsJson = JSON.parse(params)
  if (paramsJson.hasOwnProperty('modelData')) {
    // console.log('3包含删除数据:↓')
    var delParaData = paramsJson.modelData;
    //console.log('3delData:↓', delData)
    var delData = tableList.find(item => item.seq == delParaData.seq)// 要删除的元素
    tableList.splice(tableList.indexOf(delData), 1)
    //console.log('4删完以后detableList:↓', tableList)
  }
  return tableList
}

//(3)改 
function edit(tableName, params) {
  var tableList = database[tableName];
  //console.log('1tableList:↓', tableList)

  //console.log('2params:↓', params)
  var paramsJson = JSON.parse(params)
  if (paramsJson.hasOwnProperty('modelData')) {
    //console.log('3包含编辑后的数据:↓')
    var afterEditParaData = paramsJson.modelData;
    //console.log('3afterEditParaData:↓', afterEditParaData)
    var beforeEditData = tableList.find(item => item.seq == afterEditParaData.seq)// 要删除的元素; 替换成编辑以后的元素
    tableList.splice(tableList.indexOf(beforeEditData), 1, afterEditParaData)//替换
    //console.log('4编辑完以后detableList:↓', tableList)
  }
  return tableList
}
//(4)查 表名; 参数:页码/页数/form条件
function query(tableName, params) {
  var tableList = database[tableName];
  console.log('1tableList:↓', tableList)

  var targetList = tableList

  console.log('2params:↓', params)
  var paramsJson = JSON.parse(params)
  //form条件 取字段,
  if (paramsJson.hasOwnProperty('formData')) {
    console.log('3包含查询条件:↓')

    var whereData = paramsJson.formData;
    console.log('3whereData:↓', whereData)

    //e = 查询条件
    for (var key in whereData) {
      var fieldName = key.substring(key.indexOf('__') + 2, key.length)
      console.log('4fieldName:↓', fieldName)
      console.log('4fieldValue:↓', whereData[key])
      var fieldValue = whereData[key]
      if (!fieldValue) {
        continue
      }

      // 符合条件的元素组成的数组
      targetList = targetList.filter(item => item[fieldName] === whereData[key]);
      console.log('5targetList:↓', targetList)
    }
  }

  //页码

  return targetList
}



//使用Mock下面提供的mock方法进行需要模拟数据的封装
//参数1，是需要拦截的完整请求地址，参数2，是请求方式，参数3，是请求的模拟数据
Mock.mock('/data/list', 'get', {
  status: 200, //请求成功状态码
  dataList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] //模拟的请
})

//注册
Mock.mock('/USER_INFO/addHandel', 'post', function (params) {
  console.log("🚀 ~ file: index.js:143 ~ params.body:", params.body)
  var tableList = database['user_info'];

  var user = {
    seq: Mock.mock('@integer(1, 10000)'),
    user_id: params.body.user_id,
    user_name: params.body.user_name,
    password: params.body.password,
    email: params.body.email,
    phone_num: "",
    sex: "",
    birthday: "",
    address: "",
    created_time: new Date(),
    updated_time: "",
    age: 1,
    id: "a",
    deposit: 1.10,
  }
  tableList.push(user)

  return {
    code: 200,
    msg: '注册成功'
  }
})

//登录
Mock.mock('/USER_INFO/login', 'post', function (params) {
  console.log("🚀 ~ file: index.js:171 ~ params:", params)
  //用户id , 写访客记录
  var userData = JSON.parse(params.body)
  // 访客表
  var visitInfo = {
    seq: Mock.mock('@integer(1, 10000)'),
    reader_id: userData.user_id,
    reader_name: '',
    in_time: new Date(),
    out_time: '', read_time: 0,
  }

  var user_infoList = database['user_info'];
  var user_info = user_infoList.find(item => item['user_id'] === userData.user_id && item['password'] == userData.password);
  if (user_info != undefined && user_info != null) {
    // 登录成功
    visitInfo.user_name = user_info.user_name
  }
  var tableList = add('VISIT_INFO', JSON.stringify({ 'modelData': visitInfo }))
  console.log("🚀 ~ file: index.js:190 ~ tableList:", tableList)

  return {
    code: '200',
    data: {
      type: '0',
      msg: '登录成功',
    }
  }

})


//登出
Mock.mock('/USER_INFO/logout', 'post', function (params) {
  //用户id , 改访客记录
  var userData = JSON.parse(params.body)

  var visit_infoList = database['VISIT_INFO'];
  var visit_info = visit_infoList.find(item => item['reader_id'] === userData.user_id && item['out_time'] === '');
  if (visit_info != undefined && visit_info != null) {
    
    visit_info.out_time = new Date()
    var readTime = (new Date(visit_info.out_time) - new Date(visit_info.in_time) ) / (1000 * 60 * 60)
    // console.log("🚀 ~ 阅读时间: index.js:216 ~ readTime:", readTime)
    visit_info.read_time =readTime
    edit('VISIT_INFO', JSON.stringify({ 'modelData': visit_info }))
  }

  return {
    code: '200',
    msg: '退出成功',
  }

})


Mock.mock('/addHandel', 'post', function (params) {
  //console.log('params:↓', params.body)
  var targetList = []
  targetList = add(JSON.parse(params.body).tableName, params.body)
  return {
    code: 200,
    data: {
      tableList: targetList,
      tableCount: targetList.length,
    }
  }
})

Mock.mock('/deleteHandel', 'post', function (params) {
  // console.log('params:↓', params.body)
  var targetList = []
  targetList = del(JSON.parse(params.body).tableName, params.body)
  return {
    code: 200,
    data: {
      tableList: targetList,
      tableCount: targetList.length,
    }
  }
})

Mock.mock('/editHandel', 'post', function (params) {
  //console.log('params:↓', params.body)
  var targetList = []
  targetList = edit(JSON.parse(params.body).tableName, params.body)
  return {
    code: 200,
    data: {
      tableList: targetList,
      tableCount: targetList.length,
    }
  }
})

Mock.mock('/queryTable1', 'post', function (params) {
  var targetList = []
  targetList = query(JSON.parse(params.body).tableName, params.body)
  return {
    code: 200,
    data: {
      tableList: targetList,
      tableCount: targetList.length,
    }
  }
})

//收藏
Mock.mock('/BOOK_INFO/collectHandle', 'post', function (params) {
  var paramsJson = JSON.parse(params.body)
  //插入收藏表 add; 
  var modelData = {
    seq: Mock.mock('@integer(1, 10000)'),
    book_name: paramsJson.book_name,
    reader_name: paramsJson.user_name,
    collect_time: new Date(),
    book_id: paramsJson.book_id,
    reader_id: paramsJson.user_id,
  }
  add('COLLECT_INFO', JSON.stringify({ 'modelData': modelData }))

  //图书: 收藏量+1 edit;
  var bookInfoList = database['book_info'];

  var targetBookBefore = bookInfoList.find(item => item['book_id'] === paramsJson.book_id);

  var targetBookAfter = JSON.parse(JSON.stringify(targetBookBefore));
  targetBookAfter.collect_num += 1;

  bookInfoList.splice(bookInfoList.indexOf(targetBookBefore), 1, targetBookAfter)//替换

  return {
    code: 200,
    data: '收藏成功',
  }
})

//借阅
Mock.mock('/BOOK_INFO/borrowHandel', 'post', function (params) {
  console.log('params:↓', params.body)
  var paramsJson = JSON.parse(params.body)
  //插入借阅表 add; 
  var modelData = {
    seq: Mock.mock('@integer(1, 10000)'),
    book_name: paramsJson.book_name,
    reader_name: paramsJson.user_name,
    borrow_time: new Date(), return_time: '',
    borrow_days: paramsJson.borrow_days, returned: '否', is_delayed: '未延期', delayed_hour: '', delayed_cost: '', remark: 'a',
    book_id: paramsJson.book_id,
    reader_id: paramsJson.user_id,
  }
  add('BORROW_INFO', JSON.stringify({ 'modelData': modelData }))

  //图书: 馆藏量-1,借阅量+1 edit;
  var bookInfoList = database['book_info'];
  console.log('1bookInfoList:↓', bookInfoList)

  var targetBookBefore = bookInfoList.find(item => item['book_id'] === paramsJson.book_id);
  console.log('3.targetBookBefore:↓', targetBookBefore)

  var targetBookAfter = JSON.parse(JSON.stringify(targetBookBefore));
  targetBookAfter.margin_num -= 1;
  // targetBookAfter.collect_num+=1;
  targetBookAfter.borrow_num += 1;
  console.log('3.targetBookAfter:↓', targetBookAfter)


  //console.log('3找到书本信息:↓')
  bookInfoList.splice(bookInfoList.indexOf(targetBookBefore), 1, targetBookAfter)//替换
  //console.log('4修改完以后bookInfoList:↓', bookInfoList)

  return {
    code: 200,
    data: '借阅成功',
  }
})

//归还
Mock.mock('/BORROW_INFO/returnHandle', 'post', function (params) {
  console.log("🚀 ~ file: index.js:242 ~ params.body:", params.body)
  var paramsJson = JSON.parse(params.body)
  if (paramsJson.hasOwnProperty('modelData')) {
    var rowData = paramsJson.modelData;
    //校验是否已经超时
    //当前时间-借阅时间>3天
    const returnTime = new Date()
    const borrowTime = new Date(rowData.borrow_time)
    const borrwDays = rowData.borrow_days
    const isDelayed = ((returnTime - borrowTime) > borrwDays * 24 * 60 * 60 * 1000) //是否延期
    if (!isDelayed || (isDelayed && rowData.is_delayed == '延期已结清')) //未延期 和 延期已结清 可正常还书
    {
      rowData.return_time = returnTime
      rowData.returned = '是'
      edit('BORROW_INFO', JSON.stringify({ 'modelData': rowData }))

      //书 馆藏量+1
      var bookList = database['book_info'];
      var book0 = bookList.find(item => item.book_id == rowData.book_id)
      book0.stock_num += 1;
      edit('book_info', JSON.stringify({ 'modelData': book0 }))

      return {
        code: 200,
        msg: '归还成功'
      }
    } else if (isDelayed) {
      rowData.is_delayed = '延期'
      var delayedDay = Math.floor(((returnTime - borrowTime) - borrwDays * 24 * 60 * 60 * 1000) / (24 * 60 * 60 * 1000)) // 向下取整天数
      console.log("🚀 ~ file: index.js:256 ~ delayedDay:", delayedDay)
      rowData.delayed_hour = delayedDay
      rowData.delayed_cost = delayedDay
      edit('BORROW_INFO', JSON.stringify({ 'modelData': rowData }))

      return {
        code: 500,
        msg: '延期归还,请缴费后再归还'
      }
    }

    // if (isDelayed) {
    //   //超时
    //   //是否结清
    //   if (rowData.remark == '未延期') {
    //     rowData.is_delayed = '延期'
    //     var delayedDay = Math.floor(((returnTime - borrowTime) - borrwDays * 24 * 60 * 60 * 1000) / (24 * 60 * 60 * 1000)) // 向下取整天数
    //     console.log("🚀 ~ file: index.js:256 ~ delayedDay:", delayedDay)
    //     rowData.delayed_hour = delayedDay
    //     rowData.delayed_cost = delayedDay
    //     edit('BORROW_INFO', JSON.stringify({ 'modelData': rowData }))

    //     return {
    //       code: 500,
    //       msg: '延期归还,请缴费后再归还'
    //     }
    //   } else if (rowData.remark == '延期已结清') {
    //     //正常归还
    //   }
    // } else {
    //   rowData.return_time = returnTime
    //   rowData.returned = '是'
    //   edit('BORROW_INFO', JSON.stringify({ 'modelData': rowData }))

    //   //书 馆藏量+1
    //   var bookList = database['book_info'];
    //   var book0 = bookList.find(item => item.book_id == rowData.book_id)
    //   book0.stock_num += 1;
    //   edit('book_info', JSON.stringify({ 'modelData': book0 }))

    //   return {
    //     code: 200,
    //     msg: '归还成功'
    //   }
    // }
  }
  //插入借阅表 add; 
  var modelData = {
    seq: Mock.mock('@integer(1, 10000)'),
    book_name: paramsJson.book_name,
    reader_name: paramsJson.user_name,
    borrow_time: new Date(), return_time: '',
    borrow_days: paramsJson.borrow_days, returned: '否', is_delayed: '未延期', delayed_hour: '', delayed_cost: '', remark: 'a',
    book_id: paramsJson.book_id,
    reader_id: paramsJson.user_id,
  }
  add('BORROW_INFO', JSON.stringify({ 'modelData': modelData }))

  //图书: 馆藏量-1,借阅量+1 edit;
  var bookInfoList = database['book_info'];
  console.log('1bookInfoList:↓', bookInfoList)

  var targetBookBefore = bookInfoList.find(item => item['book_id'] === paramsJson.book_id);
  console.log('3.targetBookBefore:↓', targetBookBefore)

  var targetBookAfter = JSON.parse(JSON.stringify(targetBookBefore));
  targetBookAfter.margin_num -= 1;
  // targetBookAfter.collect_num+=1;
  targetBookAfter.borrow_num += 1;
  console.log('3.targetBookAfter:↓', targetBookAfter)


  //console.log('3找到书本信息:↓')
  bookInfoList.splice(bookInfoList.indexOf(targetBookBefore), 1, targetBookAfter)//替换
  //console.log('4修改完以后bookInfoList:↓', bookInfoList)

  return {
    code: 200,
    data: '借阅成功',
  }
})












