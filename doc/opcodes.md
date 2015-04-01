# Gameboy Z80 opcodes

## 00h

    NOP

No operation

T: 4

## 01h

    LD BC, nn

Load 16-bit immediate into BC.

T: 4

## 02h

    LD (BC), A

Save A to address pointed to by BC.

T: 8

## 03h

    INC BC

Increments BC.

T: 8

## 04h

    INC B

Increments B.

T: 4

## 05h

    DEC B

Decrements B.

T: 4
