<?php
//First, wrap your functions in your own class that extends PHPExcelGoalSeek
namespace App\Http\Controllers;
use App\Http\Controllers\PHPExcelGoalSeek;

class GoalSeekController extends PHPExcelGoalSeek{

    function callbackTest($input, $rate, $IC, $PIO, $S, $C, $CKPN_Prev, $month) {
        $balance = $input;
        $TI = ($balance* $rate * $month /12) + $C + $PIO;
        $CKPN = max($CKPN_Prev, $balance*0.01*$month/12);
        $OC = $S + $CKPN;
        $TC = $OC + $IC;
        $profit = $TI - $TC;
        return $profit;
    }
}

