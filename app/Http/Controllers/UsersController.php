<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{
    public function index(){
        $users=User::with('role')->get();
        $roles=Role::all();
    return response()->json(['users'=> UserResource::collection($users),'roles'=>$roles]);  
   }
    public function store(Request $req){
        $req->validate([
            'name' => 'required|string|max:25',
            'email' => 'required|email|unique:users|max:50',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id',
        ],[
            'name'=>"name non valide",
            'email'=>"email non valide",
            'password'=>"mot de passe non valide"
        ]);
        
        $user = User::create([
            'name'=>$req->name,
            'email'=>$req->email,
            'password'=>Hash::make($req->password),
            'role_id'=>$req->role_id
        ]);
        
        return response()->json(['msg'=>'Ce utilisateur est ajouté avec success', 'user' => UserResource::make($user)]);
    }
    public function update(Request $req,$id){
        $user=User::findOrFail($id);
        $req->validate([
            'name' => 'required|string|max:25',
            'email' => 'required|email|max:50',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id',
        ],[
            'name'=>"name non valide",
            'email'=>"email non valide",
            'password'=>"mot de passe non valide",
            'role_id'=>"role non valide"
        ]);
        $user->update([
            'name'=>$req->name,
            'email'=>$req->email,
            'password'=>$req->password ? Hash::make($req->password) : $user->password,
            'role_id'=>$req->role_id
        ]);
        return response()->json(['msg'=>'Ce utilisateur est modifié avec success', 'user' => UserResource::make($user)]);
    }
    public function destroy($id){
        $user=User::findOrFail($id);
        $user->delete();
        return response()->json(['msg'=>'Ce utilisateur est supprimé avec success']);

    }
}