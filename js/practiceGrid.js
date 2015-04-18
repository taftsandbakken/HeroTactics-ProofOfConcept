var gameReady = true;
var heroAttacking = false;
var tileClickedLast = null;

var gridSizeX = 36;
var gridSizeY = 16;
var tileArray;
var tileSize = 38;

var heroArray;
var enemyArray;

var knightImageSmall;
var knightImageBig;
var archerImageSmall;
var archerImageBig;
var mageImageSmall;
var darkKnightImageSmall;
var darkKnightImageBig;

var unitTurnOrder;
var unitTurnIndex;

var canvas;
var ctx;

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// Game Logic //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function(){
	checkToMakeSureUserCanUseCanvas();

	// basic set up
	loadPics();
	setListener();
});

function checkToMakeSureUserCanUseCanvas(){
	//checking to make sure canvas supports the browser the user is using. It won't show the start button unless canvas is supported
	canvas = document.getElementById('canvas');
	if (canvas.getContext){
		ctx = canvas.getContext('2d');
		$("#startButton").removeClass("hidden");
	}
	else{
		window.alert("Your browser does not support Hero Tactics. Please try again after updating your browser or opening this game in Chrome, Firefox or Safari or by .");
	}
}

function loadPics(){
	knightImageSmall = new Image();
	knightImageSmall.src = "images/knightSmall.png";
	knightImageBig = new Image();
	knightImageBig.src = "images/knightBig.png";

	archerImageSmall = new Image();
	archerImageSmall.src = "images/archerSmall.png";
	archerImageBig = new Image();
	archerImageBig.src = "images/archerBig.png";

	mageImageSmall = new Image();
	mageImageSmall.src = "images/mageSmall.png";

	darkKnightImageSmall = new Image();
	darkKnightImageSmall.src = "images/dark_knight2Small.png";
	darkKnightImageBig = new Image();
	darkKnightImageBig.src = "images/dark_knight2Big.png";
}

function startGame(){
  	$("#startButton").addClass("hidden");
	$("#mainMenuButton").removeClass("hidden");
	loadLevel();
}

function goToMainMenu(){
	if(gameReady){
		var answer = confirm("Are you sure you want to go back to the main menu? You will lose any data you didn't save.")
		if(!answer)
			return;
	}
	window.location="index.html";
}

function help(){
	var message = "Welcome to the Hero Tactics demo.\n\n";
	message += "You control the knights on the bottom, and you need to defeat the monsters on the top of the screen.\n\n";
	message += "The different units have different stats. To see the stats of a unit, click once on them.\n\n";
	message += "Your knight will be highlighted in green when it is its turn. Move him by double clicking the tile highlighted in yellow that you want to move to. The gray tiles are obstacles.\n\n";
	message += "When you can attack a monster, he will be hightlighted in red. Double click on him, then on the square that you want to attack from or press Esc if you want to deselect the enemy.\n\n";
	message += "If you want a unit to pass its move, then press spacebar, which will move him to the end of the turn queue.\n\n";
	message += "Good luck!\n";
	alert(message);
}

function loadLevel(){
	loadTiles();
	loadHeroes();
	loadEnemies();

	setNewRound();
}

function loadTiles(){
	tileArray = new Array();
	for(var y = 0; y < gridSizeY; y++){
		tileArray[y] = new Array();
		for(var x = 0; x < gridSizeX; x++){
			var random = Math.floor(Math.random()*5);
			if(random == 0 && y != 0 && y != gridSizeY-1)
				tileArray[y][x] = new Tile("wall", false, x*tileSize, y*tileSize);
			else
				tileArray[y][x] = new Tile("ground", true, x*tileSize, y*tileSize);
			//$divTemp.attr('onmousedown', 'divPressed(this)');
			//$('#canvas').append(divTemp);
		}
	}
}

function loadHeroes(){
	heroArray = new Array();
	for(var i = 0; i < 3; i++){
		var newArcher = new Archer();
		heroArray[i] = new Unit(newArcher, "Ally", (i+3)*tileSize, (gridSizeY-1)*tileSize);
		tileArray[gridSizeY-1][i+3].occupied = true;
	}
	for(i = heroArray.length; i < 6; i++){
		var newKnight = new Knight();
		heroArray[i] = new Unit(newKnight, "Ally", (i+3)*tileSize, (gridSizeY-1)*tileSize);
		tileArray[gridSizeY-1][i+3].occupied = true;
	}
}

function loadEnemies(){
	enemyArray = new Array();
	for(var i = 0; i < 6; i++){
		var newDark_Knight = new Dark_Knight();
		enemyArray[i] = new Unit(newDark_Knight, "Enemy", (i+8)*tileSize, 0);
		tileArray[0][i+8].occupied = true;
	}
	for(i = enemyArray.length; i < 8; i++){
		var newArcher = new Archer();
		enemyArray[i] = new Unit(newArcher, "Enemy", (i+8)*tileSize, 0);
		tileArray[0][i+8].occupied = true;
	}
}

function setNewRound(){
	console.log("New Round");
	unitTurnOrder = new Array();
	unitTurnIndex = 0;
	setUnitTurnOrder();
	startTurn(unitTurnOrder[unitTurnIndex]);
	drawAll();
}

function setUnitTurnOrder(){
	for(var i = 0; i < heroArray.length; i++){
		//heroArray[i].orderOfPrecedence = i;
		heroArray[i].passedTurn = false;
		unitTurnOrder[i] = heroArray[i];
	}
	for(var i = 0; i < enemyArray.length; i++){
		//enemyArray[i].orderOfPrecedence = i + heroArray.length-1;
		enemyArray[i].passedTurn = false;
		unitTurnOrder[i+heroArray.length] = enemyArray[i];
	}
	//console.log("turn order: ", unitTurnOrder);
}

function checkForIsEndOfBattle(){
	if(enemyArray.length == 0){
		console.log("we win!");
		endOfBattleWin();
	}
	else if(heroArray.length == 0){
		console.log("we lost!");
		endOfBattleLose();
	}
}

function endOfBattleWin(){
	setAllTilesToBeInvalidMoves();
	drawAll();
	gameReady = false;
	console.log("The End!");
	alert("You Win!");
}

function endOfBattleLose(){
	setAllTilesToBeInvalidMoves();
	drawAll();
	gameReady = false;
	console.log("The End!");
	alert("You Lose!");
}

function startTurn(unit){
	setAllTilesToBeInvalidMoves();
	setValidMoves(unit);
	if(unitTurnOrder[unitTurnIndex].range > 1)
		find
	if(unit.side == "Ally")
		displayValidMoves();
	else if(unit.side == "Enemy")
		moveEnemyUnit(unit);
		
}

function endOfTurn(){
	heroAttacking = false;
	drawAll();
	unitTurnIndex++;

	checkForIsEndOfBattle();
	
	if(gameReady){
		if(unitTurnIndex < unitTurnOrder.length){
			startTurn(unitTurnOrder[unitTurnIndex]);
		}
		else{
			setNewRound();
		}
	}
}

function displayValidMoves(){
	drawAll();
}

function setAllTilesToBeInvalidMoves(){
	for(var i = 0; i < tileArray.length; i++){
		for(var j = 0; j < tileArray[i].length; j++){
			tileArray[i][j].validMove = false;
			tileArray[i][j].validAtk = false;
		}
	}
}

function moveEnemyUnit(unit){
	//check for good guys it can attack, chooses the one that has the lowest health
	var heroToAttack = null;
	for(var i = 0; i < heroArray.length; i++){
		if(tileArray[heroArray[i].tileRow][heroArray[i].tileColumn].validAtk)
			if(heroToAttack == null || heroArray[i].health < heroToAttack.health)
				heroToAttack = heroArray[i];
	}
	if(heroToAttack != null){
		setTilesToAttackFrom(heroToAttack.tileRow, heroToAttack.tileColumn);
		var tileToMoveTo = findFirstAvailableTileToMoveTo();
		if(unit.ranged == 1)
			unit.move(tileToMoveTo.y, tileToMoveTo.x);
		attackUnit();
	}
	else{		// if none are close enough, just find closest hero and move towards it
		var closestHero = findClosestGoodGuy();
		var tileToMoveTo = findClosestTileToHero(closestHero);
		if(tileToMoveTo.y != -1 && tileToMoveTo.x != -1)
			unit.move(tileToMoveTo.y, tileToMoveTo.x);
	}

	endOfTurn();
}

function findFirstAvailableTileToMoveTo(){
	for(var i = 0; i < tileArray.length; i++){
		for(var j = 0; j < tileArray[i].length; j++){
			if(tileArray[i][j].validMove)
				return {y:i,x:j};
		}
	}
	return null;
}

function findClosestGoodGuy(){
	var heroToAttack = null;
	var closestDistance = -1;
	for(var i = 0; i < heroArray.length; i++){
		var y = heroArray[i].y - unitTurnOrder[unitTurnIndex].y;
		var x = heroArray[i].x - unitTurnOrder[unitTurnIndex].x;
		var distance = Math.sqrt((y*y) + (x*x));
		if(closestDistance == -1 || distance < closestDistance){
			closestDistance = distance;
			heroToAttack = heroArray[i];
		}
	}
	return heroToAttack;
}

function findClosestTileToHero(closestHero){
	var row = -1;
	var column = -1;
	var closestDistance = -1;
	for(var i = 0; i < tileArray.length; i++){
		for(var j = 0; j < tileArray[i].length; j++){
			if(tileArray[i][j].validMove){
				var y = closestHero.y - tileArray[i][j].y;
				var x = closestHero.x - tileArray[i][j].x;
				var distance = Math.sqrt((y*y) + (x*x));
				if(closestDistance == -1 || distance < closestDistance){
					closestDistance = distance;
					row = i;
					column = j;
				}
			}
		}
	}
	return {y:row, x:column};
}

function setValidMoves(unit){
	//basically just making a recursive call. the other lines are just to make the recursion work.
	tileArray[unit.tileRow][unit.tileColumn].occupied = false;
	//var distanceLeft = unit.speed;
	findValidMoveRecursion(tileArray[unit.tileRow][unit.tileColumn], unit.tileRow, unit.tileColumn, 0);

	tileArray[unit.tileRow][unit.tileColumn].validMove = false;
	tileArray[unit.tileRow][unit.tileColumn].occupied = true;
}

function findValidMoveRecursion(tile, row, column, distance){
	if(distance > unitTurnOrder[unitTurnIndex].speed || !tile.passable || tile.occupied){
		if(tile.occupied){
			if(unitTurnOrder[unitTurnIndex].side == "Ally" && tileHasBadGuy(row, column)){
				tile.validAtk = true;
			}
			if(unitTurnOrder[unitTurnIndex].side == "Enemy" && tileHasGoodGuy(row, column))
				tile.validAtk = true;
		}
		//keep expanding search if it is a ranged unit
		if(unitTurnOrder[unitTurnIndex].ammoLeft != "-"){
			var rangedDistanceLeft = unitTurnOrder[unitTurnIndex].range - distance;
			if(rangedDistanceLeft < 1)
				return;
		}
		else
			return;
	}
	if(distance <= unitTurnOrder[unitTurnIndex].speed && !tile.occupied && tile.passable)
		tile.validMove = true;
	// go up
	if(row-1 >= 0)
		findValidMoveRecursion(tileArray[row-1][column], row-1, column, distance+1);
	// go right
	if(column+1 < gridSizeX)
		findValidMoveRecursion(tileArray[row][column+1], row, column+1, distance+1);
	// go down
	if(row+1 < gridSizeY)
		findValidMoveRecursion(tileArray[row+1][column], row+1, column, distance+1);
	// go left
	if(column-1 >= 0)
		findValidMoveRecursion(tileArray[row][column-1], row, column-1, distance+1);
	
	// check for if it can check diagonals. //commented out because it was preventing units from attacking diagonally when at edge of movement radius
	//if(distanceLeft >= 1.5){
		// go up right
		if(row-1 >= 0 && column+1 < gridSizeX)
			if((!tileArray[row-1][column].occupied && tileArray[row-1][column].passable) || (!tileArray[row][column+1].occupied && tileArray[row][column+1].passable))
				findValidMoveRecursion(tileArray[row-1][column+1], row-1, column+1, distance+1.5);
		// go bottom right 
		if(row+1 < gridSizeY && column+1 < gridSizeX)
			if((!tileArray[row+1][column].occupied && tileArray[row+1][column].passable) || (!tileArray[row][column+1].occupied && tileArray[row][column+1].passable))
				findValidMoveRecursion(tileArray[row+1][column+1], row+1, column+1, distance+1.5);
		// go bottom left
		if(row+1 < gridSizeY && column-1 >= 0)
			if((!tileArray[row+1][column].occupied && tileArray[row+1][column].passable) || (!tileArray[row][column-1].occupied && tileArray[row][column-1].passable))
				findValidMoveRecursion(tileArray[row+1][column-1], row+1, column-1, distance+1.5);
		// go up left
		if(row-1 >= 0 && column-1 >= 0)
			if((!tileArray[row-1][column].occupied && tileArray[row-1][column].passable) || (!tileArray[row][column-1].occupied && tileArray[row][column-1].passable))
				findValidMoveRecursion(tileArray[row-1][column-1], row-1, column-1, distance+1.5);
	//}
}

function tileHasBadGuy(row, column){
	for(var i = 0; i < enemyArray.length; i++){
		if(enemyArray[i].tileRow == row && enemyArray[i].tileColumn == column)
			return true;
	}
	return false;
}

function tileHasGoodGuy(row, column){
	for(var i = 0; i < heroArray.length; i++){
		if(heroArray[i].tileRow == row && heroArray[i].tileColumn == column)
			return true;
	}
	return false;
}

function setTilesToAttackFrom(tileRow, tileColumn){
	var validTilesToAttackFrom = new Array();
	for(var i = tileRow-1; i <= tileRow+1; i++){
		for(var j = tileColumn-1; j <= tileColumn+1; j++){
			if(i >= 0 && j >=0 && i < gridSizeY && j < gridSizeX){
				if(tileArray[i][j].validMove)
					validTilesToAttackFrom.push(tileArray[i][j]);
				else if(unitTurnOrder[unitTurnIndex].tileRow == i && unitTurnOrder[unitTurnIndex].tileColumn == j){
					validTilesToAttackFrom.push(tileArray[i][j]);
				}
			}
		}
	}
	setAllTilesToBeInvalidMoves();
	for(var i = 0; i < validTilesToAttackFrom.length; i++){
		validTilesToAttackFrom[i].validMove = true;
	}
	tileArray[tileRow][tileColumn].validAtk = true;
	drawAll();
}

function attackUnit(){
	var unitUnderAttack = findUnitUnderAtk();
	calcDamage(unitTurnOrder[unitTurnIndex], unitUnderAttack);
}

function findUnitUnderAtk(){
	for(var i = 0; i < heroArray.length; i++){
		if(tileArray[heroArray[i].tileRow][heroArray[i].tileColumn].validAtk){
			return heroArray[i];
		}
	}
	for(var i = 0; i < enemyArray.length; i++){
		if(tileArray[enemyArray[i].tileRow][enemyArray[i].tileColumn].validAtk){
			return enemyArray[i];
		}
	}
	return null;
}

function calcDamage(unitAttacking, unitUnderAttack){
	//console.log("attacking! ", unitUnderAttack.health, unitAttacking.attack);
	unitUnderAttack.health -= unitAttacking.attack;
	updateUnits();
	//console.log("attacked! ", unitUnderAttack.health);
}

function updateUnits(){
	var newUnitTurnOrder = new Array();
	var newHeroArray = new Array();
	var newEnemyArray = new Array();
	for(var i = 0; i < unitTurnOrder.length; i++){
		if(unitTurnOrder[i].health > 0){
			newUnitTurnOrder.push(unitTurnOrder[i]);
		}
		else if(i < unitTurnIndex)
			unitTurnIndex--;
	}
	for(var i = 0; i < heroArray.length; i++){
		if(heroArray[i].health > 0){
			newHeroArray.push(heroArray[i]);
		}
		else
			tileArray[heroArray[i].tileRow][heroArray[i].tileColumn].occupied = false;
	}
	for(var i = 0; i < enemyArray.length; i++){
		if(enemyArray[i].health > 0){
			newEnemyArray.push(enemyArray[i]);
		}
		else
			tileArray[enemyArray[i].tileRow][enemyArray[i].tileColumn].occupied = false;
	}
	unitTurnOrder = newUnitTurnOrder;
	heroArray = newHeroArray;
	enemyArray = newEnemyArray;
}

function findUnitToDisplayStatsOf(tileRow, tileColumn){
	for(var i = 0; i < heroArray.length; i++){
		if(heroArray[i].tileRow == tileRow && heroArray[i].tileColumn == tileColumn){
			displayUnitStats(heroArray[i], i);
			return;
		}
	}
	for(var i = 0; i < enemyArray.length; i++){
		if(enemyArray[i].tileRow == tileRow && enemyArray[i].tileColumn == tileColumn){
			displayUnitStats(enemyArray[i], i);
			return;
		}
	}
}

function displayUnitStats(unit, unitIndex){
	var message = "";
	message += unit.side + "<br/>";
	message += "Class: " + unit.nameOfClass + "<br/>";
	message += "Attack: " + unit.attack + "<br/>";
	message += "Defense: " + unit.defense + "<br>";
	message += "Health: " + unit.health + "<br/>";
	message += "Speed: " + unit.speed + "<br/>";
	message += "Range: " + unit.range + "<br/>";
	message += "Ammo Left: " + unit.ammoLeft + "<br/>";

	$("#statsDiv").html(message);
}

function drawAll(){
	for(var i = 0; i < tileArray.length; i++){
		for(var j = 0; j < tileArray[i].length; j++){
			tileArray[i][j].draw();
		}
	}
	for(var i = 0; i < heroArray.length; i++){
		heroArray[i].draw();
	}
	for(var i = 0; i < enemyArray.length; i++){
		enemyArray[i].draw();
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// Classes /////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

function Tile(type, passable, x, y){
	this.type = type;
	this.passable = passable;
	this.occupied = false;
	this.x = x;		//columns
	this.y = y;		//rows 
	this.validMove = false;
	this.validAtk = false;
	var tileHeight = tileSize;
	var tileWidth = tileSize;
	this.clickedOnce = false;

	this.draw = function(){
		ctx.beginPath();
		if(this.type == "ground")
			ctx.fillStyle = "tan";
		else if(this.type == "wall")
			ctx.fillStyle = "gray";
		
		ctx.strokeStyle = "black";
		if(this.validMove){
			ctx.lineWidth = 2;
			ctx.fillStyle = "yellow";
		}
		else if(this.validAtk){
			ctx.lineWidth = 2;
			ctx.fillStyle = "red";
		}
		else if(unitTurnOrder[unitTurnIndex].x == this.x && unitTurnOrder[unitTurnIndex].y == this.y){
			ctx.fillStyle = "green";
		}
		else{
			ctx.lineWidth = 1;
		}
		ctx.fillRect(this.x,this.y,tileHeight,tileWidth);
		ctx.fill();
		ctx.strokeRect(this.x,this.y,tileHeight,tileWidth);
		ctx.stroke();
	}

	this.isValidMove = function(x,y){
		return this.validMove;
	}
}

// the unit class that all units are made from
function Unit(newClass, side, x, y){
	this.nameOfClass = newClass.nameOfClass;	//ex: ninja, knight
	this.attack = newClass.attack;
	this.defense = newClass.defense;
	this.health = newClass.health;
	this.speed = newClass.speed;
	this.range = newClass.range;
	this.ammoLeft = newClass.ammoLeft;
	this.mp = newClass.mp;
	this.sight = newClass.sight;
	this.side = side;	//which side they are on

	this.x = x;			//pixel locations
	this.y = y;
	this.tileRow = Math.floor(this.y/tileSize);		//coordinates in tileArray[][]
	this.tileColumn = Math.floor(this.x/tileSize);

	this.orderOfPrecedence;
	this.passedTurn = false;		//a flag for if the user passed this unit's turn
	
	this.draw = function(){
		ctx.beginPath();
		ctx.drawImage(newClass.smallImage,this.x,this.y,tileSize,tileSize);
		//if(this.type == "knight")
			//ctx.fillStyle = ;
	}

	this.move = function(tileRow, tileColumn){
		tileArray[this.tileRow][this.tileColumn].occupied = false;
		tileArray[tileRow][tileColumn].occupied = true;
		this.tileRow = tileRow;
		this.tileColumn = tileColumn;
		this.x = tileColumn*tileSize;
		this.y = tileRow*tileSize;
	}
}

// unit classes 

function Knight(){
	this.nameOfClass = "Knight";
	this.attack = 10;
	this.defense = 10;
	this.health = 100;
	this.speed = 5;
	this.range = 1;
	this.ammoLeft = "-";
	this.mp = 40;
	this.sight = 7;
	this.smallImage = knightImageSmall;
}

function Archer(){
	this.nameOfClass = "Archer";
	this.attack = 8;
	this.defense = 5;
	this.health = 45;
	this.speed = 3;
	this.range = 8;
	this.ammoLeft = 12;
	this.mp = 60;
	this.sight = 10;
	this.smallImage = archerImageSmall;
}

function Mage(){
	this.nameOfClass = "Mage";
	this.attack = 3;
	this.defense = 4;
	this.health = 30;
	this.speed = 4;
	this.range = 7;
	this.ammoLeft = "-";
	this.mp = 90;
	this.sight = 6;
	this.smallImage = mageImageSmall;
}

function Dark_Knight(){
	this.nameOfClass = "Dark_Knight";
	this.attack = 6;
	this.defense = 3;
	this.health = 50;
	this.speed = 3;
	this.range = 1;
	this.ammoLeft = "-";
	this.mp = 15;
	this.sight = 7;
	this.smallImage = darkKnightImageSmall;
}



//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// Listeners ///////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function setListener(){
	canvas.addEventListener('click', function(evt) {
		if(gameReady){
			var mousePos = getMousePos(canvas, evt);
			checkMousePos(mousePos);
		}
	}, false);
}

function checkMousePos(mousePos){
	var tileRow = Math.floor(mousePos.y/tileSize);
	var tileColumn = Math.floor(mousePos.x/tileSize);
	if(tileArray[tileRow][tileColumn].clickedOnce){
		if(tileClickedLast != null){
			tileClickedLast.clickedOnce = false;
		}
		tileArray[tileRow][tileColumn].clickedOnce = false;
		if(tileArray[tileRow][tileColumn].isValidMove() && unitTurnOrder[unitTurnIndex].side == "Ally"){
			unitTurnOrder[unitTurnIndex].move(tileRow, tileColumn);
			if(heroAttacking)
				attackUnit();
			endOfTurn();
		}
		else if(tileArray[tileRow][tileColumn].validAtk && unitTurnOrder[unitTurnIndex].side == "Ally"){
			if(unitTurnOrder[unitTurnIndex].range == 1){
				heroAttacking = true;
				setTilesToAttackFrom(tileRow, tileColumn);
			}
			else{
				setTilesToAttackFrom(tileRow, tileColumn);
				attackUnit();
				endOfTurn();
			}
		}
	}
	else{
		if(tileClickedLast != null){
			tileClickedLast.clickedOnce = false;
		}
		tileArray[tileRow][tileColumn].clickedOnce = true;
		tileClickedLast = tileArray[tileRow][tileColumn];
		if(tileArray[tileRow][tileColumn].occupied){
			findUnitToDisplayStatsOf(tileRow, tileColumn);
		}
	}
}

$(document).keydown(function(e){
	if(e.which == 32) {  //space key for passing a unit's turn
		if(unitTurnOrder[unitTurnIndex].side == "Ally"){
			//pushes the unit that passed to the end of the unitTurnOrder queue
			if(!unitTurnOrder[unitTurnIndex].passedTurn){
				unitTurnOrder[unitTurnIndex].passedTurn = true;
				unitTurnOrder[unitTurnOrder.length] = unitTurnOrder[unitTurnIndex];
				endOfTurn();
			}
		}
	}
	else if(e.which == 27){  //escape key for redirecting an attack
		heroAttacking = false;
		startTurn(unitTurnOrder[unitTurnIndex]);
	}
});