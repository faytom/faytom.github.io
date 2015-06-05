function initBuffer(buf, size){
  for(var i = 0; i < size; i++){
    buf.push(0.0);
  }
}
function pushBuffer(buf, value){
  buf.splice(0,1);
  buf.push(value);
  var sum = 0.0;
  for(var i = 0; i < buf.length; i++){
    sum+=buf[i];
  }
  return sum/buf.length
}

function debug(t){
  textSize(30);
  fill(255);
  textAlign(CENTER,CENTER);
  text(t, width/4, height/4);
}



function countDown(flag){
  if(flag){
    decimalT = millis() - previousT;
    if(decimalT >= 1000){
      previousT = millis();
      time--;
    }
    if(time <= 0) {
      TimesUp = true;
      TimeCount = false;
      time = 10;
    }
    
    fill('#00EAE8');
    textSize(60);
    textAlign(CENTER, CENTER);
    var front = nf(time-1, 2, 0);
    var back = nf((1000-decimalT % 1000) / 10, 2, 0);
    text(front+":"+back, width/2, height/6);
  }
}