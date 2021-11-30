function stumpMotion(stump, target)
{
	var dx = target.x-stump.x;
	var dy = target.y-stump.y;
	var theta = Math.atan2(dy,dx);
	stump.vx = Math.cos(theta)* 2;
	stump.vy = Math.sin(theta)* 2;
}
function twoStumpCollision(stumpA, stumpB)
{
	var dx = stumpA.x - stumpB.x;
	var dy = stumpA.y - stumpB.y;
	var theta = Math.atan2(dy,dx);
	stumpA.vx = Math.cos(theta);
	stumpA.vy = Math.sin(theta);
	stumpB.vx = -stumpA.vx;
	stumpB.vy = -stumpA.vy;
}
function stumpCollision(stump, target)
{
	if(target.z <= stump.top().z + stump.zHeight/3)
	{
		target.z = stump.top().z;
		target.vx = (a||d)?target.vx:stump.vx;
		target.vy = (w||s)?target.vy:stump.vy;
	}
	else
	{
	if(target.vx * stump.vx < 0 || Math.abs(target.vx) < Math.abs(stump.vx))
		target.vx = stump.vx;
	if(target.vy * stump.vy < 0 || Math.abs(target.vy) < Math.abs(stump.vy))
		target.vy = stump.vy;
	}
}
