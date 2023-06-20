<?php

namespace App\Http\Controllers\Calculations;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use App\Http\Controllers\GoalSeekController;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use stdClass;

use function PHPUnit\Framework\isNull;

class BEPController extends BSController
{
    private $month = 0;
    private $projection_month = 0;
    private $query_count = 0;
    private $profit = 0;
    private $pio_rate = 0;
    private $loan_rate = 0;
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
    public function queryBEP(Request $request)
    {
        $this->month = 0;
        $this->profit = 0;
        $date_origin = Carbon::today();
        if (!$date_origin->isSameDay(Carbon::today()->endOfMonth())) $date_origin->subMonthNoOverflow();
        $date_origin->endOfMonth();
        $date = $date_origin;
        $this->month = $date->month;
        if ($request->filled('loan_rate')) $this->loan_rate = $request->input('loan_rate');
        if ($request->filled('pio_rate')) $this->pio_rate = $request->input('pio_rate');

        if ($request->filled('month') && $request->filled('year')) {
            $month = $request->input('month');
            $year = $request->input('year');
            $date = Carbon::create($year, $month)->endOfMonth();
            if ($date_origin->lessThan($date)) $date = $date_origin;
            $this->month = $date->month;
        }
        $res = array();
        $COA = $this->getCOA();
        $branch = $this->getBranch();
        if ($request->filled('branch')) $branch = collect($branch->where('branch_code', $request->input('branch')));
        $all = $this->getAverageAll($date, $branch, $COA);
        $branchCodes = $branch->pluck('branch_code');
        $difference = $branchCodes->diff($all->keys());
        $branch = $branch->reject(function ($item) use ($difference) {
            return $difference->contains($item->branch_code);
        });
        $this->ifFilledThenInput('profit', $request);
        if ($request->filled('branch')) {
            $branch = $branch->where('branch_code', $request->get('branch'));
            $yellow = $this->getYellow($date, collect($branch)->values(), $all);
            $green = $this->getGreen($date, collect($branch)->values(), $yellow);
        } else {
            $yellow = $this->getYellow($date, $branch, $all);
            $green = $this->getGreen($date, $branch, $yellow);
        }

        $res[0] = $yellow;
        $res[1] = $green;
        return $res;
    }

    public function getYellow($date, $branch, $all)
    {
        $row_name = DB::connection('mysql')
            ->table('bep_row')
            ->select('*')
            ->get()
            ->pluck('row_name');
        $process_number = count($row_name);
        $result = collect();
        foreach ($branch as $index => $b) {
            //first loop run code per branch
            $col = collect();
            $col->put("Kode_Cabang", $b->branch_code);
            $col->put("Nama_Cabang", $b->branch_name);

            //$box is iterative array (used in getRow())
            $box = collect();
            $named_box = collect();

            for ($i = 1; $i <= $process_number; $i++) {
                //second loop run code per row
                //$i is for getrow(box), $index is for branches
                $box->put($i, $this->getRow($i, $box, $all, $branch[$index]->branch_code));

                //insert data to named_box with name as key
                $named_box->put($row_name[$i - 1], $box[$i]);
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
        foreach ($branch as $index => $b) {

            $profit = (int)$this->profit;

            if (!$profit) {
                $oldprofit = $yellow[$index]["Data"]["profit"]["interest_income"];
                $oldprofit > 0 ? $profit = round(($oldprofit + 1000) / 1000) * 1000 : $profit = 0;
            }


            foreach ($green[$index]["Data"] as $key => $c) {
                switch ($key) {
                    case "loan":
                        if ($oldprofit < 0 && $this->loan_rate!= 0 && $green[$index]["Data"]["loan"]["balance"]<=0) $green[$index]["Data"]["loan"]["rate"] = (float)$this->loan_rate;
                        if ($oldprofit < 0 && $this->pio_rate!= 0 && $green[$index]["Data"]["loan"]["balance"]<=0) $green[$index]["Data"]["pio"]["rate"] = (float)$this->pio_rate;
                        // $green[$index]["Data"]["pio"]["rate"] = 6.25;
                        // $green[$index]["Data"]["dpk"]["rate"] = 5.00;
                        $green[$index]["Data"]["pio"]["interest_income"] = ($green[$index]["Data"]["pio"]["rate"]/100) * $green[$index]["Data"]["pio"]["balance"] * $month / 12;
                        $green[$index]["Data"]["bio"]["interest_income"] = ($green[$index]["Data"]["bio"]["rate"]/100) * $green[$index]["Data"]["bio"]["balance"] * $month / 12;
                        $green[$index]["Data"]["dpk"]["interest_income"] = ($green[$index]["Data"]["dpk"]["rate"]/100) * $green[$index]["Data"]["dpk"]["balance"] * $month / 12;
                        $green[$index]["Data"]["total_interest"]["interest_income"] = $green[$index]["Data"]["bio"]["interest_income"] + $green[$index]["Data"]["dpk"]["interest_income"];
                        // dd($this->pio_rate);
                        
                        // dd($green);

                        $bal = $this->calculate($profit, $month, $green[$index]);
                        $c->put("balance", $bal);
                        $c->put('interest_income', ($c["rate"] / 100) * $c["balance"] * $month / 12);
                        break;
                    case "pio":
                        $c->put('interest_income', ($c["rate"] / 100) * $c["balance"] * $month / 12);
                        break;
                    case "total":
                        $c->put('balance', $green[$index]["Data"]["loan"]["balance"] + $green[$index]["Data"]["pio"]["balance"]);
                        $c->put('interest_income', $green[$index]["Data"]["loan"]["interest_income"] + $green[$index]["Data"]["pio"]["interest_income"]);
                        break;
                    case "other":

                        break;
                    case "total_income":
                        $c->put('interest_income', $green[$index]["Data"]["total"]["interest_income"] + $green[$index]["Data"]["other"]["interest_income"]);

                        break;
                    case "dpk":
                        $c->put('interest_income', ($c['balance'] * ($c['rate'] / 100) * $month / 12));
                        break;
                    case "bio":
                        $c->put('interest_income', ($c['balance'] * ($c['rate'] / 100) * $month / 12));
                        break;
                    case "total_interest":
                        $c->put('interest_income', $green[$index]["Data"]["dpk"]["interest_income"] + $green[$index]["Data"]["bio"]["interest_income"]);
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
                        $c->put("balance", max($c["balance"], $green[$index]["Data"]["loan"]["balance"] * ($c['rate'] / 100) * $month / 12));
                        break;
                    case "operational":

                        break;
                    case "non_operational":

                        break;
                    case "total_op_cost":
                        $c->put('balance', $green[$index]["Data"]["salary"]["balance"] + $green[$index]["Data"]["rental"]["balance"] +
                            $green[$index]["Data"]["ckpn"]["balance"] + $green[$index]["Data"]["operational"]["balance"]
                            + $green[$index]["Data"]["non_operational"]["balance"]);
                        $c->put('interest_income', $c["balance"]);
                        break;
                    case "total_cost":
                        $c->put('interest_income', $green[$index]["Data"]["total_op_cost"]["balance"] + $green[$index]["Data"]["total_interest"]["interest_income"]);
                        break;
                    case "profit":
                        // dd($green[$index]["Data"]["total_income"]["interest_income"], $green[$index]["Data"]["total_cost"]["interest_income"], $green[$index]["Data"]["total_income"]["interest_income"] - $green[$index]["Data"]["total_cost"]["interest_income"]);
                        $c->put('interest_income', $green[$index]["Data"]["total_income"]["interest_income"] - $green[$index]["Data"]["total_cost"]["interest_income"]);
                        break;
                    default:

                        break;
                }
            }
        }
        return $green;
    }

    public function getRow($index, $box, $all, $branch)
    {
        $col = collect();
        switch ($index) {
            case 1:
                // change array to col?
                $col->put('balance', $all[$branch]->where('AccountNo', $this->BSCOA_1)->first()->IDRBalance);
                $col->put('interest_income', $all[$branch]->where('AccountNo', $this->PLCOA_1)->first()->IDRBalance);
                $col->put('rate', ($col['balance'] <= 0) ? 0 : ($col['interest_income'] / $col['balance'] * 12 * 100 / $this->month));
                break;
            case 2:
                $col->put('balance', $all[$branch]->where('AccountNo', $this->BSCOA_2)->first()->IDRBalance);
                $col->put('interest_income', $all[$branch]->where('AccountNo', $this->PLCOA_2)->first()->IDRBalance);
                $col->put('rate', ($col['balance'] <= 0) ? 0 : ($col['interest_income'] / $col['balance'] * 12 * 100 / $this->month));
                break;
            case 3:
                $col->put('balance', $box[1]['balance'] + $box[2]['balance']);
                $col->put('interest_income', $box[1]['interest_income'] + $box[2]['interest_income']);
                break;
            case 4:
                $col->put('interest_income', $all[$branch]->where('AccountNo', $this->PLCOA_4)->first()->IDRBalance - $box[3]['interest_income']);
                break;
            case 5:
                $col->put('interest_income', $box[3]['interest_income'] + $box[4]['interest_income']);
                break;
            case 6:
                $col->put('balance', $all[$branch]->where('AccountNo', $this->BSCOA_6_1)->first()->IDRBalance + $all[$branch]->where('AccountNo', $this->BSCOA_6_2)->first()->IDRBalance);
                $col->put('interest_income', $all[$branch]->where('AccountNo', $this->PLCOA_6)->first()->IDRBalance);
                $col->put('rate', ($col['balance'] <= 0) ? 0 : ($col['interest_income'] / $col['balance'] * 12 * 100 / $this->month));
                break;
            case 7:
                $col->put('balance', $all[$branch]->where('AccountNo', $this->BSCOA_7)->first()->IDRBalance);
                $col->put('interest_income', $all[$branch]->where('AccountNo', $this->PLCOA_7)->first()->IDRBalance);
                $col->put('rate', ($col['balance'] <= 0) ? 0 : ($col['interest_income'] / $col['balance'] * 12 * 100 / $this->month));
                break;
            case 8:
                $col->put('balance', $box[6]['balance'] + $box[7]['balance']);
                $col->put('interest_income', $box[6]['interest_income'] + $box[7]['interest_income']);
                break;
            case 9:
                $col->put('interest_income', $box[3]['interest_income'] - $box[8]['interest_income']);
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
                    $box[10]['balance'] - $box[11]['balance']);
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

    public function getAverageAll($date, $branches, $COAs)
    {
        $date->floorDay();
        $start = Carbon::createFromDate($date);
        $start->startOfYear()->endOfMonth();
        $date_arr = array($start->toDateString());
        while ($start->lte($date)) {
            array_push($date_arr, $start->addMonthNoOverflow()->endOfMonth()->toDateString());
        }
        $resBM = $this->_query($date_arr, $COAs, $branches);
        foreach ($resBM as $key => $branch) {
            $months = $branch;
            $x = array();
            $y = array();

            foreach ($months as $month) {
                foreach ($month as $coa) {
                    if (!$this->isPL($coa)) {
                        if (!isset($x[$coa->AccountNo])) {
                            $x[$coa->AccountNo] = new stdClass();
                            $x[$coa->AccountNo]->IDRBalance = 0;
                            $y[$coa->AccountNo] = 0;
                        }

                        $x[$coa->AccountNo]->IDRBalance += $coa->IDRBalance;
                        $y[$coa->AccountNo]++;
                        $x[$coa->AccountNo]->COADate = $coa->COADate;
                        $x[$coa->AccountNo]->AccountNo = $coa->AccountNo;
                        $x[$coa->AccountNo]->Branch = $coa->Branch;
                    } else {
                        $x[$coa->AccountNo] = new stdClass();
                        $x[$coa->AccountNo]->IDRBalance = $coa->IDRBalance;
                        $x[$coa->AccountNo]->COADate = $coa->COADate;
                        $x[$coa->AccountNo]->AccountNo = $coa->AccountNo;
                        $x[$coa->AccountNo]->Branch = $coa->Branch;
                    }
                }
            }

            foreach ($y as $k => $z) {
                $x[$k]->IDRBalance = $x[$k]->IDRBalance / count($date_arr);
            }
            $x = collect($x)->values();
            $resBM[$key] = $x;
        }
        return $resBM;
    }

    public function _query($dates, $COAs, $branches)
    {
        //select IDRBalance & AccoutNo only
        $branches = $branches->pluck('branch_code');
        $res = DB::connection('sqlsrv')
            ->table('T_Inoan_COAPerBranch')
            ->select('IDRBalance', 'COADate', 'AccountNo', 'Branch')
            ->whereIn('COADate', $dates)
            ->whereIn('AccountNo', $COAs->pluck('coa'))
            ->whereIn('Branch', $branches)
            ->orderBy('COADate')
            ->get();
        $res = $res->sortBy(function ($item) {
            return [$item->COADate, $item->Branch];
        });
        $this->query_count++;
        foreach ($res as $i => $r) {
            $res[$i]->IDRBalance = (float)$r->IDRBalance / 1000000;
        }

        $resBM = $res->groupBy(['Branch', 'COADate']);
        foreach ($resBM as $keyBM => $resB) {
            foreach ($resB as $keyB => $resM) {
                if (count($COAs) != count($resM)) {
                    $plucked = $resM->pluck('AccountNo')->toArray();
                    $diff = array_diff($COAs->pluck('coa')->toArray(), $plucked);

                    foreach ($diff as $d) {
                        $resM->push(clone $resM[0]);
                        $resM->last()->IDRBalance = 0;
                        $resM->last()->AccountNo = $d;
                    }
                    $resB[$keyB] = $resM->sortBy('AccountNo')->values();
                }
            }
        }
        return $resBM;
    }
    public function calculate($target, $month, $box)
    {
        //if profit = 1000
        //adjust bal, check CKPN
        //if CKPN changes.. profit must be different, so keep looping
        //If CKPN doesn't change, profit must be the same, so break
        //if profit not 1000, keep looping, else break
        $balance = $this->calcGoalSeek($target, $month, $box);
        return $balance;
    }

    public function calcGoalSeek($expected_result, $month, $box)
    {
        //Instantiate your class
        $goalseek = new GoalSeekController();
        //$goalseek->debug = true;
        //I want to know which input needs callbackTest to give me 301
        $rate = $box["Data"]["loan"]["rate"] / 100;
        $IC = $box["Data"]["total_interest"]["interest_income"];
        $PIO = $box["Data"]["pio"]["balance"] * $box["Data"]["pio"]["rate"] / 100 * $month / 12;

        $S = $box["Data"]["salary"]["balance"] + $box["Data"]["rental"]["balance"]
            + $box["Data"]["operational"]["balance"] + $box["Data"]["non_operational"]["balance"];
        $C = $box["Data"]["other"]["interest_income"];
        $CKPN_Prev =  $box["Data"]["ckpn"]["balance"];
        //Calculate the input to get you goal, with accuracy
        // dd($expected_result, $rate, $IC, $PIO, $S, $C, $CKPN_Prev, $month);
        $input = $goalseek->calculate('callbackTest', $expected_result, 100, $rate, $IC, $PIO, $S, $C, $CKPN_Prev, $month);

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
    public function getCOA()
    {
        return DB::connection('mysql')
            ->table('coa')
            ->select('coa', 'coa_name', 'bs_pl')
            ->get();
    }

    public function getBranch()
    {
        return DB::connection('mysql')
            ->table('branch')
            ->select('branch_code', 'branch_name')
            ->get();
    }
    public function isPL($coa)
    {
        $coas = $this->getCOA();
        return $coas->where('coa', $coa->AccountNo)->first()->bs_pl == 2;
    }

    public function queryScenario(Request $request)
    {
        $month = $request->input('month');
        $year = $request->input('year');
        $branch = $request->input('branch');
        $date = Carbon::create($year, $month)->endOfMonth();
        $this->month = $month;
        $branch = $this->getBranch()->where('branch_code', $branch);
        $COA = $this->getCOA();
        $all = $this->getAverageAll($date, $branch, $COA);
        if (!$all->keys()->contains($branch->first()->branch_code)) return [];
        $yellow = $this->getYellow($date, $branch, $all);
        $resource = collect();
        $resource->month = $month;
        $resource->branch = $branch->first()->branch_code;
        $this->ifFilledThenInput('projection_month', $request);
        $resource->projection_month = $this->projection_month;

        foreach (['profit', 'loan_bal', 'loan_rate', 'pio_bal', 'pio_rate', 'dpk_bal', 'dpk_rate', 'bio_bal', 'bio_rate', 'ckpn_rate'] as $param) {
            if ($request->filled($param)) {
                $resource->put($param, $request->input($param));
            }
        }
        return $this->getFromResources($resource, $yellow);
    }

    public function getFromResources($resource, $yellow)
    {
        $res = unserialize(serialize($yellow));
        $index = $yellow->where("Kode_Cabang", (string)$resource->branch)->keys()->first();
        if ($resource->has('profit')) {
            $profit = $resource['profit'];
            $loan_bal = $this->calculate($profit, $resource->month, $yellow[$index]);
        } else {
            $loan_bal = $resource->has('loan_bal') ? $resource['loan_bal'] : $yellow[$index]['Data']['loan']['balance'];
            $profit = null;
        }


        $loan_rate = $resource->has('loan_rate') ? $resource['loan_rate'] : $yellow[$index]['Data']['loan']['rate'];
        $pio_bal = $resource->has('pio_bal') ? $resource['pio_bal'] : $yellow[$index]['Data']['pio']['balance'];
        $pio_rate = $resource->has('pio_rate') ? $resource['pio_rate'] : $yellow[$index]['Data']['pio']['rate'];
        $dpk_bal = $resource->has('dpk_bal') ? $resource['dpk_bal'] : $yellow[$index]['Data']['dpk']['balance'];
        $dpk_rate = $resource->has('dpk_rate') ? $resource['dpk_rate'] : $yellow[$index]['Data']['dpk']['rate'];
        $bio_bal = $resource->has('bio_bal') ? $resource['bio_bal'] : null;
        $bio_rate = $resource->has('bio_rate') ? $resource['bio_rate'] : $yellow[$index]['Data']['bio']['rate'];
        $ckpn_rate = $resource->has('ckpn_rate') ? $resource['ckpn_rate'] : 1;


        $res[$index]['Data']['loan']['balance'] = $this->hasProjection() ?
            (float)$loan_bal / $resource->month * $this->projection_month : (float)$loan_bal;
        $res[$index]['Data']['loan']['rate'] = (float)$loan_rate;
        $res[$index]['Data']['loan']['interest_income'] = $this->hasProjection() ?
            (float)$loan_rate / 100 * $res[$index]['Data']['loan']['balance'] : (float)$loan_rate / 100 * $loan_bal * $resource->month / 12;

        $res[$index]['Data']['pio']['balance'] = (float)$pio_bal;
        $res[$index]['Data']['pio']['rate'] = $pio_bal == 0 ? 0 : (float)$pio_rate;
        $res[$index]['Data']['pio']['interest_income'] = (float)$pio_rate / 100 * $pio_bal * $resource->month / 12;

        $res[$index]['Data']['total']['balance'] = (float)$res[$index]['Data']['loan']['balance'] + $res[$index]['Data']['pio']['balance'];
        $res[$index]['Data']['total']['interest_income'] = (float)$res[$index]['Data']['loan']['interest_income'] + $res[$index]['Data']['pio']['interest_income'];

        $res[$index]['Data']['total_income']['interest_income'] = (float)$res[$index]['Data']['total']['interest_income'] + $res[$index]['Data']['other']['interest_income'];

        $res[$index]['Data']['dpk']['balance'] = $this->hasProjection() ?
            (float)$dpk_bal / $resource->month * $this->projection_month : (float)$dpk_bal;
        $res[$index]['Data']['dpk']['rate'] = $dpk_bal == 0 ? 0 : (float)$dpk_rate;
        $res[$index]['Data']['dpk']['interest_income'] = $this->hasProjection() ?
            (float)$dpk_rate / 100 * $res[$index]['Data']['dpk']['balance'] : (float)$dpk_rate / 100 * $res[$index]['Data']['dpk']['balance'] * $resource->month / 12;

        if ($bio_bal == null) $bio_bal = $res[$index]['Data']['total']['balance'] - $res[$index]['Data']['dpk']['balance'];
        $res[$index]['Data']['bio']['balance'] = (float)$bio_bal;
        $res[$index]['Data']['bio']['rate'] = $bio_bal == 0 ? 0 : (float)$bio_rate;
        $res[$index]['Data']['bio']['interest_income'] = (float)$bio_rate / 100 * $res[$index]['Data']['bio']['balance'] * $resource->month / 12;

        $res[$index]['Data']['total_interest']['balance'] = (float)$res[$index]['Data']['dpk']['balance'] + $res[$index]['Data']['bio']['balance'];
        $res[$index]['Data']['total_interest']['interest_income'] = (float)$res[$index]['Data']['dpk']['interest_income'] + $res[$index]['Data']['bio']['interest_income'];

        $res[$index]['Data']['net']['interest_income'] = (float)$res[$index]['Data']['total']['interest_income'] - $res[$index]['Data']['total_interest']['interest_income'];

        if ($this->hasProjection()) $res[$index]['Data']['salary']['balance'] = (float)$res[$index]['Data']['salary']['balance'] / $resource->month * $this->projection_month;
        if ($this->hasProjection()) $res[$index]['Data']['rental']['balance'] = (float)$res[$index]['Data']['rental']['balance'] / $resource->month * $this->projection_month;
        if ($this->hasProjection()) $res[$index]['Data']['operational']['balance'] = (float)$res[$index]['Data']['operational']['balance'] / $resource->month * $this->projection_month;
        if ($this->hasProjection()) $res[$index]['Data']['non_operational']['balance'] = (float)$res[$index]['Data']['non_operational']['balance'] / $resource->month * $this->projection_month;

        $res[$index]['Data']['ckpn']['balance'] = $this->hasProjection() ?
            (float)max($res[$index]['Data']['ckpn']['balance'], $res[$index]['Data']['loan']["balance"] * ($res[$index]['Data']['ckpn']['rate'] / 100)) :
            (float)max($res[$index]['Data']['ckpn']['balance'], $res[$index]['Data']['loan']["balance"] * ($res[$index]['Data']['ckpn']['rate'] / 100) * $resource->month / 12);
        $res[$index]['Data']['ckpn']['rate'] = (float)$ckpn_rate;

        $res[$index]['Data']['total_op_cost']['balance'] = (float)$res[$index]['Data']['salary']['balance'] + $res[$index]['Data']['rental']['balance']
            + $res[$index]['Data']['ckpn']['balance'] + $res[$index]['Data']['operational']['balance'];
        $res[$index]['Data']['total_op_cost']['interest_income'] = $res[$index]['Data']['total_op_cost']['balance'];

        $res[$index]['Data']['total_cost']['interest_income'] = $res[$index]['Data']['total_interest']['interest_income'] + $res[$index]['Data']['total_op_cost']['interest_income'];

        if ($profit == null) $profit = $res[$index]['Data']['total_income']['interest_income'] - $res[$index]['Data']['total_cost']['interest_income'];
        $res[$index]['Data']['profit']['interest_income'] = (float)$profit;

        return $res[$index];
    }
    private function ifFilledThenInput($string, Request $request)
    {
        if ($request->filled($string)) $this->$string = $request->input($string);
    }
    private function hasProjection()
    {
        return $this->projection_month != 0;
    }

    private function getAvgLoan($branch, $date)
    {
        if (count($branch) == 1) $branch = $this->getBranch();
        $COA = $this->getCOA()->where('coa', 15420000);
        $data = $this->getAverageAll($date, $branch, $COA);
        $total = 0;
        $count = 0;
        foreach ($data as $collection) {
            foreach ($collection as $item) {
                if ($item->IDRBalance != 0) {
                    $total += $item->IDRBalance;
                    $count++;
                }
            }
        }
        return $total / $count;
    }
}
