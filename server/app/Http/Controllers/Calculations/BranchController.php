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
        
        $branches = DB::connection('mysql')
        ->table('branch')
        ->select('branch_code','branch_name')
        ->get();
        return $branches;
    }
    
}