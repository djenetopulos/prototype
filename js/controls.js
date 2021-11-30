var w = false;
var a = false;
var s = false;
var d = false;
var q = false;
var atk = false;
var spacebar = false;
document.addEventListener("keydown", press);
document.addEventListener("keypress", hit);
document.addEventListener("keyup", release);

function hit(e)
{
	if(e.keyCode == 74)
	{
		atk = true;
		console.log("atk = ", atk);
	}
}

function press(e)
{
	//---This logs key codes into the browser's console.
	//console.log(e.keyCode);
	
	if(e.keyCode == 32)
	{
		spacebar = true;
	}
	if(e.keyCode == 81)
	{
		q = true;
	}
	if(e.keyCode == 87)
	{
		w = true;
	}
	if(e.keyCode == 65)
	{
		a = true;
	}
	if(e.keyCode == 83)
	{
		s = true;
	}
	if(e.keyCode == 68)
	{
		d = true;
	}
}

function release(e)
{
	//---This logs key codes into the browser's console.
	//console.log(e.keyCode);
	if(e.keyCode == 32)
	{
		spacebar = false;
	}
	if(e.keyCode == 81)
	{
		q = false;
	}
	if(e.keyCode == 87)
	{
		w = false;
	}
	if(e.keyCode == 65)
	{
		a = false;
	}
	if(e.keyCode == 83)
	{
		s = false;
	}
	if(e.keyCode == 68)
	{
		d = false;
	}
}
