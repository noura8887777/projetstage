<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index(){
        $roles=Role::all();
        return response()->json(['roles'=>$roles]);
    }
    public function store(Request $req){
        $req->validate([
            'nom_role' => 'required|string|max:25',
        ],[
            'nom_role'=>"nom de role non valide",
        ]);
        $role = Role::create([
            'nom_role'=>$req->nom_role,
        ]);
        return response()->json(['msg'=>'Ce role est ajouté avec success', 'role' => $role]);
    }
    public function update(Request $req,$id){
        $role=Role::findOrFail($id);
        $req->validate([
            'nom_role' => 'required|string|max:20',
        ],[
            'nom_role'=>"nom de role non valide",
        ]);
        $role->update([
            'nom_role'=>$req->nom_role,
        ]);
        return response()->json(['msg'=>'Ce role est modifié avec success', 'role' => $role]);
    }
    public function destroy($id){
        $role=Role::findOrFail($id);
        $role->delete();
        return response()->json(['msg'=>'Ce role est supprimé avec success']);
    }
}
