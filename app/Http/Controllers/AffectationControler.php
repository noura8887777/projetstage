<?php

namespace App\Http\Controllers;

use App\Models\Affectation;
use App\Models\User;
use Illuminate\Http\Request;

class AffectationControler extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $affectaion=Affectation::with(['courriers','users'])->get();
        return response()->json(['data'=>$affectaion]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $users = User::select('id', 'name')->get();
        
        return response()->json([
            'success' => true,
            'user' => $users
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'courrier_id' => 'required|exists:courriers,id',
            'reponse' => 'required|boolean',
            'duree_reponse' => 'required|integer|max:48'
        ]);

        $affectation = Affectation::create([
            'user_id' => $request->input('user_id'),
            'courrier_id' => $request->input('courrier_id'),
            'reponse' => $request->input('reponse'),
            'duree_reponse' => $request->input('duree_reponse')
        ]);

        return response()->json([
            'success' => true,
            'data' => $affectation,
            'message' => 'Affectation créée avec succès'
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $affectaion = Affectation::findOrFail($id);
        $affectaion->delete();
        return response()->json([
            'success' => true,
            'message' => 'affectation supprimé avec succès'
        ]); 
    }
}
