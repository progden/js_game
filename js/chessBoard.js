$.views.tags({
	chessBoard: {
		template: "#chessBoardTmpl",
		init: function(tagCtx, linkCtx, ctx) {
			this.data = tagCtx.view.data;
			if(typeof this.data.canGo == 'undefined'){
				this.data.canGo = this.updateCanGo(this.data.board);
			}
			if(typeof this.data.player == 'undefined'){
				this.data.player = this.BLACK_PLAYER;
			}
		},
		onAfterLink: function(){
			var self = this;
			self.contents(".chessBoard")
			.on("click", ".chessPlace", function(){ 
				var idx = jQuery.inArray(this, $(this).parent().parent().find(".chessPlace"));
				var coordX = Math.floor(idx/8)
				var coordY = (idx % 8);
				self.clickBoard(coordX, coordY);
			})
			;
		},
		clickBoard: function(x, y){
			if(this.isEmptyCell(this.data.board, x, y) && this.canFlipChess(this.data.board, this.data.player, x, y)){
				this.data.board[x][y] = this.data.player;
				this.data.canGo = this.updateCanGo(this.data.board);
				this.doFlipChess(this.data.board, this.data.player, x, y);
				var otherPlayer = this.data.player==this.BLACK_PLAYER?this.WHITE_PLAYER:this.BLACK_PLAYER;
				if(this.hasNextStep(this.data.board, this.data.canGo, otherPlayer)){
					this.data.player = this.data.player==this.BLACK_PLAYER?this.WHITE_PLAYER:this.BLACK_PLAYER;
				}else{
					if(!this.hasNextStep(this.data.board, this.data.canGo, this.data.player)){
						this.refresh();
						alert("Game Over");
					}else{
						this.refresh();
						alert(otherPlayer +" can't go next step no Switch Player");	
					}
				}
			}
			this.refresh();
		},
		GetBlackCore: function(){
			var cnt = 0;
			for(var i = 0 ; i < 8 ; i++)
				for(var j = 0 ; j < 8 ; j++)
					if(this.data.board[i][j] == this.BLACK_PLAYER) cnt++;
			return cnt ;
		},
		GetWhiteCore: function(){
			var cnt = 0;
			for(var i = 0 ; i < 8 ; i++)
				for(var j = 0 ; j < 8 ; j++)
					if(this.data.board[i][j] == this.WHITE_PLAYER) cnt++;
			return cnt ;
		},
		dataBoundOnly: true,
		// defind cell
		WHITE_PLAYER: 2, 
		BLACK_PLAYER: 1, 
		EMPTY_CELL: 0,
		// define 8 directs
		dirs: [
			[1, 1], [1, 0], [1, -1],
			[0, 1],/*[0, 0],*/[0, -1],
			[-1, 1], [-1, 0], [-1, -1]
		],
		isEmptyCell: function(board, x, y){
			return board[x][y] == this.EMPTY_CELL;
		},
		canFlipChess: function(board, player, x, y){
			var otherPlayer = player==this.BLACK_PLAYER?this.WHITE_PLAYER:this.BLACK_PLAYER;
			for(var dir in this.dirs){
				var dirArr = this.getDirArr(board, x, y, this.dirs[dir][0], this.dirs[dir][1]);
				if(this.canFlip(dirArr, player)) return true ;
			}
			return false ;
		},
		doFlipChess: function(board, player, x, y){
			var otherPlayer = player==this.BLACK_PLAYER?this.WHITE_PLAYER:this.BLACK_PLAYER;
			for(var dir in this.dirs){
				var dirArr = this.getDirArr(board, x, y, this.dirs[dir][0], this.dirs[dir][1]);
				if(this.canFlip(dirArr, player)){
					this.doFlip(board, dirArr, x, y, this.dirs[dir][0], this.dirs[dir][1], player, otherPlayer);
				}
			}
		},
		// call by doFlipChess
		doFlip: function(board, dirArr, x, y, dirX, dirY, player, otherPlayer){
			var tmpX, tmpY;
			tmpX = x; tmpY = y;
			for(var i = 0 ; i < dirArr.length; i++){
				tmpX = tmpX+dirX;
				tmpY = tmpY+dirY;
				if(dirArr[i] == otherPlayer) {
					board[tmpX][tmpY] = player ;
					continue;
				}
				break;
			}
		},
		getDirArr: function(board, x, y, dirX, dirY){
			var tmpX = x; tmpY = y;
			var tmp = [];
			while(true){
				tmpX = tmpX+dirX;
				tmpY = tmpY+dirY;
				if(0 <= tmpX && tmpX < 8 &&
					0 <= tmpY && tmpY < 8){
					tmp[tmp.length] = board[tmpX][tmpY];
				}else{
					break;
				}
			}
			return tmp ;
		},
		canFlip: function(dirArr, player){
			var otherPlayer = player==this.BLACK_PLAYER?this.WHITE_PLAYER:this.BLACK_PLAYER;
			for(var i = 0 ; i < dirArr.length; i++){
				if(dirArr[i] == otherPlayer) continue;
				break;
			}
			if(i != this.EMPTY_CELL && dirArr[i] == player) return true ;
			return false; 
		},
		hasNextStep: function(board, canGo, player){
			for(cood in canGo){
				for(dir in this.dirs){
					var dirArr = this.getDirArr(board, canGo[cood][0], canGo[cood][1], this.dirs[dir][0], this.dirs[dir][1]);
					if(this.canFlip(dirArr, player)){
						return true ;
					}
				}
			}
			return false;
		},
		updateCanGo: function(board){
			var rs = [];
			for(var i = 0 ; i < board.length; i++){
				for(var j = 0 ; j < board[i].length; j++){
					if(board[i][j] != this.EMPTY_CELL) continue;
					for(dir in this.dirs){
						var tmpX = i+this.dirs[dir][0];
						var tmpY = j+this.dirs[dir][1];
						if(0 <= tmpX && tmpX < board.length &&
							0 <= tmpY && tmpY < board[tmpX].length &&
							(board[tmpX][tmpY] != this.EMPTY_CELL)){
							rs[rs.length] = [i, j];
							break ;
						}
					}
				}
			}
			return rs; 
		}
	}
});