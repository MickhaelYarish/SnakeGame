"use strict"
$( document ).ready(function() {

    const domTable = $('#board table');

    let interval = null;


    class Board{

        constructor(snake, width=12, height=12){
            this.snake = snake;
            this.width = width;
            this.height = height;
            this.board = this.createBoard();
        }

        createBoard(){
            let board = [];
            for(let i = 0; i < this.height; i++){
                board.push([]);
                for(let j = 0; j < this.width; j++){
                    if(i === 0 || i === this.height -1 || j === 0 || j === this.width-1){
                        board[i].push({type:'border'})
                    }else{
                        board[i].push({type:'empty'})
                    }
                   
                }
            }
            return board;
        }

        createHTMLTable(){
            for(let y = 0; y < this.height; y++){
                domTable.append('<tr></tr>');
                for(let x = 0; x < this.width; x++){
                    domTable.children(`tr:nth-child(${y + 1})`).append('<td></td>');
                }
            }
        }

        renderSnakeOnBoard(y, x){
            this.getHTMLTableCell(this.snake.snakeHead.y, this.snake.snakeHead.x).css('background-color','black')
            this.getHTMLTableCell(y,x).css('background-color','grey');
        }

        changeArraySnakeLocation(y, x){
            if(this.board[y][x]['type'] === 'food'){
                this.addFood();
                let tail = this.snake.getTail();
                let tailY = tail.y;
                let tailX = tail.x;
                this.snake.moveSnakeOneCell(y, x, this.board);
                this.snake.push(tailY, tailX, this.board);
                this.snake.speed-=20;

            }else if(this.board[y][x]['type'] === 'empty'){
                this.snake.moveSnakeOneCell(y, x, this.board);
            }
        }

        clearTable(){
            domTable.empty();
        }
        
        moveSnake(y, x){
            if(this.board[y][x]['type'] === 'border' || this.board[y][x]['type'] === 'snake'){
                alert('you lost');
                this.startGame();
            }
            this.changeArraySnakeLocation(y, x);
        }

        getHTMLTableCell(y,x){
          return domTable.children(`tr:nth-child(${y+1})`).children(`td:nth-child(${x+1})`);
        }

        addFood(){
            let y = Math.floor(Math.random() * (this.height -2)) + 1;
            let x = Math.floor(Math.random() * (this.width -2)) + 1;

            while(this.board[y][x]['type'] !== 'empty'){
                y = Math.floor(Math.random() * (this.height -2)) + 1;
                x = Math.floor(Math.random() * (this.width -2)) + 1;
            }
                this.board[y][x]['type'] = 'food';
                domTable.children(`tr:nth-child(${y+1})`).children(`td:nth-child(${x+1})`).css('background-color','white');
            
        }

        initSnake(){
            this.board[this.snake.snakeHead['y']][this.snake.snakeHead['x']]['type'] = 'snake';
            this.getHTMLTableCell(this.snake.snakeHead['y'],this.snake.snakeHead['x']).css('background-color','grey');
        }

        startGame(){
            clearInterval(interval);
            interval = null;
            this.clearTable();
            this.board = null;
            this.snake.snakeHead.x = 7;
            this.snake.snakeHead.y = 7;
            this.snake.snakeHead.next = null;
            this.snake.length = 1;
            this.snake.route = 'right';
            this.snake.speed = 600;
            this.board = this.createBoard();
            this.createHTMLTable();
            this.initSnake();
            this.addFood();

            console.log(this.board)
        }

    }

    class Snake{
        constructor(){
            this.snakeHead = {
                x: 7,
                y: 7,
                type: 'snake',
                next: null,
                prev: null
            }
            this.length = 1;
            this.route = 'right';
            this.speed = 600;
        }

        getTail(){
            if(this.length === 1){
                return this.snakeHead;
            }else{
                let node = this.snakeHead;
                while(node.next !== null){
                    node = node.next;
                }
                return node;    
            }
        }

        moveSnakeOneCell(y, x, board){
            let tail = this.getTail();
            let oldX = tail.x;
            let oldY = tail.y;
            while(tail.prev){
                tail.y = tail.prev.y;
                tail.x = tail.prev.x;
                tail = tail.prev;
            }
            board[y][x]['type'] = 'snake';
            domTable.children(`tr:nth-child(${y+1})`).children(`td:nth-child(${x+1})`).css('background-color','grey');
            board[oldY][oldX]['type'] = 'empty';
            domTable.children(`tr:nth-child(${oldY+1})`).children(`td:nth-child(${oldX+1})`).css('background-color','black');

            this.snakeHead.y = y;
            this.snakeHead.x = x;
        }

        push(y, x, board){
            let node = this.getTail();
            node.next = {
                y,
                x,
                next: null,
                prev: node
            }
            board[y][x]['type'] = 'snake';
            domTable.children(`tr:nth-child(${y+1})`).children(`td:nth-child(${x+1})`).css('background-color','grey');
            this.length++;
        }

    }

    const snake = new Snake();
    const snakeBoard = new Board(snake);

    $( document ).keydown(function(e) {
        let key = e.originalEvent.key;
        if(key === 'ArrowUp'){
            if(snakeBoard.snake.route !== 'down'){
                clearInterval(interval);
                snakeBoard.moveSnake(snakeBoard.snake.snakeHead.y - 1, snakeBoard.snake.snakeHead.x);
                snakeBoard.snake.route='up';
                interval = setInterval(function(){
                    snakeBoard.moveSnake(snakeBoard.snake.snakeHead.y - 1, snakeBoard.snake.snakeHead.x)
                } ,snake.speed);
            }  
        }

        if(key === 'ArrowDown'){
            if(snakeBoard.snake.route !== 'up'){
                clearInterval(interval);
                snakeBoard.moveSnake(snakeBoard.snake.snakeHead.y + 1, snakeBoard.snake.snakeHead.x);
                snakeBoard.snake.route='down';
                interval = setInterval(function(){
                    snakeBoard.moveSnake(snakeBoard.snake.snakeHead.y + 1, snakeBoard.snake.snakeHead.x)
                } ,snake.speed);

            }
        }

        if(key === 'ArrowLeft'){
            if(snakeBoard.snake.route !== 'right'){
                clearInterval(interval);
                snakeBoard.moveSnake(snakeBoard.snake.snakeHead.y, snakeBoard.snake.snakeHead.x - 1);
                snakeBoard.snake.route='left';
                interval = setInterval(function(){
                    snakeBoard.moveSnake(snakeBoard.snake.snakeHead.y, snakeBoard.snake.snakeHead.x - 1)
                } ,snake.speed);

            }
        }

        if(key === 'ArrowRight'){
            if(snakeBoard.snake.route !== 'left'){
                clearInterval(interval);
                snakeBoard.moveSnake(snakeBoard.snake.snakeHead.y, snakeBoard.snake.snakeHead.x + 1); 
                snakeBoard.snake.route='right';
                interval = setInterval(function(){
                    snakeBoard.moveSnake(snakeBoard.snake.snakeHead.y, snakeBoard.snake.snakeHead.x + 1)
                } ,snake.speed);
            }
        }

    });

    snakeBoard.startGame();

});