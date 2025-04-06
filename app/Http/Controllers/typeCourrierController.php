<?php

namespace App\Http\Controllers;

use App\Models\TypeCourrier;
use Illuminate\Http\Request;

class typeCourrierController extends Controller
{
   public function index(){
      $typeCourriers=TypeCourrier::all();
      return response()->json(['typeCourriers'=>$typeCourriers]);
   }
   public function store(Request $req){
       $req->validate([
           'nom_type' => 'required|string|max:25',
       ],[
           'nom_type'=>"nom de type de courrier non valide",
       ]);
        $typeCourrier = TypeCourrier::create([
             'nom_type'=>$req->nom_type,
        ]);
        return response()->json(['msg'=>'Ce type de courrier est ajouté avec success', 'typeCourrier' => $typeCourrier]);
   }
   public function update(Request $req,$id){
       $typeCourrier=TypeCourrier::findOrFail($id);
       $req->validate([
           'nom_type' => 'required|string|max:20',
       ],[
           'nom_type'=>"nom de type de courrier non valide",
       ]);
       $typeCourrier->update([
           'nom_type'=>$req->nom_type,
       ]);
       return response()->json(['msg'=>'Ce type de courrier est modifié avec success', 'typeCourrier' => $typeCourrier]);
   }
   public function destroy($id){
       $typeCourrier=TypeCourrier::findOrFail($id);
       $typeCourrier->delete();
       return response()->json(['msg'=>'Ce type de courrier est supprimé avec success']);
   }
}
