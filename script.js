var ws;
var url;
var password;
var connected;
var data;

var c = document.getElementById('c');
var ctx = c.getContext('2d');

ctx.lineWidth = 5;

function convertDutyToAngle(duty) {
  var minPulse = 2560;
  var maxPulse = 600;
  var pulseRange = maxPulse - minPulse;
  var pulsePerDegree = pulseRange / 180;

  var pulseWidth = duty / 100 * 2000;
  var angle = Math.floor((pulseWidth - minPulse) / pulsePerDegree);

  return angle;
}

function processData(data) {
  var d = data.split(' ');
  var len0 = parseInt(d[0]);
  var len1 = parseInt(d[1]);
  var cDuty = parseInt(d[2]);
  var ang = Math.floor(convertDutyToAngle(cDuty));

  if (ang >= 179) {
    clearCanvas();
  }

  var ang0 = ang * (Math.PI / 180);
  var ang1 = (ang + 180) * (Math.PI / 180);

  var x0 = len0 * Math.cos(ang0);
  var y0 = len0 * Math.sin(ang0);

  var x1 = len1 * Math.cos(ang1);
  var y1 = len1 * Math.sin(ang1);

  return {
    x0: Math.floor(x0),
    y0: Math.floor(y0),
    x1: Math.floor(x1),
    y1: Math.floor(y1),
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, 2400, 2400);
}

function drawGrid() {
  var c = document.getElementById('grid');
  var ctx = c.getContext('2d');
  ctx.lineWidth = 5;

  ctx.strokeStyle = '#000000';
  for (var r = 300; r < 1500; r += 300) {
    ctx.beginPath();
    ctx.arc(c.width / 2, c.height / 2, r, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

function plot(data) {
  var pData = processData(data);

  drawPoint(pData.x0, pData.y0);
  drawPoint(pData.x1, pData.y1);
}

function drawPoint(x, y) {
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(c.width / 2 + x, c.height / 2 + y, 10, 10);
}

function connect() {
  if (!connected) {
    url = document.getElementById('url').value;
    password = document.getElementById('password').value;
    ws = new WebSocket(url);

    ws.onopen = function(event) {
      ws.send(password + '\n');
      connected = true;
      document.getElementById('connect-btn').innerHTML = 'Disconnect';
    }

    ws.onclose = function(event) {
      connected = false;
      document.getElementById('connect-btn').innerHTML = 'Connect';
    }

    ws.onmessage = function(event) {
      if ((event.data).trim() == 'Access denied') {
        document.getElementById('log').innerHTML = event.data;
        ws.close();
      }

      if (event.data != '\n') {
        data += event.data;
      } else {
        document.getElementById('log').innerHTML = data;
        plot(data);
        data = '';
      }
    }
  } else {
    ws.close();
  }
}

(function() {
  drawGrid();
})();
