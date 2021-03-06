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
var selectFrame=0;
var showFilm=false;
var scaleFrameHuman=0.24;
var time=0;
var delayFrame=22;
var bufferDragCopy=null;
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

var arrHumanLine=[
];
var Frame={
    x:0,//1+28,
    
    width:50,
    height:50,
    y:327,
    xHuman:null,
    yHuman:null,
    angleArr:[],
    lineArr:[],
    selectFrame:0,
};
var frameArr=[];
var butNewFrame={
  x:Frame.x+Frame.width,
  y:Frame.y-Frame.height/2,
  width: Frame.width,
  height: Frame.height,
  text:'+',
  fontSize:70,
};
butDelFrame={
   x:1,//Frame.x+Frame.width/2,
   y:Frame.y-Frame.height/2+100,
   width:150,
   height:40,
   fontSize:24,
   text:"Delete frame",
};
butShowFilm={
   x:320,//Frame.x+Frame.width/2,
   y:Frame.y-Frame.height/2+100,
   width:90,
   height:40,
   fontSize:24,
   text:'start',
};
butSaveFilm={
   x:360,//Frame.x+Frame.width/2,
   y:Frame.y-Frame.height/2+100,
   width:150,
   height:40,
   fontSize:24,
   text:'Сохранить',
};
butLoadFilm={
   x:360,//Frame.x+Frame.width/2,
   y:Frame.y-Frame.height/2+100,
   width:150,
   height:40,
   fontSize:24,
   text:'Загрузить',
};
butMirrorFrame={
   x:160,//Frame.x+Frame.width/2,
   y:Frame.y-Frame.height/2+100,
   width:150,
   height:40,
   fontSize:24,
   text:'отзеркалить', 
};
window.addEventListener('load', function () {
    preload();
    create();
    const file = document.getElementById('your-files');
    file.addEventListener("change", handleFiles);
    function handleFiles()
    {
        var form=document.getElementById('formFile');
        
        var fileOne=file.files[0];
        //console.log(fileOne);
        //objMap.loadMap(JSON.parse(localStorage.getItem('gameMap')));
     //   alert(readFile(file));
        var reader = new FileReader();
        reader.readAsText(fileOne);
        reader.onload = function() {
            frameArrCopy=JSON.parse(reader.result);
            while (frameArr.length>=1)
            {
                frameArr.splice(frameArr.length-1,1);
               // maxNumFrame--;
            }
            
            for (let i=0;i<frameArrCopy.length;i++)
            {
                addFrame(frameArrCopy[i].angleArr,frameArrCopy[i].xHuman,
                        frameArrCopy[i].yHuman)
                butNewFrame.x=frameArr.length*butNewFrame.width;
            }
            arrElemCopy(dataLine.angleArr,frameArr[0].angleArr);
             
           // maxNumFrame=frameArr.length+1;
        }
//        
//          objMap.loadMap(JSON.parse(reader.result));
//        // alert(reader.result);
//        }
        reader.onerror = function() {
        
            alert('ошибка загрузки карты');
        }
        //;
        file.value="";
        form.style.display='none';
   //     this.form.reset;
    }
    setInterval(drawAll,16);
    setInterval(update,16); 
    var inputSpeedFrame = document.getElementById('delayFrame');
    delayFrame= 1000/inputSpeedFrame.value;
    inputSpeedFrame.oninput = function() {
         delayFrame = 1000/inputSpeedFrame.value;
    };
});
function preload()
{
}
function addPointData(x,y)// добавить точку скелета
{
    var point=JSON.parse(JSON.stringify(Point));
    point.x=x;
    point.y=y;
    dataLine.pointArr.push(point);
}
function create()
{
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    initKeyboardAndMouse(['ArrowLeft','Space','ArrowRight',
                            'ArrowUp','ArrowDown', 'ControlLeft',"KeyW"
                            ,"KeyD","KeyS","KeyA"]);
    //setOffsetMousePosXY((window.innerWidth - canvas.width)/2,
    //                        (window.innerHeight - canvas.height)/2);
//    setOffsetMousePosXY(canvas.x,canvas.y);
    butSaveFilm.x=canvas.width-330;
    butLoadFilm.x=canvas.width-160;
    updateLineHuman(x,y,0.5);
    addFrame(dataLine.angleArr,x,y);
}
function addFrame(angleArr,xH=-1,yH=-1)//добавить кадр
{
    let frame=JSON.parse(JSON.stringify(Frame));
    if (xH!=-1 && yH!=-1)
    {
        frame.xHuman=xH;
        frame.yHuman=yH;
    }
    for (let i=0;i<angleArr.length;i++)// дабавляем углы в кадр
    {
        frame.angleArr.push(angleArr[i]);
    }
    // раситыаем линии скедета в кадре
    let arrLine=calcArrLine(frame.x+(frameArr.length)*(frame.width)+frame.width/2,frame.y,
                            frame.angleArr,
                            scaleFrameHuman);
    // созраняет линии скелета в кадре
    for (let i=0;i<arrLine.length;i++)
    {
        frame.lineArr.push(arrLine[i]);
    }
  //  frame.numFrame=maxNumFrame;
    frame.x+=(frameArr.length)*frame.width;
   // frame.x=frame.x-frame.width/2;
    frame.y=frame.y-frame.height/2;
  //  maxNumFrame++;
    frameArr.push(frame); 
    console.log(frameArr);
}
function setOffsetMousePosXY(x,y)// устонавить смешения координаат для прицелевания так как экран начинается не в 0 0
{
    mouseOffsetX=x;
    mouseOffsetY=y;
}
function calcLineInHuman(x,y,angle,length)// добавить линию 
{
    var line=JSON.parse(JSON.stringify(Line));//clone(Line);
    
    line.angle=angle;
    line.length=length;
    line.x=Math.floor(x);
    line.y=Math.floor(y);
    line.x1=Math.floor(Math.cos(pi*(line.angle)/180)*line.length+line.x);
    line.y1=Math.floor(Math.sin(pi*(line.angle)/180)*line.length+line.y);
    //addPointData(line.x1,line.y1);
    return line;
    //arrHumanLine.push(line);
    
}
function updateLineHuman(x,y,scale=1)// обновить линии скелета
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
    let arrLine=calcArrLine(x,y,dataLine.angleArr,scale);
    for (let i=0;i<arrLine.length;i++)
    {
        arrHumanLine.push(arrLine[i]);
        addPointData(arrLine[i].x1,arrLine[i].y1);
    }
}
function calcArrLine(x,y,angleArr,scale=1)// расчитываем из массива углов массив линий
{
    let arrLine=[];
    arrLine.push(calcLineInHuman(x,y,angleArr[0],
                    dataLine.lengthArr[0]*scale))//1
    //2
    arrLine.push(calcLineInHuman(x,y,angleArr[1],
                    dataLine.lengthArr[1]*scale));
    //3
    arrLine.push(calcLineInHuman(x,y,angleArr[2],
                    dataLine.lengthArr[2]*scale));
    ///4
    arrLine.push(calcLineInHuman(arrLine[1].x1,arrLine[1].y1,
                    filtrAngle(angleArr[3]),
                    dataLine.lengthArr[3]*scale));
    //5
    arrLine.push(calcLineInHuman(arrLine[2].x1,arrLine[2].y1,
                    filtrAngle(angleArr[4]),
                    dataLine.lengthArr[4]*scale));
    //6
    arrLine.push(calcLineInHuman(arrLine[0].x1,arrLine[0].y1,
                    filtrAngle(angleArr[5]),
                    dataLine.lengthArr[5]*scale));
    //7
   arrLine.push( calcLineInHuman(arrLine[0].x1,arrLine[0].y1,
                    filtrAngle(angleArr[6]),
                    dataLine.lengthArr[6]*scale));
    //8
   arrLine.push( calcLineInHuman(arrLine[5].x1,arrLine[5].y1,
        filtrAngle(angleArr[7]),
                    dataLine.lengthArr[7]*scale));
                    
    //9
    arrLine.push(calcLineInHuman(arrLine[6].x1,arrLine[6].y1,
        filtrAngle( angleArr[8]),
                    dataLine.lengthArr[8]*scale));
    //10
    arrLine.push(  calcLineInHuman(arrLine[0].x1,arrLine[0].y1,
        filtrAngle(angleArr[9]),
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
    for (let i=0;i<frameArr.length;i++)// рисыем кадры
    {
        let color;
        if (i==selectFrame)
        {
            color='rgb(255,255,0)';
        }
        else
        {    
            color='rgb(0,0,250)';
        }
        drawFrame(i,color);
    }
    if (bufferDragCopy!=null)
    {
        for (let i=0;i<bufferDragCopy.lineArr.length;i++)
        {
            context.strokeStyle='rgb(255,0,0)'
            context.beginPath();
            context.moveTo(bufferDragCopy.lineArr[i].x,
                            bufferDragCopy.lineArr[i].y);
            context.lineTo(bufferDragCopy.lineArr[i].x1,
                            bufferDragCopy.lineArr[i].y1);
            context.stroke();


        }
    }
   // drawButNewFrame();
    drawButton(butNewFrame);//рисуем кнопку нового кадра
    drawButton(butDelFrame);
    drawButton(butShowFilm);   
    drawButton(butSaveFilm);
    drawButton(butLoadFilm);
    drawButton(butMirrorFrame);
     context.beginPath();
    context.font = 18+'px Arial';
   
    //    context.strokeRect(this.widthTab*i,this.y,this.widthTab,20);
    let y=480;
    context.fillText('Для копирования кадра зажми CTRL и перетащи.',
                3,y);
    context.fillText('Для перемещения на 1px используй WSAD.',
                3,y+30);
    context.fillText('Во время просмотра, нельзя: удалять, добавлять, сохранять и загружать.',
                3,y+60);
    context.closePath()
   // drawButDel();
  //  drawButShowFilm();
}
function drawFrame(n=0,color)// нарисовать кадр
{
    
    for (let i=0;i<frameArr[n].lineArr.length;i++)
    {
        context.strokeStyle='rgb(0,0,255)'
        context.beginPath();
        context.moveTo(frameArr[n].lineArr[i].x,frameArr[n].lineArr[i].y);
        context.lineTo(frameArr[n].lineArr[i].x1,frameArr[n].lineArr[i].y1);
        context.stroke();
        
        
    }
    context.strokeStyle=color;;
    context.strokeRect(frameArr[n].x,frameArr[n].y,
                    frameArr[n].width-1,frameArr[n].height-1);
    let heightText=12;
   // context.beginPath();
    context.font = heightText+'px Arial';
    context.fillStyle='rgb(255,0,0)';
    context.fillText("x:"+frameArr[n].xHuman,frameArr[n].x+2,
                frameArr[n].y+frameArr[n].height+12);
    context.fillStyle='rgb(0,0,255)';
    context.fillText("y:"+frameArr[n].yHuman,frameArr[n].x+2,
                frameArr[n].y+frameArr[n].height+12+15);
    
}

function drawButton(obj)
{
    context.strokeStyle='rgb(0,0,255)';
    context.fillStyle='rgb(255,128,0)';
    context.strokeRect(obj.x,obj.y,obj.width,obj.height);
    let heightText=obj.fontSize;
    context.beginPath();
    context.font = obj.fontSize+'px Arial';
    let text=obj.text;
    let metrics = context.measureText(text);
    
    let x=obj.x;
    let y=obj.y;
    let width=obj.width;
    //    context.strokeRect(this.widthTab*i,this.y,this.widthTab,20);
    context.fillText(text,x+width/2-metrics.width/2,y+obj.height/2+obj.fontSize/3);
    context.closePath()
                      
}

function update()
{
    let mX=Math.trunc(mouseX-mouseOffsetX);
    let mY=Math.trunc(mouseY-mouseOffsetY);
    let xx=frameArr[selectFrame].xHuman==null?x:frameArr[selectFrame].xHuman;
    let yy=frameArr[selectFrame].yHuman==null?x:frameArr[selectFrame].yHuman;
    xx=flagDragHuman==true?x:xx;
    yy=flagDragHuman==true?y:yy;
    updateLineHuman(xx,yy,0.5);
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
           //     console.log(dist)
                if (dist<=6 && numLineSelect==null && flagDragHuman==false) //если кликнули в суставы скелета
                {

                    numLineSelect=i-1;
                   // oldAngle=angle;
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
        frameArr[selectFrame].xHuman=x=mX;
        frameArr[selectFrame].yHuman=y=mY;
        
    }
    if (numLineSelect!=null)// если выбран сустав
    {
       let angle=Math.floor(angleIm(arrHumanLine[numLineSelect].x,
                                    arrHumanLine[numLineSelect].y,
                                    mX,mY)-90);
        if (oldAngle!=angle)
        {1;
            if (flagAngle==true)// если держим левую кнопку мыши в суставе
            {
                
                updateAngle(numLineSelect,angle,oldAngle);// обновляем углы
                // присваеваем углы скелета в кадр
                arrElemCopy(frameArr[selectFrame].angleArr,dataLine.angleArr);
                  
                
                // раситываем линии келета в кадре
                frameArr[selectFrame].lineArr=calcArrLine(
                            frameArr[selectFrame].x+frameArr[selectFrame].width/2,
                            frameArr[selectFrame].y+frameArr[selectFrame].width/2,
                            frameArr[selectFrame].angleArr,
                            scaleFrameHuman)
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
    if ( showFilm==false)
    {    
        if (keyUpDuration("KeyW",100))
        {
            y--;
            frameArr[selectFrame].yHuman=y;
           // alert(454);
        }
        if (keyUpDuration("KeyD",100))
        {
            x++;
            frameArr[selectFrame].xHuman=x;
           // alert(454);
        }
        if (keyUpDuration("KeyS",100))
        {
            y++;
            frameArr[selectFrame].yHuman=y;
           // alert(454);
        }
        if (keyUpDuration("KeyA",100))
        {
            x--;
            frameArr[selectFrame].xHuman=x;
           // alert(454);
        }
    }
    if (mouseLeftClick()==true)// если кликнули мышью
    {
        
        if ( showFilm==false)
        {
            //если кликнули на кнопку нового кадра
            if (checkInObj(butNewFrame,mX,mY) )
            {
                numFrame=(frameArr.length);
                addFrame(frameArr[numFrame-1].angleArr,
                         frameArr[numFrame-1].xHuman,
                         frameArr[numFrame-1].yHuman);
                butNewFrame.x=frameArr.length*butNewFrame.width;
                //selectFrame=maxNumFrame;
            }

            // цикл по обходу кадров
            for (let i=0;i<frameArr.length;i++)
            {
                //если кликнули на конкретый кадр
                 if (checkInObj(frameArr[i],mX,mY) )
                {

                    arrElemCopy(dataLine.angleArr,frameArr[i].angleArr);
                    x=frameArr[i].xHuman;
                    y=frameArr[i].yHuman;
                    selectFrame=i;

                }
            }
    
          // //если кликнули на кнопку удалить кадр
           if (checkInObj(butDelFrame,mX,mY))
           {
               if (frameArr.length>1)
               {
                   //frameArr[selectFrame-1].xHuman=frameArr[selectFrame].xHuman;
                   deleteElemArrToNum(frameArr,selectFrame);
                  // maxNumFrame--;
                   if (selectFrame!=0) selectFrame--;
                   butNewFrame.x-=butNewFrame.width;
                   for (let i=0;i<frameArr.length;i++)
                   {
                       frameArr[i].x=i*frameArr[i].width;

                       frameArr[i].lineArr=calcArrLine(
                               frameArr[i].x+frameArr[i].width/2,
                               frameArr[i].y+frameArr[i].width/2,
                               frameArr[i].angleArr,
                               scaleFrameHuman);
                   }
                  // arrElemCopy(frameArr[selectFrame].angleArr,dataLine.angleArr);
               }
            }  
            if (checkInObj(butSaveFilm,mX,mY))
            {
                downloadAsFile(JSON.stringify(frameArr),'saveFilmHuman');
            }
            if (checkInObj(butLoadFilm,mX,mY))
            {
                var formFile=document.getElementById("formFile");
                formFile.style.display="block";
            }
            if (checkInObj(butMirrorFrame,mX,mY))// если нажата отзеркалить
            {
                
                let buffer=[];
                for (let i=0;i<arrHumanLine.length;i++)
                {
                    let lineOne=JSON.parse(JSON.stringify(Line));;
                    lineOne.x=-arrHumanLine[i].x;
                    lineOne.y=arrHumanLine[i].y;
                    lineOne.x1=-arrHumanLine[i].x1;
                    lineOne.y1=arrHumanLine[i].y1;
                    lineOne.angle=Math.floor(angleIm(lineOne.x,lineOne.y,
                                    lineOne.x1,lineOne.y1)-90);
                    buffer.push(lineOne);           
                }
                for (let i=0;i<buffer.length;i++)
                {
                    dataLine.angleArr[i]=buffer[i].angle;
                }
                arrElemCopy(frameArr[selectFrame].angleArr,dataLine.angleArr);
                frameArr[selectFrame].lineArr=calcArrLine(
                            frameArr[selectFrame].x+frameArr[selectFrame].width/2,
                            frameArr[selectFrame].y+frameArr[selectFrame].width/2,
                            frameArr[selectFrame].angleArr,
                            scaleFrameHuman)
            }
        }
        if (checkInObj(butShowFilm,mX,mY) && frameArr.length>1)
        {
            showFilm=!showFilm;
            butShowFilm.text=showFilm==true?'Stop':'Start';
        }
     
        
    }
   
 
    if (checkPressKey('ControlLeft') && checkMouseLeft() &&
            bufferDragCopy==null && showFilm==false)
    {
           // цикл по обходу кадров
        for (let i=0;i<frameArr.length;i++)
        {
            //если кликнули на конкретый кадр
            if (checkInObj(frameArr[i],mX,mY))
            {
                bufferDragCopy=JSON.parse(JSON.stringify(frameArr[i]));
                console.log(frameArr[i]);
                break;
                
            }  
        } 
      
        
    } 
    if (bufferDragCopy!=null)
    {
        //bufferDragCopy.x=mX        
        //bufferDragCopy.y=mY;
        bufferDragCopy.lineArr=calcArrLine(mX,mY,bufferDragCopy.angleArr,
                                            scaleFrameHuman);

    }
    if (checkPressKey('ControlLeft')==true &&
            checkMouseLeft()==false && bufferDragCopy!=null)
    {
               // цикл по обходу кадров
               
        for (let i=0;i<frameArr.length;i++)
        {
            //если указывает на конкретый кадр
            if (checkInObj(frameArr[i],mX,mY))
            {
               let oldX=frameArr[i].x;
               let oldY=frameArr[i].y;
               frameArr[i]=JSON.parse(JSON.stringify(bufferDragCopy)); 
               frameArr[i].x=i*frameArr[i].width;
               //frameArr[i].y=frameArr[i].y+frameArr[i].height/2;
               frameArr[i].lineArr=calcArrLine(frameArr[i].x+frameArr[i].width/2,
                                                frameArr[i].y+frameArr[i].width/2,
                                        frameArr[i].angleArr, scaleFrameHuman);
               //frameArr[i].y=i*frameArr[i].heigth;
               arrElemCopy(dataLine.angleArr,frameArr[i].angleArr);
               //console.log('IFIF');
               bufferDragCopy=null;
               break;
            }  
        } 
        //bufferDragCopy=null;
    }
    if(checkPressKey('ControlLeft')==false)
    {
        bufferDragCopy=null;
    }
  
    if ( showFilm==true /*|| checkPressKey("Space")*/)
    {
        
        
        let time2=new Date().getTime();
         
        
         time2=new Date().getTime();
         if (time2-time> delayFrame )
         {
            selectFrame++;
            selectFrame %= (frameArr.length);
            time=new Date().getTime();
         };
        
        arrElemCopy(dataLine.angleArr,frameArr[selectFrame].angleArr);
       
        
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
        case 3:case 4:case 7:case 8:case 9:
        {
           dataLine.angleArr[n]=angle; 
        }
        break;
    }
}
function downloadAsFile(data,nameFile)
{
  let a = document.createElement("a");
  let file = new Blob([data], {type: 'application/json'});
  a.href = URL.createObjectURL(file);
  a.download = nameFile+".txt";
  a.click();
}


