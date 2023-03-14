<?php

namespace App\Http\Controllers\Calculations;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BranchController extends Controller
{
    public function queryBranch(Request $request)
    {   
        $branches = $this->getBranchNum()->pluck('COLUMN_NAME');
        $branch = collect();
        foreach($branches as $b){
            $branch->push(DB::connection('sqlsrv')
            ->table('T_Inoan_Branch')
            ->select('BR_NO as branch_code, ')
            ->where('BR_NO' ,$b)
            ->first());
        }
        return $branches;
    }
    
    public function getBranchNum(){
        $branches = DB::connection('sqlsrv')
        ->table('INFORMATION_SCHEMA.COLUMNS')
        ->select('COLUMN_NAME')
        ->where('TABLE_NAME', 'T_Inoan_COAAllBranch')
        ->get();
        $branchNum = $branches->filter(function ($value, $key){
            return is_numeric($value->COLUMN_NAME);
        });
        $branchNum->map(function ($value){
            return (int) $value->COLUMN_NAME;
        });
        return $branchNum->values();
    }
}