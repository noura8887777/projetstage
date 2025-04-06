<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TypeCourrier extends Model
{
    use HasFactory,SoftDeletes;
    
    Protected $dates = ['deleted_at']; 
    protected $fillable=['nom_type'];

    public function courriers(){
        return $this->hasMany(courrier::class);
    }

}
