<?php

namespace App\Http\Controllers\Calculations;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BSController extends Controller
{
    public function queryBS(Request $request)
    {
        $wrapper = collect();
        //$date = Carbon::createFromDate($year, $month, Carbon::create($year,$month)->endOfMonth()->day);
        $date_origin = Carbon::today();
        if (!$date_origin->isSameDay(Carbon::today()->endOfMonth())) $date_origin->subMonthNoOverflow();
        $date_origin->endOfMonth();

        $month = $date_origin->month;
        $date = Carbon::createFromDate($date_origin);
        $branches = DB::table('branch')->select('*')->get();
        $coas = DB::table('coa')->select('*')->where('BS_PL', 1)->get()->pluck('coa');
        for ($curr_month = 1; $curr_month <= $month; $curr_month++) {
            $result = collect();


            foreach ($coas as $c) {
                $temp_date = Carbon::create($date->year, $curr_month)->endOfMonth()->toDateString();
                $res = DB::connection('sqlsrv')
                    ->table('T_Inoan_COAAllBranch')
                    ->select('*')
                    ->where('COADate', $temp_date)
                    ->where('AccountNo', $c)
                    ->first();

                $res = collect($res);
                $COA_query = collect();
                $COA_query['COA_date'] = $res->get("COADate");
                $COA_query['COA_name'] = $res->get("AccountNameID");
                $COA_query['COA_num'] = $res->get("AccountNo");

                $branch_array = array();

                $b_data['branch_name'] = $branches->pluck('branch_name');
                $b_data['branch_code'] = $branches->pluck('branch_code');
                $i = 0;
                foreach ($branches as $b) {
                    $b_array = array();

                    $b_array['branch_name'] = $b_data['branch_name'][$i];
                    $b_array['branch_code'] = $b_data['branch_code'][$i];
                    if ($res[$b_array['branch_code']] == null) {
                        $temp = $this->getBSPerBranch($temp_date, $c, $b_array['branch_code'])->first();
                        if ($temp == null) $b_array['value'] = "0";
                        else $b_array['value'] = number_format((float)$temp->IDRBalance / 1000000);
                    } else if (@$res[$b->branch_code]) {
                        $b_array['value'] = number_format((float)($res[$b->branch_code]) / 1000000);
                    } else $b_array['value'] = "0";

                    array_push($branch_array, $b_array);
                    $i++;
                }
                $COA_query['Branches'] = $branch_array;
                $result->push($COA_query);
            }

            $wrapper->push($result);
        }

        return $wrapper;
    }

    public function getBSPerBranch($date, $coa, $branch)
    {
        return DB::connection('sqlsrv')
            ->table('T_Inoan_COAPerBranch')
            ->select('*')
            ->where('COADate', $date)
            ->where('AccountNo', $coa)
            ->where('Branch', $branch)
            ->get();
    }
}
