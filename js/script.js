var context;
var canvas;
var mouseOffsetX=0;
var mouseOffsetY=0;
var pi=3.1415926;
var x=100;
var y=263;
var numLineSelect=null;// выбранная конечность
var oldAngle=null;
var flagAngle=false;
var flagDragHuman=false;
var maxNumFrame=0;
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
var Frame={
    x:100,
    y:100,
    angleArr:[],
    lineArr:[],
    numFrame:0,
};
var arrFrame=[];
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
    updateLineHuman(0.5);
    addFrame(dataLine.angleArr);
}
function addFrame(angleArr)
{
    let frame=clone(Frame);
    for (let i=0;i<angleArr.length;i++)
    {
        frame.angleArr.push(angleArr[i]);
    }
    frame.numFrame=maxNumFrame;
    maxNumFrame++;
    arrFrame.push(frame); 
}
function setOffsetMousePosXY(x,y)// устонавить смешения координаат для прицелевания так как экран начинается не в 0 0
{
    mouseOffsetX=x;
    mouseOffsetY=y;
}
function calcLineInHuman(x,y,angle,length)// добавить линию 
{
    var line=clone(Line);
    
    line.angle=angle;
    line.length=length;
    line.x=x;
    line.y=y;
    line.x1=Math.cos(pi*(line.angle)/180)*line.length+line.x;
    line.y1=Math.sin(pi*(line.angle)/180)*line.length+line.y;
    //addPointData(line.x1,line.y1);
    return line;
    //arrHumanLine.push(line);
    
}
function updateLineHuman(scale=1)// обновить линии скелета
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
    let arrLine=calcArrLine(scale);
    for (let i=0;i<arrLine.length;i++)
    {
        arrHumanLine.push(arrLine[i]);
        addPointData(arrLine[i].x1,arrLine[i].y1);
    }
}
function calcArrLine(scale=1)
{
    let arrLine=[];
    arrLine.push(calcLineInHuman(x,y,dataLine.angleArr[0],
                    dataLine.lengthArr[0]*scale))//1
    //2
    arrLine.push(calcLineInHuman(x,y,dataLine.angleArr[1],
                    dataLine.lengthArr[1]*scale));
    //3
    arrLine.push(calcLineInHuman(x,y,dataLine.angleArr[2],
                    dataLine.lengthArr[2]*scale));
    ///4
    arrLine.push(calcLineInHuman(arrLine[1].x1,arrLine[1].y1,
                    filtrAngle(dataLine.angleArr[3]),
                    dataLine.lengthArr[3]*scale));
    //5
    arrLine.push(calcLineInHuman(arrLine[2].x1,arrLine[2].y1,
                    filtrAngle(dataLine.angleArr[4]),
                    dataLine.lengthArr[4]*scale));
    //6
    arrLine.push(calcLineInHuman(arrLine[0].x1,arrLine[0].y1,
                    filtrAngle(dataLine.angleArr[5]),
                    dataLine.lengthArr[5]*scale));
    //7
   arrLine.push( calcLineInHuman(arrLine[0].x1,arrLine[0].y1,
                    filtrAngle(dataLine.angleArr[6]),
                    dataLine.lengthArr[6]*scale));
    //8
   arrLine.push( calcLineInHuman(arrLine[5].x1,arrLine[5].y1,
        filtrAngle(dataLine.angleArr[7]),
                    dataLine.lengthArr[7]*scale));
                    
    //9
    arrLine.push(calcLineInHuman(arrLine[6].x1,arrLine[6].y1,
        filtrAngle( dataLine.angleArr[8]),
                    dataLine.lengthArr[8]*scale));
    //10
    arrLine.push(  calcLineInHuman(arrLine[0].x1,arrLine[0].y1,
        filtrAngle(dataLine.angleArr[9]),
                    dataLine.lengthArr[9]*scale));
    return arrLine;
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
    context.beginPath();
    context.moveTo(1,canvas.height/2);
    context.lineTo(canvas.width,canvas.height/2 );
    context.stroke();
}
function drawFrame()
{
    
}
function update()
{
    let mX=Math.trunc(mouseX-mouseOffsetX);
    let mY=Math.trunc(mouseY-mouseOffsetY);
    updateLineHuman(0.5);
    if (checkMouseLeft())// если нажата левая кнопка мыши
    {
        for (let i=0;i<dataLine.pointArr.length;i++)
        {
            let dist=calcDist(dataLine.pointArr[i].x,dataLine.pointArr[i].y,mX,mY);
            if (i==0)
            {
                if (dist<6)
                {
                    flagDragHuman=true;
                    
                }
            }
            else
            {
                console.log(dist)
                if (dist<=6 && numLineSelect==null && flagDragHuman==false) //если кликнули в суставы скелета
                {

                    numLineSelect=i-1;
                    oldAngle=angle;
                }
            }
            
        } 
        
    }
    else// если отпустили кнопку мыши
    {
        numLineSelect=null;
        flagAngle=false;
        flagDragHuman=false;
    }  
    if (flagDragHuman==true)
    {
        x=mX;
        y=mY;
    }
    if (numLineSelect!=null)// если выбран сустав
    {
       let angle=angleIm(arrHumanLine[numLineSelect].x,arrHumanLine[numLineSelect].y,
                                                  mX,mY)-90;
        if (oldAngle!=angle)
        {1;
            if (flagAngle==true)
            {
                updateAngle(numLineSelect,angle,oldAngle);
                
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
function updateAngle(n,angle,oldAngle)// функция которая обновляет углы скелета по номеру
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



