var canvas;
var context;
var timer;
var interval;
var player;
var pause;

	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	var enemyCount = 4;
	var drawCount = 5;
	player = new GameObject({x:canvas.width/2, y:canvas.height/2, z:-canvas.height, width:48, height:36, zHeight:64, color:"#333333", topColor:"#444444"});
	enemy = [new GameObject({x:100, y:100, z:-canvas.height*2, width:64, height:48, zHeight:48, color:"#442200", topColor:"#553311", jumpOnMe:true}),
			 new GameObject({x:canvas.width-100, y:100, z:-canvas.height*2, width:64, height:48, zHeight:48, color:"#442200", topColor:"#553311", jumpOnMe:true}),
			 new GameObject({x:canvas.width-100, y:canvas.height-100, z:-canvas.height*2, width:64, height:48, zHeight:48, color:"#442200", topColor:"#553311", jumpOnMe:true}),
			 new GameObject({x:100, y:canvas.height-100, z:-canvas.height*2, width:64, height:48, zHeight:48, color:"#442200", topColor:"#553311", jumpOnMe:true})];
	drawOrder = [player, enemy[0], enemy[1], enemy[2], enemy[3]];
	//goal =   new GameObject({width:24, height:50, x:canvas.width-50, y:100, color:"#00ffff"});
	
	var fX = .85;
	var fY = .85;
	var gravity = 1;
	var friction = 1;
	var grounded = false;
	interval = 1000/60;
	timer = setInterval(animate, interval);
	var cd = 0;
	var menu = [new GameObject({width:48, height:48, color:"#0000ff"}),
				new GameObject({width:48, height:48, color:"#00ffff"}),
				new GameObject({width:48, height:48, color:"#00ff00"}),
				new GameObject({width:48, height:48, color:"#ffff00"}),
				new GameObject({width:48, height:48, color:"#ff0000"}),
				new GameObject({width:48, height:48, color:"#ff00ff"})];
	var menuBox = new GameObject({width:52, height:52, color:"#ffffff"});
	var menuItemMaxDist = 100;
	var menuAngleOffset = -90;
	var menuSwitch = 0;
	
	var menuSound = document.getElementById("menuSound");
	menuSound.controls = false;
	menuSound.volume = .4;
	var menuSound2 = document.getElementById("menuSound2");
	menuSound2.controls = false;
	menuSound2.volume = .4;
	var landingSound = document.getElementById("landingSound");
	landingSound.controls = false;
	landingSound.volume = .4;
	var jumpSound = document.getElementById("jumpSound");
	jumpSound.controls = false;
	jumpSound.volume = .4;

function menuDisplay()
{
	menuBox.x = player.x;
	menuBox.y = player.y + player.z - menuItemMaxDist;
	menuBox.drawRect();
	var r = Math.min(menuItemMaxDist - (cd*5),menuItemMaxDist);
	for(item = 0; item < menu.length; item++)
	{
		var theta = ((360/menu.length)*item + menuAngleOffset) * Math.PI/180;
		//polar: r(Cos@ + Sin@)
		menu[item].x = player.x + r * (Math.cos(theta));
		menu[item].y = player.y + player.z + r * (Math.sin(theta));
		menu[item].drawRect();
	}
	
}

function menuControls()
{
	menuSwitch = (a&&!d)?-3:(d&&!a)?3:menuSwitch;
		menuAngleOffset += menuSwitch;
		if((menuAngleOffset+90) % (360/menu.length) == 0)
		{
			if(menuSwitch > 0)
			{
				menuSwitch = 0;
				menuSound.play();
			}
			if(menuSwitch < 0)
			{
				menuSwitch = 0;
				menuSound2.play();
			}
		}
}

function playerControls(state)
{
	switch(state)
	{
		case 0://grounded
		player.vx *= fX;
		player.vy *= fY;
		if(player.vz != 0)
		{
			player.vz = 0;
		}
		if(w)
		{	player.vy += -player.ay * player.force;	}
		if(s)
		{	player.vy += player.ay * player.force;	}
		if(a)
		{	player.vx += -player.ax * player.force;	}
		if(d)
		{	player.vx += player.ax * player.force;	}
		if(spacebar)
		{
			player.vz += player.jumpHeight;
			if(cd <= 0)
				jumpSound.play();
			player.currentState = 1;
			break;
		}
		if(atk)
		{
			//attackSound.play();
			player.currentState = 2;
		}
		stillGrounded = false;
		if(player.z >= 0)
		{
			player.z = 0;
			stillGrounded = true;
		}
		
		if(!stillGrounded)
		{
			for(i=0;i<enemyCount;i++)
			{
				if(enemy[i].HP <= 0)
					continue;
				if(player.onTopOf(enemy[i]))
				{
					player.z = enemy[i].top().z;
					stillGrounded = true;
					break;
				}
			}
		}
		if(!stillGrounded)
		{
			player.currentState = 1;
		}

		break;
		case 1://jumping
		if(player.z > 0)
		{
			if(cd <= 0)
				landingSound.play();
			player.z = 0;
			player.currentState = 0;
			break;
		}
		for(i = 0; i < enemyCount; i++)
		{
			if(enemy[i].HP <= 0)
				continue;
			if(player.onTopOf(enemy[i]))
			{
				landingSound.play();
				cd=3;
				player.z = enemy[i].top().z;
				player.currentState = 0;
				break;
			}
		}
		player.vz += gravity;
		break;
		case 2://grounded attack
		player.hitTimer++;
		player.drawAttack();
		
		for(i = 0; i< enemyCount; i++)
		{
			if(player.hitTestArc(enemy[i]))
			{
				player.Hit(enemy[i]);
			}
		}
		
		if(player.hitTimer >= player.attackTime)
		{
			console.log("start: ", player.attackStart(), ", end: ", player.attackEnd());
			atk = false;
			player.currentState = 0;
			player.hitTimer = 0;
		}
		break;
		case 3://jumping attack
		break;
	}
}

function DrawOrder()
{
	for(i=1;i<drawCount;i++)
	{
		if(drawOrder[i-1].z <= drawOrder[i].top().z || (drawOrder[i-1].y > drawOrder[i].y && !(drawOrder[i-1].top().z >= drawOrder[i].z)))
		{
			reorderDraw(i-1,i);
		}
	}
}

function reorderDraw(prev, next)
{
  drawOrder.splice(next, 0, drawOrder.splice(prev, 1)[0]);
}

function animate()
{
	
	context.clearRect(0,0,canvas.width, canvas.height);
	cd--;
	
	if(pause)
	{
		if(q && cd <= 0)
		{
			pause = false;
			cd = 20;
		}
	}
	
	else
	{
		if(q && cd <= 0)
		{
			pause = true;
			cd = 20;
		}
		playerControls(player.currentState);
		for(i=0;i<enemyCount;i++)
		{
			if(enemy[i].HP <= 0)
			{
				continue;
			}
			enemy[i].vz += gravity;
			
			if(enemy[i].z > 0)
			{
				enemy[i].vz = 0;
				enemy[i].z = 0;
			}

			if(cd%3==0)
			{
				stumpMotion(enemy[i], player);
			}

			for(j=i+1;j<enemyCount;j++)
			{
				if(enemy[j].HP <= 0)
					continue;
				if(enemy[i].hitTestObject(enemy[j]))
				{
					twoStumpCollision(enemy[i], enemy[j]);
				}
			}
			enemy[i].move();

			if(enemy[i].hitTestObject(player))
			{
				stumpCollision(enemy[i], player);
				console.log(player.onTopOf(enemy[i]));
			}
		}
		player.move();
	}
	
	DrawOrder();
	
	for(i=drawCount;i>0;i--)
	{
		//if(drawOrder[i-1].HP > 0)
			drawOrder[i-1].drawShadow();
	}
	
	for(i=0;i<drawCount;i++)
	{
		if(drawOrder[i].HP > 0)
			drawOrder[i].drawCube();
	}
	
	if(pause)
	{
		menuControls();
		menuDisplay();
	}
	
	player.drawDebug();
	
}