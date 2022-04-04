var context;
var canvas;
var mouseOffsetX=0;
var mouseOffsetY=0;
var pi=3.1415926;
var x=100;
var y=100;
var numLineSelect=null;// выбранная конечность
var oldAngle=null;
var flagAngle=false;
var Line={
    x:null,
    y:null,
    x1:null,
    y1:null,
    length:null,
    angle:0,
    select:false,
}
Point={
    x:null,
    y:null,
}
dataLine={
    angleArr:[
        -90,
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
function addPointData(x,y)// добавить точку скелета
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
    initKeyboardAndMouse(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown' ]);
    //setOffsetMousePosXY((window.innerWidth - canvas.width)/2,
    //                        (window.innerHeight - canvas.height)/2);
//    setOffsetMousePosXY(canvas.x,canvas.y);
    updateLineHuman();
}
function setOffsetMousePosXY(x,y)// устонавить смешения координаат для прицелевания так как экран начинается не в 0 0
{
    mouseOffsetX=x;
    mouseOffsetY=y;
}
function addLineInHuman(x,y,angle,length)// добавить линию 
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
function updateLineHuman()// обновить линии скелета
{
    while (dataLine.pointArr.length>0)
    {
        dataLine.pointArr.splice(0,1);
    }
    while (arrHumanLine.length>0)
    {
        arrHumanLine.splice(0,1);
    }
    addPointData(x,y);
    addLineInHuman(x,y,dataLine.angleArr[0],dataLine.lengthArr[0])//1
    //2
    addLineInHuman(x,y,dataLine.angleArr[1],
                    dataLine.lengthArr[1]);
    //3
    addLineInHuman(x,y,dataLine.angleArr[2],
                    dataLine.lengthArr[2]);
                    addLineInHuman(arrHumanLine[1].x1,arrHumanLine[1].y1,
                    filtrAngle(dataLine.angleArr[3]),
                    dataLine.lengthArr[3]);
    //5
    addLineInHuman(arrHumanLine[2].x1,arrHumanLine[2].y1,
                    filtrAngle(dataLine.angleArr[4]),
                    dataLine.lengthArr[4]);
    //6
    addLineInHuman(arrHumanLine[0].x1,arrHumanLine[0].y1,
                    filtrAngle(dataLine.angleArr[5]),
                    dataLine.lengthArr[5]);
    //7
    addLineInHuman(arrHumanLine[0].x1,arrHumanLine[0].y1,
                    filtrAngle(dataLine.angleArr[6]),
                    dataLine.lengthArr[6]);
    //8
    addLineInHuman(arrHumanLine[5].x1,arrHumanLine[5].y1,
        filtrAngle(dataLine.angleArr[7]),
                    dataLine.lengthArr[7]);
                    
    //9
    addLineInHuman(arrHumanLine[6].x1,arrHumanLine[6].y1,
        filtrAngle( dataLine.angleArr[8]),
                    dataLine.lengthArr[8]);
    //10
    addLineInHuman(arrHumanLine[0].x1,arrHumanLine[0].y1,
        filtrAngle(dataLine.angleArr[9]),
                    dataLine.lengthArr[9])
}
function drawAll()
{
    
  //  context.drawImage(imageArr.get("background"),1,1);// нарисовать фон 
    context.fillStyle='rgb(210,210,210)';
    context.fillRect(0,0,canvas.width,canvas.height);// очистка экрана
    for (let i=0;i<arrHumanLine.length;i++)
    {
        if (arrHumanLine[i].select==true)
        {
            context.strokeStyle='rgb(255,0,0)';
        }
        else
        {
            context.strokeStyle='rgb(0,0,0)';
        }
        context.beginPath();
        context.moveTo(arrHumanLine[i].x, arrHumanLine[i].y);
        context.lineTo(arrHumanLine[i].x1, arrHumanLine[i].y1);
        context.stroke();
        if (i==arrHumanLine.length-1)//рисуем голову
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
    // рисуем точки суставов
    context.fillStyle='rgb(0,210,0)';
    context.strokeStyle='rgb(0,0,0)';
    for (let i=0;i<dataLine.pointArr.length;i++)
    {
        let x=dataLine.pointArr[i].x;
        let y=dataLine.pointArr[i].y;
        context.beginPath()
        context.arc(x,y, 3,0,2*pi);
        context.fill();
        context.stroke();
    }
}

function update()
{
    let mX=Math.trunc(mouseX-mouseOffsetX);
    let mY=Math.trunc(mouseY-mouseOffsetY);
    updateLineHuman();
    if (checkMouseLeft())// если нажата левая кнопка мыши
    {
        for (let i=1;i<dataLine.pointArr.length;i++)
        {
            let dist=calcDist(dataLine.pointArr[i].x,dataLine.pointArr[i].y,mX,mY);
            console.log(dist)
            if (dist<=6 && numLineSelect==null) //если кликнули в суставы скелета
            {
                
                numLineSelect=i-1;
                oldAngle=angle;
            }
            
        }     
    }
    else// если отпустили кнопку мыши
    {
        numLineSelect=null;
        flagAngle=false;
    }  
    
    if (numLineSelect!=null)// если выбран сустав
    {
       let angle=angleIm(arrHumanLine[numLineSelect].x,arrHumanLine[numLineSelect].y,
                                                  mX,mY)-90;
        if (oldAngle!=angle)
        {1;
            if (flagAngle==true)
            {
                updateAngle(numLineSelect,angle);
                
            }
            else 
            {
                flagAngle=true;
            }
            // console.log (arrHumanLine[numLineSelect].angle);
            oldAngle=angle;
        }
        arrHumanLine[numLineSelect].select=true;
    }
}
function updateAngle(n,angle)// функция которая обновляет углы скелета по номеру
{
    switch (n)
    {
        case 0:
            dataLine.angleArr[0]=angle;
            dataLine.angleArr[5]+=angle-oldAngle;
            dataLine.angleArr[6]+=angle-oldAngle;
            
            dataLine.angleArr[7]+=angle-oldAngle;
            dataLine.angleArr[8]+=angle-oldAngle;
            dataLine.angleArr[9]+=angle-oldAngle;
            
        break;
        case 1:
        {
           dataLine.angleArr[1]=angle; 
           dataLine.angleArr[3]+=angle-oldAngle;
        }
        break;
        case 2:
        {
           dataLine.angleArr[2]=angle; 
           dataLine.angleArr[4]+=angle-oldAngle;
        }
        break;
        case 5:
        {
           dataLine.angleArr[5]=angle; 
           dataLine.angleArr[7]+=angle-oldAngle;
        }
        break;
        case 6:
        {
           dataLine.angleArr[6]=angle; 
           dataLine.angleArr[8]+=angle-oldAngle;
        }
        break;
        case 3:case 4:case 8:case 7:case 9:
        {
           dataLine.angleArr[n]=angle; 
        }
        break;
    }
}



