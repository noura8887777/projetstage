<?php

namespace App\Http\Controllers;

use App\Models\Statut;
use Illuminate\Http\Request;

class StatutController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $statuts = Statut::orderBy('nom_statut')->get();
        return response()->json($statuts);
        // return view('statut.index', compact('statuts'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        // return view('statut.create');
        return response()->json();
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
            'nom_statut' => 'required|string|max:255|unique:statuts'
        ]);
            $NewStatut=Statut::create(['nom_statut' => $request->nom_statut]);
            return response()->json([
                'success'=>true,
                'data'=>$NewStatut
                 
            ]);
            // return redirect()->route('statut.index')->with('success', 'Statut créé avec succès');
            // return back() ->with('error', 'Erreur lors de la création du statut')->withInput();
        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $listCourrierStatut=Statut::with(['courriers','type_courriers','users'])->findOrFail($id);
        return response()->json([
            'success'=>true,
            'data'=>$listCourrierStatut,
        ]);
        // return view('statut.show' ,compact('listCourrierStatut'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $statut = Statut::findOrFail($id);
        return response()->json([
            'success'=>true,
            'statut'=>$statut
        ]);
        // return view('statut.edit', compact('statut'));
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
        $request->validate([
            'nom_statut' => 'required|string|max:255|unique:statuts,nom_statut,'.$id
        ]);

         $statut = Statut::findOrFail($id);
            $statut->update(['nom_statut' => $request->nom_statut]);
            return response()->json([
            'success'=>true,
            'statut'=>$statut
           ]);
            // return redirect()->route('statut.index')->with('success', 'Statut modifié avec succès');
            // return back()->with('error', 'Erreur lors de la modification du statut')
            //     ->withInput();
        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
            $statut = Statut::findOrFail($id);
            
            // verifier si le statut est utilise par des courriers
            if ($statut->courriers()->count() > 0) {
                return response()->json([
                    'message'=>'Ce statut ne peut pas être supprimé car il est utilisé par des courriers'
                ]);
                // return back()->with('error', 'Ce statut ne peut pas être supprimé car il est utilisé par des courriers');
            }

            $statut->delete();
            return response()->json([
                'message'=> 'Statut supprimé avec succès'
            ]);
            // return redirect()->route('statut.index')->with('success', 'Statut supprimé avec succès');
            // return back()->with('error', 'Erreur lors de la suppression du statut');
        
    }
}
