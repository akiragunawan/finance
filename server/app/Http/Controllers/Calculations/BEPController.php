<?php

namespace App\Http\Controllers\Calculations;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use App\Http\Controllers\GoalSeekController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BEPController extends BSController
{
    public function queryBEP(Request $request){
        $month = $request->input('month');
        $year = $request->input('year');
        $date = Carbon::create($year, $month)->endOfMonth();

        // $date_origin = Carbon::today();
        // if(!$date_origin->isSameDay(Carbon::today()->endOfMonth())) $date_origin->subMonthNoOverflow();
        // $date_origin->endOfMonth();

        $branch = explode(',', config('auth.branches'));
        array_shift($branch);
        array_shift($branch);
        $branch_name = explode(',', config('auth.branches_name'));
        array_shift($branch_name);
        array_shift($branch_name);
        $result = array();
        $row_name = explode(',', config('auth.bep_row_name'));
        $i = 0;
        foreach($branch as $b){
            
            $col = collect();
            $col->put("Kode_Cabang", $b);
            $col->put("Nama_Cabang", $branch_name[$i]);
            $col->put("Data", $this->getBox($date->toDateString(), $b, $row_name));
            array_push($result, $col);
            $i++;
        }
        return $result;
    }

    public function getBox($date, $branch, $row_name){
        $process_number = 17;
        $box = array();
        for($i=1; $i <= $process_number; $i++){
            $box[$i] = $this->getRow($i, $date, $branch, $box);
        }
        $named_box = collect();
        foreach($box as $index => $b){
            $named_box->put($row_name[$index-1], $b);
        }
        $tmp = array(0);
        $box = array_merge($tmp, $named_box->toArray());
        array_shift($box);
        return $box;
    }
    
    
    public function getRow($index, $date, $branch, $box){
        $col = collect();
        $BSCOA_1 = '15420000';
        $PLCOA_1 = '41000000';
        $BSCOA_2 = '18809001';
        $PLCOA_2 = '49011001';
        $PLCOA_4 = '40000000';
        $BSCOA_6_1 = '21230000';
        $BSCOA_6_2 = '21830000';
        $PLCOA_6 = '51000000';
        $BSCOA_7 = '28809001';
        $PLCOA_7 = '59002001';
        $PLCOA_10 = '57200000';
        $PLCOA_11 = '57400000';
        $PLCOA_12 = '53000000';
        $PLCOA_13_1 = '52000000';
        $PLCOA_13_2 = '57000000';
        $PLCOA_13_3 = '58000000';
        $PLCOA_14 = '59000000';
        switch ($index) {
            case 1:
                $col['balance'] = $this->getAverage($date, $BSCOA_1, $branch);
                $col['interest_income'] = $this->getAverage($date, $PLCOA_1, $branch);
                $col['rate'] = ($col['balance'] == 0) ? 0 : ($col['interest_income']/$col['balance']*12*100);
                break;
            case 2:
                $col['balance'] = $this->getAverage($date, $BSCOA_2, $branch);
                $col['interest_income'] = $this->getAverage($date, $PLCOA_2, $branch);
                $col['rate'] = ($col['balance'] == 0) ? 0 : ($col['interest_income']/$col['balance']*12*100);
                break;
            case 3:
                $col['balance'] = $box[1]['balance']+$box[2]['balance'];
                $col['interest_income'] = $box[1]['interest_income']+$box[2]['interest_income'];
                break;
            case 4:
                $col['interest_income'] = $this->getAverage($date, $PLCOA_4, $branch) - $box[3]['interest_income'];
                break;
            case 5:
                $col['interest_income'] = $box[3]['interest_income']+$box[4]['interest_income'];;
                break;
            case 6:
                $col['balance'] = $this->getAverage($date, $BSCOA_6_1, $branch) + $this->getAverage($date, $BSCOA_6_2, $branch);
                $col['interest_income'] = $this->getAverage($date, $PLCOA_6, $branch);
                $col['rate'] = ($col['balance'] == 0) ? 0 : ($col['interest_income']/$col['balance']*12*100);
                break;
            case 7:
                $col['balance'] = $this->getAverage($date, $BSCOA_7, $branch);
                $col['interest_income'] = $this->getAverage($date, $PLCOA_7, $branch);
                $col['rate'] = ($col['balance'] == 0) ? 0 : ($col['interest_income']/$col['balance']*12*100);
                break;
            case 8:
                $col['balance'] = $box[6]['balance']+$box[7]['balance'];
                $col['interest_income'] = $box[6]['interest_income']+$box[7]['interest_income'];
                break;
            case 9:
                $col['interest_income'] = $box[3]['interest_income']-$box[8]['interest_income'];
                break;
            case 10:
                $col['balance'] = $this->getAverage($date, $PLCOA_10, $branch);
                break;
            case 11:
                $col['balance'] = $this->getAverage($date, $PLCOA_11, $branch);
                break;
            case 12:
                $col['balance'] = $this->getAverage($date, $PLCOA_12, $branch);
                $col['rate'] = 1/100;
                break;
            case 13:
                $col['balance'] = $this->getAverage($date, $PLCOA_13_1, $branch) + 
                $this->getAverage($date, $PLCOA_13_2, $branch) +
                $this->getAverage($date, $PLCOA_13_3, $branch) -
                $box[10]['balance'] - $box [11]['balance'];
                break;
            case 14:
                $col['balance'] = $this->getAverage($date, $PLCOA_14, $branch) - $box[7]['interest_income'];
                break;
            case 15:
                $col['balance'] = $box[10]['balance'] + $box[11]['balance'] + $box[12]['balance'] +
                $box[13]['balance'] + $box[14]['balance'];
                $col['interest_income'] = $col['balance'];
                break;
            case 16:
                $col['interest_income'] = $box[8]['interest_income'] + $box[15]['balance'];
                break;
            case 17:
                $col['interest_income'] = $box[5]['interest_income'] - $box[16]['interest_income'];
                break;
            default:
                
                break;
        }
        return $col;
    }
    
    public function getAverage($date, $coa, $branch){
        $dateCarbon = Carbon::createFromDate($date);
        $requested_month = $dateCarbon->month;
        $requested_year = $dateCarbon->year;
        $average = 0;
        for($x=0; $x<$requested_month; $x++){
            $res = $this->getCOAPerBranch($date,$coa,$branch);
            $average += $res;
        }
        $average /= $requested_month;
        return $average;
    }
    public function getCOAPerBranch($date, $coa, $branch)
    {   
        $res = DB::table('T_Inoan_COAPerBranch')
        ->select('IDRBalance')
        ->where('COADate', $date)
        ->where('AccountNo', $coa)
        ->where('Branch', $branch)
        ->first();
        $res = collect($res);
        $res = (float)$res->get("IDRBalance")/1000000;
        return $res;
    }
    public function calculate()
    {
        //if profit = 1000
        //adjust bal, check CKPN
        //if CKPN changes.. profit must be different, so keep looping
        //If CKPN doesn't change, profit must be the same, so break
        //if profit not 1000, keep looping, else break

        $balance = $this->calcGoalSeek(5000);
        return $balance;
    }
    
    public function calcGoalSeek($expected_result){
        //Instantiate your class
        $goalseek = new GoalSeekController();
        //$goalseek->debug = true;

        //I want to know which input needs callbackTest to give me 301
        $rate = 0.07927444500;
        $IC = 19111.90440724000;
        $S = 285.66067382000;
        $C = -930.87179400000;
        $CKPN_Prev = 697.28937163000;
        //Calculate the input to get you goal, with accuracy
        $input = $goalseek->calculate('callbackTest', $expected_result, 10, $rate, $IC, $S, $C, $CKPN_Prev);

        $x = collect();
        //Voilá!
        $x[0]  = $input;

        //Let's test our input it is close
        $actual_result = $goalseek->
        callbackTest($input, $rate, $IC, $S, $C, $CKPN_Prev);
        //Searched result of function
        $x[1]  = "Searched result of callbackTest($input) = " . $expected_result . "<br />";
        //Actual result of function with calculated goalseek
        $x[2]  = "Actual result of callbackTest(" . $input . ") = " . $actual_result . "<br />";
        //If difference is too high, you can improve the class and send me it your modifications ;)
        $x[3]  = "Difference = " . ($actual_result - $expected_result);
        return $input;
    }

}