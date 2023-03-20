<?php

namespace App\Http\Controllers\Calculations;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use App\Http\Controllers\GoalSeekController;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use function PHPUnit\Framework\isNull;

class BEPController extends BSController
{   
    private $month = 0;
    private $profit = null;
    private $ftp = null;
    private $query_count = 0;
    private $BSCOA_1 = '15420000';
    private $PLCOA_1 = '41000000';
    private $BSCOA_2 = '18809001';
    private $PLCOA_2 = '49011001';
    private $PLCOA_4 = '40000000';
    private $BSCOA_6_1 = '21230000';
    private $BSCOA_6_2 = '21830000';
    private $PLCOA_6 = '51000000';
    private $BSCOA_7 = '28809001';
    private $PLCOA_7 = '59002001';
    private $PLCOA_10 = '57200000';
    private $PLCOA_11 = '57400000';
    private $PLCOA_12 = '53000000';
    private $PLCOA_13_1 = '52000000';
    private $PLCOA_13_2 = '57000000';
    private $PLCOA_13_3 = '58000000';
    private $PLCOA_14 = '59000000';
    public function queryBEP(Request $request){
        $month = $request->input('month');
        $year = $request->input('year');
        $date = Carbon::create($year, $month)->endOfMonth();
        
        // $date_origin = Carbon::today();
        // if(!$date_origin->isSameDay(Carbon::today()->endOfMonth())) $date_origin->subMonthNoOverflow();
        // $date_origin->endOfMonth();
        $res = array();
        $branch = $this->getBranch();
        $all = $this->getAverageAll($date);
        
        if ($request->has('profit')) $this->profit = $request->input('profit');
        if ($request->has('ftp')) $this->ftp = $request->input('ftp');
        $yellow = $this->getYellow($date, $branch, $all);
        $green = $this->getGreen($date, $branch, $yellow);
        $res[0] = $yellow;
        $res[1] = $green;
        return $res;
    }

    public function getYellow($date, $branch, $all){
        
        $row_name = DB::connection('mysql')
        ->table('bep_row')
        ->select('*')
        ->get()
        ->pluck('row_name');
        $process_number = count($row_name);
        $result = collect();
        $this->month = Carbon::createFromDate($all->first()->first()->COADate)->month;
        foreach($branch as $index => $b){
            //first loop run code per branch
            $col = collect();
            $col->put("Kode_Cabang", $b->branch_code);
            $col->put("Nama_Cabang", $b->branch_name);
            
            //$box is iterative array (used in getRow())
            $box = collect();
            $named_box = collect();
            
            for($i=1; $i <= $process_number; $i++){
                //second loop run code per row
                //$i is for getrow(box), $index is for branches
                $box->put($i, $this->getRow($i, $box, $all, $branch[$index]->branch_code)); 
                
                //insert data to named_box with name as key
                $named_box->put($row_name[$i-1], $box[$i]);
            }
            
            
            $col->put("Data", collect($named_box));
            $result->push($col);
        }
        
        return $result;
        
    }
    public function getGreen($date, $branch, $yellow)
    {
        $result = array();
        $profit = 0;
        $yellow = collect($yellow);
        $month = $date->month;
        // $green = clone $yellow;
        $green = unserialize(serialize($yellow));
        foreach($branch as $index => $b){

            $profit = $yellow[$index]["Data"]["profit"]["interest_income"];
            if(is_null($this->profit)) $profit = round(($profit+1000) / 1000) * 1000;
            else $profit = $this->profit;
            if($green[$index]["Data"]["pio"]["rate"] == 0 && $green[$index]["Data"]["pio"]["balance"] > 0){
                $green[$index]["Data"]->splice(0, $green[$index]["Data"]->count());
            }
            else if($this->ftp != null) $green[$index]["Data"]["pio"]["rate"] = $this->ftp;
            foreach($green[$index]["Data"] as $key => $c) {
                switch ($key){
                    case "loan":
                        $bal = $this->calculate($profit, $month, $green[$index]);
                        $c->put("balance", $bal);
                        $c->put('interest_income', ($c["rate"]/100)*$c["balance"]*$month/12);
                        break;
                    case "pio":
                        $c->put('interest_income', ($c["rate"]/100)*$c["balance"]*$month/12);
                        break;
                    case "total":
                        $c->put('balance', $green[$index]["Data"]["loan"]["balance"]+$green[$index]["Data"]["pio"]["balance"]);
                        $c->put('interest_income', $green[$index]["Data"]["loan"]["interest_income"]+$green[$index]["Data"]["pio"]["interest_income"]);
                        break;
                    case "other":
                        
                        break;
                    case "total_income":
                        $c->put('interest_income', $green[$index]["Data"]["total"]["interest_income"] + $green[$index]["Data"]["other"]["interest_income"]);
                        
                        break;
                    case "dpk":
                        
                        break;
                    case "bio":
                        
                        break;
                    case "total_interest":

                        break;
                    case "net":
                        $c->put('interest_income', $green[$index]["Data"]["total"]["interest_income"] - $green[$index]["Data"]["total_interest"]["interest_income"]);
                        
                        break;
                    case "salary":
                        
                        break;
                    case "rental":
                        
                        break;
                    case "ckpn":
                        $c->put('rate', 1);
                        $c->put("balance", max($c["balance"], $green[$index]["Data"]["loan"]["balance"]*($c['rate']/100)*$month/12));
                        // dd($c);
                        break;
                    case "operational":
                        
                        break;
                    case "non_operational":
                        
                        break;
                    case "total_op_cost":
                        $c->put('balance',$green[$index]["Data"]["salary"]["balance"]+$green[$index]["Data"]["rental"]["balance"]+
                        $green[$index]["Data"]["ckpn"]["balance"]+$green[$index]["Data"]["operational"]["balance"]
                        +$green[$index]["Data"]["non_operational"]["balance"]);
                        $c->put('interest_income', $c["balance"]);
                        break;
                    case "total_cost":
                        $c->put('interest_income', $green[$index]["Data"]["total_op_cost"]["balance"]+$green[$index]["Data"]["total_interest"]["interest_income"]);
                        break;
                    case "profit":
                        $c->put('interest_income', $green[$index]["Data"]["total_income"]["interest_income"]-$green[$index]["Data"]["total_cost"]["interest_income"]);
                        break;
                    default:
                        
                        break;
                }
            }
            // $green[$index]->dd();
        }
        
        
        return $green;
    }
    
    public function getRow($index, $box, $all, $branch){
        $col = collect();
        switch ($index) {
            case 1:
                // change array to col?
                $col->put('balance', $all[$branch]->where('AccountNo', $this->BSCOA_1)->first()->IDRBalance);
                $col->put('interest_income', $all[$branch]->where('AccountNo', $this->PLCOA_1)->first()->IDRBalance);
                $col->put('rate', ($col['balance'] <= 0) ? 0 : ($col['interest_income']/$col['balance']*12*100/$this->month));
                break;
            case 2:
                $col->put('balance', $all[$branch]->where('AccountNo', $this->BSCOA_2)->first()->IDRBalance);
                $col->put('interest_income', $all[$branch]->where('AccountNo', $this->PLCOA_2)->first()->IDRBalance);
                $col->put('rate', ($col['balance'] <= 0) ? 0 : ($col['interest_income']/$col['balance']*12*100/$this->month));
                break;
            case 3:
                $col->put('balance', $box[1]['balance']+$box[2]['balance']);
                $col->put('interest_income', $box[1]['interest_income']+$box[2]['interest_income']);
                break;
            case 4:
                $col->put('interest_income', $all[$branch]->where('AccountNo', $this->PLCOA_4)->first()->IDRBalance - $box[3]['interest_income']);
                break;
            case 5:
                $col->put('interest_income', $box[3]['interest_income']+$box[4]['interest_income']);
                break;
            case 6:
                $col->put('balance', $all[$branch]->where('AccountNo', $this->BSCOA_6_1)->first()->IDRBalance + $all[$branch]->where('AccountNo', $this->BSCOA_6_2)->first()->IDRBalance);
                $col->put('interest_income', $all[$branch]->where('AccountNo', $this->PLCOA_6)->first()->IDRBalance);
                $col->put('rate', ($col['balance'] <= 0) ? 0 : ($col['interest_income']/$col['balance']*12*100/$this->month));
                break;
            case 7:
                $col->put('balance', $all[$branch]->where('AccountNo', $this->BSCOA_7)->first()->IDRBalance);
                $col->put('interest_income', $all[$branch]->where('AccountNo', $this->PLCOA_7)->first()->IDRBalance);
                $col->put('rate', ($col['balance'] <= 0) ? 0 : ($col['interest_income']/$col['balance']*12*100/$this->month));
                break;
            case 8:
                $col->put('balance', $box[6]['balance']+$box[7]['balance']);
                $col->put('interest_income', $box[6]['interest_income']+$box[7]['interest_income']);
                break;
            case 9:
                $col->put('interest_income', $box[3]['interest_income']-$box[8]['interest_income']);
                break;
            case 10:
                $col->put('balance', $all[$branch]->where('AccountNo', $this->PLCOA_10)->first()->IDRBalance);
                break;
            case 11:
                $col->put('balance', $all[$branch]->where('AccountNo', $this->PLCOA_11)->first()->IDRBalance);
                break;
            case 12:
                $col->put('balance', $all[$branch]->where('AccountNo', $this->PLCOA_12)->first()->IDRBalance);
                $col->put('rate', 1);
                break;
            case 13:
                $col->put('balance', $all[$branch]->where('AccountNo', $this->PLCOA_13_1)->first()->IDRBalance + 
                $all[$branch]->where('AccountNo', $this->PLCOA_13_2)->first()->IDRBalance +
                $all[$branch]->where('AccountNo', $this->PLCOA_13_3)->first()->IDRBalance -
                $box[10]['balance'] - $box [11]['balance']);
                break;
            case 14:
                $col->put('balance', $all[$branch]->where('AccountNo', $this->PLCOA_14)->first()->IDRBalance - $box[7]['interest_income']);
                break;
            case 15:
                $col->put('balance', $box[10]['balance'] + $box[11]['balance'] + $box[12]['balance'] +
                $box[13]['balance'] + $box[14]['balance']);
                $col->put('interest_income', $col['balance']);
                break;
            case 16:
                $col->put('interest_income', $box[8]['interest_income'] + $box[15]['balance']);
                break;
            case 17:
                $col->put('interest_income', $box[5]['interest_income'] - $box[16]['interest_income']);
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
    public function calculate($target, $month, $box)
    {
        //if profit = 1000
        //adjust bal, check CKPN
        //if CKPN changes.. profit must be different, so keep looping
        //If CKPN doesn't change, profit must be the same, so break
        //if profit not 1000, keep looping, else break
        // dd($box);
        $balance = $this->calcGoalSeek($target, $month, $box);
        return $balance;
    }
    
    public function calcGoalSeek($expected_result, $month, $box){
        //Instantiate your class
        $goalseek = new GoalSeekController();
        //$goalseek->debug = true;

        //I want to know which input needs callbackTest to give me 301
        $rate = $box["Data"]["loan"]["rate"]/100;
        $IC = $box["Data"]["total_interest"]["interest_income"];
        $PIO = $box["Data"]["pio"]["balance"] * $box["Data"]["pio"]["rate"] * $month / 12;
        
        $S = $box["Data"]["salary"]["balance"] + $box["Data"]["rental"]["balance"]
        + $box["Data"]["operational"]["balance"] + $box["Data"]["non_operational"]["balance"];
        $C = $box["Data"]["other"]["interest_income"];
        $CKPN_Prev =  $box["Data"]["ckpn"]["balance"];
        // if($box["Kode_Cabang"] == 1105)dd($expected_result, $rate, $IC, $PIO, $S, $C, $CKPN_Prev);
        //Calculate the input to get you goal, with accuracy
        $input = $goalseek->calculate('callbackTest', $expected_result, 10, $rate, $IC, $PIO, $S, $C, $CKPN_Prev, $month);
        
        $goalseekResult = collect();
        //Voilá!
        $goalseekResult[0]  = $input;

        //Let's test our input it is close
        $actual_result = $goalseek->callbackTest($input, $rate, $IC, $PIO, $S, $C, $CKPN_Prev, $month);
        //Searched result of function
        $goalseekResult[1]  = "Searched result of callbackTest($input) = " . $expected_result . "<br />";
        //Actual result of function with calculated goalseek
        $goalseekResult[2]  = "Actual result of callbackTest(" . $input . ") = " . $actual_result . "<br />";
        //If difference is too high, you can improve the class and send me it your modifications ;)
        $goalseekResult[3]  = "Difference = " . ($actual_result - $expected_result);
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

    public function queryScenario(Request $request){
        $month = $request->input('month');
        $year = $request->input('year');
        $date = Carbon::create($year, $month)->endOfMonth();

        $branch = $this->getBranch();
        $all = $this->getAverageAll($date);
        $yellow = $this->getYellow($date, $branch, $all);
        $resource = collect();
        $temp = "month";
        $resource->month = $month;
        foreach (['loan_bal', 'loan_rate', 'pio_bal', 'pio_rate', 'dpk_rate', 'ckpn_rate', 'profit'] as $param) {
            if ($request->filled($param)) {
                $resource->put($param, $request->input($param));
            }
        }
        return $this->getCustom($resource, $yellow);
    }
    public function getCustom($resource, $yellow)
    {   
        // dd($yellow);
        

        

        return $this->getFromResources($resource, $yellow);
    }

    public function getFromResources($resource, $yellow){
        $res = unserialize(serialize($yellow));
        $loan_bal = $resource->has('loan_bal') ? $resource['loan_bal'] : $yellow['0']['Data']['loan']['balance'];
        $loan_rate = $resource->has('loan_rate') ? $resource['loan_rate'] : $yellow['0']['Data']['loan']['rate'];
        $pio_bal = $resource->has('pio_bal') ? $resource['pio_bal'] : $yellow['0']['Data']['pio']['balance'];
        $pio_rate = $resource->has('pio_rate') ? $resource['pio_rate'] : $yellow['0']['Data']['pio']['rate'];
        $dpk_rate = $resource->has('dpk_rate') ? $resource['dpk_rate'] : $yellow['0']['Data']['dpk']['rate'];
        $ckpn_rate = $resource->has('ckpn_rate') ? $resource['ckpn_rate'] : 1;

        $res['0']['Data']['loan']['balance'] = (float)$loan_bal;
        $res['0']['Data']['loan']['rate'] = (float)$loan_rate;
        $res['0']['Data']['loan']['interest_income'] = (float)$loan_rate*$loan_bal*$resource->month/12;
        $res['0']['Data']['pio']['balance'] = (float)$pio_bal;
        $res['0']['Data']['pio']['rate'] = (float)$pio_rate;
        $res['0']['Data']['pio']['interest_income'] = (float)$pio_rate*$pio_bal*$resource->month/12;
        $res['0']['Data']['dpk']['balance'] = (float)$dpk_rate;
        $res['0']['Data']['dpk']['rate'] = (float)$dpk_rate;
        $res['0']['Data']['dpk']['interest_income'] = (float)$dpk_rate;
        $res['0']['Data']['ckpn']['rate'] = (float)$ckpn_rate;
        
        return $res;
    }
    
}