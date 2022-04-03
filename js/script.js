var context;
var canvas;
var pi=3.1415926;
var x=100;
var y=100;
var Line={
    x:null,
    y:null,
    x1:null,
    y1:null,
    length:null,
    angle:0,
}
Point={
    x:null,
    y:null,
}
dataLine={
    angleArr:[
        90,
        45,
        135,
        90,
        90,
        45,
        135,
        -15,
        -15,
        -90
    ],
    lengthArr:[
        30,
        20,
        20,
        20,
        20,
        20,
        20,
        20,
        20,
        10,
    ],
    
    pointArr:[],
}
var arrHumanLine=[
];

window.addEventListener('load', function () {
    preload();
    create();
    setInterval(drawAll,16);
    setInterval(update,16); 
});
function preload()
{
}
function addPointData(x,y)
{
    var point=clone(Point);
    point.x=x;
    point.y=y;
    dataLine.pointArr.push(point);
}
function create()
{
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    addPointData(x,y);
    addLineInHuman(x,y,dataLine.angleArr[0],dataLine.lengthArr[0])
    addLineInHuman(arrHumanLine[0].x1,arrHumanLine[0].y1,dataLine.angleArr[1],
                    dataLine.lengthArr[1]);
    addLineInHuman(arrHumanLine[0].x1,arrHumanLine[0].y1,dataLine.angleArr[2],
                    dataLine.lengthArr[2]);
    addLineInHuman(arrHumanLine[1].x1,arrHumanLine[1].y1,dataLine.angleArr[3],
                    dataLine.lengthArr[3]);
    addLineInHuman(arrHumanLine[2].x1,arrHumanLine[2].y1,dataLine.angleArr[4],
                    dataLine.lengthArr[4]);
    addLineInHuman(x,y,dataLine.angleArr[5],dataLine.lengthArr[5]);
    addLineInHuman(x,y,dataLine.angleArr[6],dataLine.lengthArr[6]);
    addLineInHuman(arrHumanLine[5].x1,arrHumanLine[5].y1,dataLine.angleArr[7],
                    dataLine.lengthArr[7]);
    addLineInHuman(arrHumanLine[6].x1,arrHumanLine[6].y1,dataLine.angleArr[8],
                    dataLine.lengthArr[8]);
    addLineInHuman(x,y,dataLine.angleArr[9],dataLine.lengthArr[9]);
}
function addLineInHuman(x,y,angle,length)
{
    var line=clone(Line);
    
    line.angle=angle;
    line.length=length;
    line.x=x;
    line.y=y;
    line.x1=Math.cos(pi*(line.angle)/180)*line.length+line.x;
    line.y1=Math.sin(pi*(line.angle)/180)*line.length+line.y;
    addPointData(line.x1,line.y1);
    arrHumanLine.push(line);
    
}
function drawAll()
{
    context.fillStyle='rgb(210,210,210)';
  //  context.drawImage(imageArr.get("background"),1,1);// нарисовать фон
    context.fillRect(0,0,canvas.width,canvas.height);// очистка экрана
    for (let i=0;i<arrHumanLine.length;i++)
    {
        
        context.beginPath();
        context.moveTo(arrHumanLine[i].x, arrHumanLine[i].y);
        context.lineTo(arrHumanLine[i].x1, arrHumanLine[i].y1);
        context.stroke();
        if (i==arrHumanLine.length-1)
        { 
            let sizeHead=7;
            let xx=Math.cos(pi*(arrHumanLine[i].angle)/180)*(sizeHead+arrHumanLine[i].length)+
                                        arrHumanLine[i].x;
            let yy=Math.sin(pi*(arrHumanLine[i].angle)/180)*(sizeHead+arrHumanLine[i].length)+
                                        arrHumanLine[i].y;
            context.beginPath()
            context.arc(xx,yy, sizeHead,0,2*pi);
            context.stroke();
        }
     
    }
}

function update()
{
}



