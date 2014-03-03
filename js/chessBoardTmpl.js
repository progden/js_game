<div><h1>Score: {{if player == 1}}[●]{{else}}●{{/if}}{{:~tag.GetBlackCore()}}/{{:~tag.GetWhiteCore()}}{{if player == 2}}[○]{{else}}○{{/if}}</h1></div>
<span class="chessBoard">
	{{for board}}
	<span class="chessRow">
		{{for ~root.board[#index] ~outerIdx=#index}}
			<span class="chessPlace {{:(~outerIdx + #index)%2?'chessBlack':'chessWhite'}}">
				{{if ~root.board[~outerIdx][#index] == 1}}
					<div class="chessBlackCircle"></div>
				{{else ~root.board[~outerIdx][#index] == 2}}
					<div class="chessWhiteCircle"></div>
				{{/if}}
			</span>
		{{/for}}
	</span>
	{{/for}}
</span>