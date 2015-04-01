# Gameboy Z80 opcodes

## 00h

    NOP

No operation

M: 1, T: 4

## 01h

    LD BC, nn

Load 16-bit immediate into BC.

M: 2, T: 10

# 02h

    LD (BC), A

Save A to address pointed to by BC.

M: 2, T: 7

## 03h

    INC BC

