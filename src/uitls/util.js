const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  var a = str.join("&");
  console.info(a);
  return str.join("&");
}


/**	 *  时间戳格式转换	 */
function getFormatTime(timesamp) {
  var result = "";
  var todayCalendar = new todayCalendar();
  var otherCalendar = new otherCalendar();
  // const todayCalendar = new Calendar() .getInstance();
  // const otherCalendar = new Calendar().getInstance();

  otherCalendar.setTimeInMillis(timesamp);
  var timeFormat = new SimpleDateFormat("M月d日 HH:mm");
  var yearTimeFormat = new SimpleDateFormat("yyyy年M月d日 HH:mm");
  var hourAndMinFormat = new SimpleDateFormat("HH:mm");
  var yearTemp = todayCalendar.get(Calendar.YEAR) == otherCalendar.get(Calendar.YEAR);
  if (yearTemp) {
    var todayMonth = todayCalendar.get(Calendar.MONTH);
    var otherMonth = otherCalendar.get(Calendar.MONTH);
    if (todayMonth == otherMonth) { //表示是同一个月			
      var temp = todayCalendar.get(Calendar.DATE) - otherCalendar.get(Calendar.DATE);
      switch (temp) {
        case 0:
          result = hourAndMinFormat.format(new Date(timesamp));
          break;
        case 1:
          result = "昨天 " + hourAndMinFormat.format(new Date(timesamp));
          break;
        default:
          result = timeFormat.format(new Date(timesamp));
          break;
      }
    } else {
      result = timeFormat.format(new Date(timesamp));
    }
  } else {
    result = yearTimeFormat.format(new Date(timesamp));
  }
  return result;
}




/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
 */
function formatTimes(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

function getDateDiff(timess) {
  var time1 = new Date();  //现在时间

  if (timess.length < 2) {
    return;
  }
  var timess = timess.split('.')[0];

  var time2 = new Date(timess.replace(/-/g, '/'));  //结束时间
  var time3 = time1.getTime() - time2.getTime()  //时间差的毫秒数

  // console.log(timess, time2, time3) //1398250549012 1398250549012 1398250549000
  //计算出相差星期数
  var weeks = Math.floor(time3 / (7 * 24 * 3600 * 1000));
  //计算出相差天数
  var days = Math.floor(time3 / (24 * 3600 * 1000));
  //计算出小时数
  var leave1 = time3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000));
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000));
  //计算相差秒数
  var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000);
  if (weeks != 0) {
    return formatDate(timess);//自己解析时间戳
  } else if (weeks == 0 && days != 0) {
    return days + "天前";
  } else if (weeks == 0 && days == 0 && hours != 0) {
    return hours + "小时前";
  } else if (weeks == 0 && days == 0 && hours == 0 && minutes != 0) {
    return minutes + " 分钟前";
  } else if (weeks == 0 && days == 0 && hours == 0 && minutes == 0 && seconds != 0) {
    //return "刚发表:" + seconds + " 秒";
    return "刚刚";
  }
}//时间戳转化为几天前，几小时前，几分钟前



// 函数节流(throttle)：函数在一段时间内多次触发只会执行第一次，在这段时间结束前，不管触发多少次也不会执行函数。
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
   gapTime = 1500
  }
  
  let _lastTime = null
  
  // 返回新的函数
  return function () {
   let _nowTime = + new Date()
   if (_nowTime - _lastTime > gapTime || !_lastTime) {
    fn.apply(this, arguments) //将this和参数传给原函数
    _lastTime = _nowTime
   }
  }
 }

//将秒数转换为时分秒格式
function formatSeconds(s) {

  var sTime = parseInt(s);// 秒
  var mTime = 0;// 分
  var hTime = 0;// 时
  if(sTime > 60) {//如果秒数大于60，将秒数转换成整数
      //获取分钟，除以60取整数，得到整数分钟
      mTime = parseInt(sTime / 60);
      //获取秒数，秒数取佘，得到整数秒数
      sTime = parseInt(sTime % 60);
      //如果分钟大于60，将分钟转换成小时
      if(mTime > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hTime = parseInt(mTime / 60);
          //获取小时后取佘的分，获取分钟除以60取佘的分
          mTime = parseInt(mTime % 60);
      }
  }
       var result = '';
            if(sTime >=0 && sTime < 10){
	            result = "0" + parseInt(sTime) + "";
            }else{
                result = "" + parseInt(sTime) + "";
            }
	        if(mTime >= 0 && mTime < 10) {
	        	result = "0" + parseInt(mTime) + ":" + result;
	        }else{
                result = "" + parseInt(mTime) + ":" + result;
            }
	        if(hTime >= 0 && hTime < 10) {
	        	result = "0" + parseInt(hTime) + ":" + result;
	        }else{
                result = "" + parseInt(hTime) + ":" + result;
            }
	        return result;
  }
module.exports = {
  formatTime: formatTime,
  formatTimes: formatTimes,
  json2Form: json2Form,
  getFormatTime: getFormatTime,
  getDateDiff: getDateDiff,
  formatDate:formatDate,
  throttle: throttle,
  formatSeconds: formatSeconds,
  formatDate11: formatDate11,
}
//处理时间戳
function formatDate(timessnow) {
  var now = new Date(timessnow);
  var year = now.getFullYear();
  var month = now.getMonth() < 9 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
  var date = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
  var hour = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
  var minute = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
  var second = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
  // return year + "年" + month + "月" + date + "日 " + hour + ":" + minute + ":" + second;
  return year + "年" + month + "月" + date + "日 ";
}

// 把时间戳转换为2020-12-02格式
function formatDate11(sss) { 
  var now = new Date(sss);
  var year = now.getFullYear();  //取得4位数的年份
  var month= now.getMonth()+1;  //取得日期中的月份，其中0表示1月，11表示12月
  var date=now.getDate();      //返回日期月份中的天数（1到31）
  // var hour=now.getHours();     //返回日期中的小时数（0到23）
  // var minute=now.getMinutes(); //返回日期中的分钟数（0到59）
  // var second=now.getSeconds(); //返回日期中的秒数（0到59）
  // return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
  return year + "-" + (month < 10 ? '0' + month : month) + "-" + (date < 10 ? '0' + date : date)+ "";
  }

