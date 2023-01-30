# Connect Four

This repository implements the Connect Four game.

## Rules

Connect Four is a two-player connection board game, in which the players choose a color and then take turns dropping colored tokens into a suspended grid. The pieces fall straight down, occupying the lowest available space within the column.

## Objective

The objective of the game is to be the first to form a horizontal, vertical, or diagonal line of four of one's own tokens. Connect Four is a solved game. The first player can always win by playing the right moves.

## Game Play

When the player clicks on a column, a piece will fall, occupying the lowest available space within the column. Then, the computer will make a move. It is used a [minimax](https://medium.com/analytics-vidhya/artificial-intelligence-at-play-connect-four-minimax-algorithm-explained-3b5fc32e4a4f) strategy, based on <https://github.com/marcomelilli/four-in-a-row-js-minimax>.