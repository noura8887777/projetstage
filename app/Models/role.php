<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Role extends Model
{     
    Use SoftDeletes,HasFactory;
    Protected $dates = ['deleted_at']; 
    protected $fillable = ['nom_role']; 
    
    public function utilisateurs(){
       return $this->hasMany(User::class ,'role_id');
    }
}
