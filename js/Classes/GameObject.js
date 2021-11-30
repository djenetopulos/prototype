
function GameObject(obj)
{	
	this.x = canvas.width/2;
	this.y = canvas.height/2;
	this.z = 0;
	
	this.width = 100;
	this.height = 100;
	this.zHeight = 100;
	this.color = "#ff0000";
	this.topColor = "#bb0000";
	this.force = 1;
	
	this.ax = 1;
	this.ay = 1;
	this.az = 1;
	
	this.vx = 0;
	this.vy = 0;
	this.vz = 0;
	
	this.facing = 0;
	this.sprinting = false;
	this.jumpOnMe = false;
	this.canJump = false;
	
	this.jumpHeight = -15;
	this.attackRange = 100;
	this.attackArc = 90;
	this.attackTime = 10;
	this.attackColor = "#553333";
	this.hitColor = "882222";
	this.hitTimer = 0;
	this.atkDmg = 10;
	this.HP = 100;
	this.currentState = 1;
	this.knockback = 50;
	
	
	//------Allows us to pass object literals into the class to define its properties--------//
		//------This eliminate the need to pass in the property arguments in a specific order------------//
		if(obj!== undefined)
		{
			for(value in obj)
			{
				if(this[value]!== undefined)
				{
					this[value] = obj[value];
				}
			}
		}
		
	this.drawRect = function()
	{
		context.save();
			context.fillStyle = this.color;
			context.translate(this.x, this.y + this.z);
			context.fillRect((-this.width/2), (-this.height/2), this.width, this.height);
		context.restore();
	
	}

	this.drawCube = function()
    {
        context.save();
            context.fillStyle = this.color;
            context.translate(this.x, this.y + this.z);
            context.fillRect((-this.width/2), (-this.zHeight/2), this.width, this.zHeight);
            context.fillStyle = this.topColor;
            context.fillRect((-this.width/2), (-this.zHeight/2), this.width, -this.height);    
        context.restore();
    }
	
	this.drawCylinder = function()
	{
		context.save();
            context.fillStyle = this.color;
            context.translate(this.x, this.y + this.z);
            context.fillRect((-this.width/2), (-this.zHeight/2), this.width, this.zHeight);
            context.fillStyle = this.topColor;
            context.fillRect((-this.width/2), (-this.zHeight/2), this.width, -this.height);    
        context.restore();
	}

	
	this.drawCircle = function()
	{
		context.save();
			context.fillStyle = this.color;
			context.beginPath();
			context.translate(this.x, this.y);
			context.arc(0, 0, this.radius(), 0, 2*Math.PI, true);
			context.closePath();
			context.fill();
		context.restore();
	}
	
	this.drawAttack = function()
	{
		//console.log("Facing", this.facing(), "Range", this.attackRange, "Arc", this.attackArc, "Color", this.attackColor);
		context.save();
			context.strokeStyle = this.attackColor;
			context.beginPath();
			context.translate(this.x, this.y + this.z - this.zHeight/2);
			context.arc(0,0,this.attackRange,this.attackStart(),this.attackEnd(), false);
			context.lineTo(0,0);
			context.closePath();
			context.fill();
		context.restore();
		
	}
	
	this.shadowColor = function()
	{
		return ((this.HP <= 0)?"#cc1111":(this.z > -25)?"#666666":(this.z>-50)?"#777777":(this.z>-75)?"#888888":"#999999");
	}
	
	this.drawShadow = function()
	{
		context.save();
			context.fillStyle = this.shadowColor();
			context.beginPath();
			context.translate(this.x, this.y);
			context.arc(0, 0, Math.max(this.width *(1-this.z)/100, this.width*2/3), 0, 2*Math.PI, true);
			context.closePath();
			context.fill();
		context.restore();
	}
	
	this.move = function()
	{
		this.x += Math.round(this.vx);
		this.y += Math.round(this.vy);
		this.z += Math.round(this.vz);
	}
	this.facing = function()
	{
		return (Math.atan2(this.vy,this.vx)*180/Math.PI);
	}
	//---------Returns object's for the top, bottom, left and right of an object's bounding box.
	this.left = function() 
	{
		return {x:this.x - this.width/2 , y:this.y, z:this.z};
	}
	this.right = function() 
	{
		return {x:this.x + this.width/2 , y:this.y, z:this.z};
	}
	this.back = function() 
	{
		return {x:this.x, y:this.y - this.height/2, z:this.z};
	}
	this.front = function()
	{
		return {x:this.x, y:this.y + this.height/2, z:this.z};
	}
	this.bottom = function()
	{
		return {x:this.x, y:this.y, z:this.z};
	}
	this.top = function()
	{
		return {x:this.x, y:this.y, z:this.z - this.zHeight};
	}
	this.attackStart = function()
	{
		return (this.facing() - this.attackArc/2)*Math.PI/180;
	}
	this.attackEnd = function()
	{
		return this.attackStart() + (this.attackArc*Math.PI/180)*(this.hitTimer/this.attackTime);
	}
	
	this.distanceTo = function(obj)
	{
		var dx = obj.x - this.x;
		var dy = obj.y - this.y;
		return Math.sqrt(dx*dx + dy*dy);
	}
	
	this.angleTo = function(obj)
	{
		var dx = obj.x - this.x;
		var dy = obj.y - this.y;
		return Math.atan2(dy,dx);
	}
	
	this.hitTestObject = function(obj)
	{
		if(this.left().x <= obj.right().x && 
		   this.right().x >= obj.left().x &&
		   this.back().y <= obj.front().y &&
		   this.front().y >= obj.back().y &&
		   this.top().z <= obj.bottom().z &&
		   this.bottom().z >= obj.top().z)
		{
			return true;
		}
		return false;
	}
	
	this.onTopOf = function(obj)
	{
		if(this.left().x <= obj.right().x
		&& this.right().x >= obj.left().x
		&& this.back().y <= obj.front().y
		&& this.front().y >= obj.back().y
		&& this.bottom().z >= obj.top().z
		&& this.bottom().z <= obj.top().z + obj.zHeight/3)
		{
			return true;
		}
		return false;
	}
	this.Hit = function(obj)
	{
		obj.vx = this.knockback * Math.cos(this.angleTo(obj));
		obj.vy = this.knockback * Math.sin(this.angleTo(obj));
		obj.HP -= 10;
	}
	
	
	//------Tests whether a single point overlaps the bounding box of another object-------
	this.hitTestPoint = function(obj)
	{
		if(obj.x >= this.left().x && 
		   obj.x <= this.right().x &&
		   obj.y >= this.back().y &&  
		   obj.y <= this.front().y &&
		   obj.z >= this.top().z &&
		   obj.z <= this.bottom().z)
		{	return true;}
		return false;
	}
	
	this.hitTestArc = function(obj)
	{
		if(this.distanceTo(obj) <= this.attackRange)
		{
			var angleTo = this.angleTo(obj);
			angleTo = (angleTo > 2*Math.PI) ? angleTo - 2*Math.PI : (angleTo < 0) ? angleTo + 2*Math.PI : angleTo;
			var atkStart = this.attackStart();
			var atkEnd = this.attackEnd();
			if(atkStart < 0)
			{
				atkStart += 2*Math.PI;
				atkEnd += 2*Math.PI;
			}
			if(atkEnd > 2*Math.PI)
			{
				atkStart -= 2*Math.PI;
				atkEnd -= 2*Math.PI;
			}
			
			if(angleTo >= atkStart && angleTo <= atkEnd)
				return true;
		}
		return false;
	}
	
	this.hitTestCircle = function(obj)
	{
		if(this.distanceTo(obj) <= this.attackRange)
			return true;
		return false;
	}
	
	/*-----Sets or gets the radius value--------*/
	this.radius = function(newRadius)
	{
		return this.width*2/3;
	}
	
	//Draws the collision points
	this.drawDebug = function()
	{
		var size = 5;
		context.save();
		context.fillStyle = "red";
		context.fillRect(this.left().x-size/2, this.left().y-size/2 + this.z, size, size);
		context.fillRect(this.right().x-size/2, this.right().y-size/2 + this.z, size, size);
		context.fillRect(this.back().x-size/2, this.back().y-size/2 + this.z, size, size);
		context.fillRect(this.front().x-size/2, this.front().y-size/2 + this.z, size, size);
		context.fillRect(this.x-size/2, this.y-size/2 + this.z, size, size);
		context.restore();
	}
}
