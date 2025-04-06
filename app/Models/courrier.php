<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Courrier extends Model
{ 
    use SoftDeletes;
    protected $dates=['deleted_at'];
    use HasFactory;
    protected $fillable=['date','num_order_annuel','date_lettre','num_lettre','designation_destinataire'
    ,'analyse_affaire','date_reponse', 'num_reponse','user_id','statut_id','fichier_id','type_courrier_id','idDepart'];
    public function users(){
        return $this->belongsTo(User::class,'user_id');
    }
    public function fichier(){
        return $this->belongsTo(Fichier::class,'fichier_id');
    }
    public function statuts(){
        return $this->belongsTo(Statut::class,'statut_id');
    }
    public function type_courriers(){
        return $this->belongsTo(TypeCourrier::class,'type_courrier_id');
    }
    public function affectations(){
       return $this->hasMany(Affectation::class);
    }
    public function reponses()
    {
    return $this->hasMany(Courrier::class, 'idDepart');
    }
    public function parent()
    {
    return $this->belongsTo(Courrier::class, 'idDepart');
    }
}
