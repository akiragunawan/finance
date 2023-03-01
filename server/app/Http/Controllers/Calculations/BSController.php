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
        $year = $request->input('year');
        $month = $request->input('month');
        $date = Carbon::createFromDate($year, $month, Carbon::create($year,$month)->endOfMonth()->day)->toDateString();
        
        $result=collect();
        $branches = explode(',', config('auth.branches'));
        $coas = explode(',', config('auth.bs_coa'));
        foreach($coas as $c){
            $res = DB::table('T_Inoan_COAAllBranch')
            ->select('*')
            ->where('COADate', $date)
            ->where('AccountNo', $c)
            ->first();
            $res = collect($res);
            $COA_query = collect();
            $COA_query['COA_date'] = $res->get("COADate");
            $COA_query['COA_name'] = $res->get("AccountNameID");
            $COA_query['COA_num'] = $res->get("AccountNo");
            
            $branch_array = array();
            $b_array = array();
            $b_data['branch_name'] = explode(',', config('auth.branches_name'));
            $b_data['branch_code'] = explode(',', config('auth.branches'));
            $i = 0;
            foreach($branches as $b){
                $b_array['branch_name'] = $b_data['branch_name'][$i];
                $b_array['branch_code'] = $b_data['branch_code'][$i];
                if($b_array['branch_code']=='1108'){
                    $temp = $this->getBSPerBranch($date, $c, '1108')->first();
                    $temp = collect($temp);
                    $b_array['value'] = number_format((float)$temp->get('IDRBalance')/1000000);
                }
                else $b_array['value'] = number_format((float)($res->get($b))/1000000);
                array_push($branch_array, $b_array);
                $i++;
            }
            $COA_query['Branches'] = $branch_array;
            $result->push($COA_query);
        }
        $wrapper = collect();
        $wrapper->put($date, $result);
        return $wrapper;
    }

    public function getBSPerBranch($date, $coa, $branch)
    {
        return DB::table('T_Inoan_COAPerBranch')
        ->select('*')
        ->where('COADate', $date)
        ->where('AccountNo', $coa)
        ->where('Branch', $branch)
        ->get();
    }
}
