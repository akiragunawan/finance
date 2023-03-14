<?php

namespace App\Http\Controllers\Calculations;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use App\Http\Controllers\GoalSeekController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BEPController extends BSController
{   
    private $query_count = 0;
    public function queryBEP(Request $request){
        $month = $request->input('month');
        $year = $request->input('year');
        $search = $request->input('search');
        $date = Carbon::create($year, $month)->endOfMonth();

        // $date_origin = Carbon::today();
        // if(!$date_origin->isSameDay(Carbon::today()->endOfMonth())) $date_origin->subMonthNoOverflow();
        // $date_origin->endOfMonth();
        $branch = $this->getBranch();
        $coas = $this->getCOA();
        $all = $this->getAverageAll($date);
        $result = array();
        foreach($branch as $i => $b){
            $col = collect();
            $col->put("Kode_Cabang", $b->branch_code);
            $col->put("Nama_Cabang", $b->branch_name);
            $col->put("Data", $this->getYellow($date, $b, $all));
            array_push($result, $col);
        }
        return $result;
    }

    public function getYellow($date, $branch, $all){
        $row_name = DB::connection('mysql')
        ->table('bep_row')
        ->select('*')
        ->get()
        ->pluck('row_name');
        // dd($row_name);
        $process_number = count($row_name);
        $box = array();
        for($i=1; $i <= $process_number; $i++){
            $box[$i] = $this->getRow($i, $box, $all, $branch->branch_code);
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
    
    
    public function getRow($index, $box, $all, $branch){
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
        $month = Carbon::createFromDate($all[$branch]->first()->COADate)->month;
        switch ($index) {
            case 1:
                // dd($all[$branch]->where('AccountNo', $BSCOA_1)->first());
                $col['balance'] = $all[$branch]->where('AccountNo', $BSCOA_1)->first()->IDRBalance;
                $col['interest_income'] = $all[$branch]->where('AccountNo', $PLCOA_1)->first()->IDRBalance;
                $col['rate'] = ($col['balance'] <= 0) ? 0 : ($col['interest_income']/$col['balance']*12*100/$month);
                break;
            case 2:
                $col['balance'] = $all[$branch]->where('AccountNo', $BSCOA_2)->first()->IDRBalance;
                $col['interest_income'] = $all[$branch]->where('AccountNo', $PLCOA_2)->first()->IDRBalance;
                $col['rate'] = ($col['balance'] <= 0) ? 0 : ($col['interest_income']/$col['balance']*12*100/$month);
                break;
            case 3:
                $col['balance'] = $box[1]['balance']+$box[2]['balance'];
                $col['interest_income'] = $box[1]['interest_income']+$box[2]['interest_income'];
                break;
            case 4:
                $col['interest_income'] = $all[$branch]->where('AccountNo', $PLCOA_4)->first()->IDRBalance - $box[3]['interest_income'];
                break;
            case 5:
                $col['interest_income'] = $box[3]['interest_income']+$box[4]['interest_income'];;
                break;
            case 6:
                $col['balance'] = $all[$branch]->where('AccountNo', $BSCOA_6_1)->first()->IDRBalance + $all[$branch]->where('AccountNo', $BSCOA_6_2)->first()->IDRBalance;
                $col['interest_income'] = $all[$branch]->where('AccountNo', $PLCOA_6)->first()->IDRBalance;
                $col['rate'] = ($col['balance'] <= 0) ? 0 : ($col['interest_income']/$col['balance']*12*100/$month);
                break;
            case 7:
                $col['balance'] = $all[$branch]->where('AccountNo', $BSCOA_7)->first()->IDRBalance;
                $col['interest_income'] = $all[$branch]->where('AccountNo', $PLCOA_7)->first()->IDRBalance;
                $col['rate'] = ($col['balance'] <= 0) ? 0 : ($col['interest_income']/$col['balance']*12*100/$month);
                break;
            case 8:
                $col['balance'] = $box[6]['balance']+$box[7]['balance'];
                $col['interest_income'] = $box[6]['interest_income']+$box[7]['interest_income'];
                break;
            case 9:
                $col['interest_income'] = $box[3]['interest_income']-$box[8]['interest_income'];
                break;
            case 10:
                $col['balance'] = $all[$branch]->where('AccountNo', $PLCOA_10)->first()->IDRBalance;
                break;
            case 11:
                $col['balance'] = $all[$branch]->where('AccountNo', $PLCOA_11)->first()->IDRBalance;
                break;
            case 12:
                $col['balance'] = $all[$branch]->where('AccountNo', $PLCOA_12)->first()->IDRBalance;
                $col['rate'] = 1/100;
                break;
            case 13:
                $col['balance'] = $all[$branch]->where('AccountNo', $PLCOA_13_1)->first()->IDRBalance + 
                $all[$branch]->where('AccountNo', $PLCOA_13_2)->first()->IDRBalance +
                $all[$branch]->where('AccountNo', $PLCOA_13_3)->first()->IDRBalance -
                $box[10]['balance'] - $box [11]['balance'];
                break;
            case 14:
                $col['balance'] = $all[$branch]->where('AccountNo', $PLCOA_14)->first()->IDRBalance - $box[7]['interest_income'];
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
    
    public function getAverageAll($date){
        $date->floorDay();
        $start = Carbon::createFromDate($date);
        $start->startOfYear()->endOfMonth();
        $date_arr = array($start->toDateString());
        while($start->lte($date)){
            array_push($date_arr, $start->addMonthNoOverflow()->endOfMonth()->toDateString());
        }
        $resBM = $this->queryAll($date_arr);
        // dd($resBM);
        $keys = $resBM->keys(); // get the keys of the collection array
        $average = array();
        foreach ($resBM as $key => $branch) {
            $months = array_values($branch->toArray());
            $lastMonth = end($months);
            $firstMonth = reset($months);
        
            foreach ($lastMonth as $item) {
                $accountNo = $item->AccountNo;
                $idrBalance = $item->IDRBalance;
                $count = 1;
        
                foreach ($firstMonth as $item2) {
                    if ($item2->AccountNo == $accountNo && !$this->isPL($item2)) {
                        $idrBalance += $item2->IDRBalance;
                        $count++;
                    }
                }
        
                $item->IDRBalance = $idrBalance / $count;
            }
        
            $resBM[$key] = collect($lastMonth);
        }
        
        
        return $resBM;
    }

    public function queryAll($dates){
        //select IDRBalance & AccoutNo only
        $COAs = $this->getCOA();
        $res = DB::connection('sqlsrv')
        ->table('T_Inoan_COAPerBranch')
        ->select('IDRBalance','COADate', 'AccountNo', 'Branch')
        ->whereIn('COADate', $dates)
        ->whereIn('AccountNo', $COAs->pluck('coa'))
        ->whereIn('Branch', $this->getBranch()->pluck('branch_code'))
        ->orderBy('AccountNo')
        ->get();
        $this->query_count++;
        //dd($res);
        foreach($res as $i => $r){
            $res[$i]->IDRBalance = (float)$r->IDRBalance/1000000;
        }
        
        $resBM = $res->groupBy(['Branch', 'COADate']);
        // dd($resBM);
        foreach($resBM as $keyBM => $resB){
            foreach($resB as $keyB => $resM){
                if(count($COAs) != count($resM)){
                    $plucked = $resM->pluck('AccountNo')->toArray();
                    $diff = array_diff($COAs->pluck('coa')->toArray(), $plucked);
                    //dd($diff, $plucked,$COAs->pluck('coa')->toArray(), $perBranch->first()->Branch);
                    foreach($diff as $d){
                        $resM->push(clone $resM[0]);
                        $resM->last()->IDRBalance = 0;
                        $resM->last()->AccountNo = $d;
                    }
                    $resB[$keyB] = $resM->sortBy('AccountNo')->values();
                    // dd($resB[$keyB], $keyB);
                }
                
            }
        
        }
        // $arr = array();
        // foreach($resBM as $i => $RB){
        //     foreach($RB as $j => $RM){
        //         $arr[$i][$j] = count($RM);
        //     }
        // }
        // dd($arr);
        return $resBM;
    }

    public function getAverage($date, $coa, $branch){
        $dateCarbon = Carbon::createFromDate($date);
        //dd($date);
        $requested_month = $dateCarbon->month;
        $requested_year = $dateCarbon->year;
        $average = 0;
        for($query_count=0; $query_count<$requested_month; $query_count++){
            $res = $this->getCOAPerBranch($dateCarbon,$coa,$branch);
            $average = $average + $res;
            $dateCarbon->addMonth();
            //dd($res);
        }
        $average = $average / $requested_month;
        return $average;
    }
    public function getCOAPerBranch($date, $coa, $branch)
    {   

        $res = DB::connection('sqlsrv')
        ->table('T_Inoan_COAPerBranch')
        ->select('IDRBalance')
        ->where('COADate', $date->toDateString())
        ->where('AccountNo', $coa)
        ->where('Branch', $branch)
        ->first();
        $res = collect($res);
        $res = (float)$res->get("IDRBalance")/1000000;
        $this->query_count++;
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

        $query_count = collect();
        //Voilá!
        $query_count[0]  = $input;

        //Let's test our input it is close
        $actual_result = $goalseek->
        callbackTest($input, $rate, $IC, $S, $C, $CKPN_Prev);
        //Searched result of function
        $query_count[1]  = "Searched result of callbackTest($input) = " . $expected_result . "<br />";
        //Actual result of function with calculated goalseek
        $query_count[2]  = "Actual result of callbackTest(" . $input . ") = " . $actual_result . "<br />";
        //If difference is too high, you can improve the class and send me it your modifications ;)
        $query_count[3]  = "Difference = " . ($actual_result - $expected_result);
        return $input;
    }
    public function getCOA(){
        return DB::connection('mysql')
        ->table('coa')
        ->select('coa', 'coa_name', 'bs_pl')
        ->get();
    }
    
    public function getBranch(){
        return DB::connection('mysql')
        ->table('branch')
        ->select('branch_code', 'branch_name')
        ->get();
    }    
    public function isPL($coa){
        $coas = $this->getCOA();
        return $coas->where('coa', $coa->AccountNo)->first()->bs_pl == 2;
    }
}