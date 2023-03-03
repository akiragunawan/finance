<?php
//First, wrap your functions in your own class that extends PHPExcelGoalSeek
namespace App\Http\Controllers;
use App\Http\Controllers\PHPExcelGoalSeek;

class GoalSeekController extends PHPExcelGoalSeek{

    function callbackTest($input, $rate, $IC, $S, $C, $CKPN_Prev) {
        $balance = $input;
        $TI = $balance* $rate/12 + $C;
        $CKPN = max($CKPN_Prev, $balance*0.01/12);
        $OC = $S + $CKPN;
        $TC = $OC + $IC;
        $profit = $TI - $TC;
        return $profit;
    }
}

