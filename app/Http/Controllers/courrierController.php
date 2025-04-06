<?php

namespace App\Http\Controllers;

use App\Models\Courrier;
use App\Models\TypeCourrier;
use App\Models\Fichier;
use App\Models\Statut;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Mail\SendCourrierMail;
use Illuminate\Support\Facades\Mail;
class CourrierController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    // app/Http/Controllers/CourrierController.php

public function index(Request $request)
{
    $perPage = $request->input('per_page', 10); // 10 éléments par page par défaut
    $page = $request->input('page', 1); // Page 1 par défaut

    $query = Courrier::query()
        ->with(['fichier', 'type_courriers', 'statuts','users'])
        ->orderBy('created_at', 'desc');  

    $courriers = $query->paginate($perPage, ['*'], 'page', $page);

    return response()->json([
        'success' => true,
        'data' => $courriers->items(),
        'pagination' => [
            'total' => $courriers->total(),
            'per_page' => $courriers->perPage(),
            'current_page' => $courriers->currentPage(),
            'last_page' => $courriers->lastPage(),
            'from' => $courriers->firstItem(),
            'to' => $courriers->lastItem()
        ]
    ]);
}
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function editReponse($id){
        $reponseMod = Courrier::with(['fichier'])->findOrFail($id);
        return response()->json([
            'success'=>true,
            'data'=>[
                'reponseMod'=>$reponseMod,
            ],
        ]);
    }
    public function updateReponse(Request $request, $id){
        $request->validate([
            'num_order_annuel' => 'required|string|max:255',
            'date_lettre' => 'required|date',
            'num_lettre' => 'required|string|max:255',
            'designation_destinataire' => 'required|string|max:255',
            'analyse_affaire' => 'required|string',
            'date_reponse' => 'nullable|date',
            'fichier' => 'nullable|file|mimes:pdf,doc,docx,xlsx|max:10240'
        ]);
        $reponse = Courrier::with(['fichier'])->findOrFail($id);
        if ($request->hasFile('fichier')) {
            $file = $request->file('fichier');
            $extension = $file->getClientOriginalExtension();
            $nom_fichier = 'courrier_' . $reponse->id . '.' . $extension;
            if ($reponse->fichier) {
                Storage::disk('public')->delete('courriers/' . $reponse->fichier->chemin);
                $reponse->fichier->update(['chemin' => $nom_fichier]);
            } else {
                $fichier = Fichier::create(['chemin' => $nom_fichier]);
                $reponse->fichier_id = $fichier->id;
            }
            $file->storeAs('courriers', $nom_fichier, 'public');
        }
        $reponse->update([
            'num_order_annuel' => $request->input('num_order_annuel'),
            'date_lettre' => $request->input('date_lettre'),
            'num_lettre' => $request->input('num_lettre'),
            'designation_destinataire' => $request->input('designation_destinataire'),
            'analyse_affaire' => $request->input('analyse_affaire'),
            'date_reponse' => $request->input('date_reponse'),
        ]);
        return response()->json([
            'success' => true,
            'data' => $reponse,
            'message' => 'reponse mis à jour avec succès'
        ]);
    }
    public function create()
    {
            $types = TypeCourrier::select('id', 'nom_type')->get();
            $statuts = Statut::select('id', 'nom_statut')->get();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'types' => $types,
                    'statuts' => $statuts
                ]
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
       // dd($request->all());
        $request->validate([
            'num_order_annuel' => 'required|string|max:255',
            'date_lettre' => 'required|date',
            'num_lettre' => 'required|string|max:255',
            'designation_destinataire' => 'required|string|max:255',
            'analyse_affaire' => 'required|string',
            'date_reponse' => 'nullable|date',
            'num_reponse' => 'nullable|string|max:255',
            'type_courrier_id' => 'required|exists:type_courriers,id',
            'statut_id' => 'required|exists:statuts,id',
            'fichier' => 'nullable|file|mimes:pdf,doc,docx,xlsx|max:10240',
            'user_id' =>'nullable|exists:users,id',
            'idDepart'=>'nullable|exists:courriers,id'
        ]);
        //$userId = auth()->id();
        $fichierId = null;
    
        if ($request->hasFile('fichier')) {
            $file = $request->file('fichier');
            $extension = $file->getClientOriginalExtension();
            $nom_fichier = 'courrier_' . time() . '.' . $extension;
            $file->storeAs('courriers', $nom_fichier, 'public');
            
            $fichier = Fichier::create([
                'chemin' => $nom_fichier
            ]);
            
            $fichierId = $fichier->id;
        }
        
        $courrier = Courrier::create([
            'num_order_annuel' => $request->input('num_order_annuel'),
            'date_lettre' => $request->input('date_lettre'),
            'num_lettre' => $request->input('num_lettre'),
            'designation_destinataire' => $request->input('designation_destinataire'),
            'analyse_affaire' => $request->input('analyse_affaire'),
            'date_reponse' => $request->input('date_reponse'),
            'num_reponse' => $request->input('num_reponse'),
            'type_courrier_id' => $request->input('type_courrier_id'),
            'statut_id' => $request->input('statut_id'),
            'user_id' => 1,
            'date' => now(),
            'fichier_id' =>$fichierId
        ]);
        
        return response()->json([
            'success' => true,
            'data' => $courrier,
            'message' => 'Nouveau courrier ajouté avec succès'
        ]);
}
public function storeReponse(Request $request, $courrier)
{
    // Validation similaire à store() mais adaptée aux réponses
    $request->validate([
            'num_order_annuel' => 'required|string|max:255',
            'date_lettre' => 'required|date',
            'num_lettre' => 'required|string|max:255',
            'designation_destinataire' => 'required|string|max:255',
            'analyse_affaire' => 'required|string',
            'date_reponse' => 'nullable|date',
            'num_reponse' => 'nullable|string|max:255',
            'type_courrier_id' => 'nullable|exists:type_courriers,id',
            'statut_id' => 'nullable|exists:statuts,id',
            'fichier' => 'nullable|file|mimes:pdf,doc,docx,xlsx|max:10240',
            'user_id' =>'nullable|exists:users,id'
    ]);
    $fichierId = null;
    if ($request->hasFile('fichier')) {
        $file = $request->file('fichier');
        $extension = $file->getClientOriginalExtension();
        $nom_fichier = 'reponse_'.time().'.'.$extension;
        $file->storeAs('courriers', $nom_fichier, 'public');
        
        $fichier = Fichier::create(['chemin' => $nom_fichier]);
        $fichierId = $fichier->id;
    }
    $reponse = Courrier::create([
        'num_order_annuel' => $request->input('num_order_annuel'),
        'date_lettre' => $request->input('date_lettre'),
        'num_lettre' => $request->input('num_lettre'),
        'designation_destinataire' => $request->input('designation_destinataire'),
        'analyse_affaire' => $request->input('analyse_affaire'),
        'date_reponse' => $request->input('date_reponse'),
        'type_courrier_id' => null,
        'statut_id' => null,
        'user_id' =>auth()->id() ?? 1,
        'date' => now(),
        'fichier_id' => $fichierId,
        'idDepart' => $courrier
    ]);

    if ($request->filled('idDepart')) {
        
        $courrierParent = Courrier::findOrFail($request->input('idDepart'));
        
        // Compter le nombre d'affectations et de réponses
        $totalAffectations = $courrierParent->affectations()->count();
        $totalReponses = Courrier::where('idDepart', $courrierParent->id)->count();


        // Si toutes les affectations ont répondu
        if ($totalAffectations === $totalReponses) {
            $statutTermine = Statut::where('nom_statut', 'Terminé')->first();
            $courrierParent->statut_id =  $statutTermine->id;
            $courrierParent->save();
        }
    }
    return response()->json([
        'success' => true,
        'data' => $reponse,
        'message' => 'Réponse enregistrée avec succès'
    ]);
}
public function getReponses($courrier)
{
    $reponses = Courrier::where('iddepart', $courrier)
        ->with(['fichier', 'statuts', 'type_courriers'])
        ->get();

    return response()->json([
        'success' => true,
        'data' => $reponses
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
    
        $courrier = Courrier::with([
            'users',
            'affectations' => function($aff) {$aff->with(['users']);},
            'type_courriers',
            'statuts',
            'fichier'
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $courrier,
            'message' => 'Détail du courrier'
        ]);
}

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
            $currierMod = Courrier::with(['fichier', 'type_courriers', 'statuts'])->findOrFail($id);
            $types = TypeCourrier::select('id', 'nom_type')->get();
            $statuts = Statut::select('id', 'nom_statut')->get();
            return response()->json([
                'success'=>true,
                'data'=>[
                    'currierMod'=>$currierMod,
                    'types'=>$types,
                    'statuts'=>$statuts
                ],
            ]);
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
            'num_order_annuel' => 'required|string|max:255',
            'date_lettre' => 'required|date',
            'num_lettre' => 'required|string|max:255',
            'designation_destinataire' => 'required|string|max:255',
            'analyse_affaire' => 'required|string',
            'date_reponse' => 'nullable|date',
            'num_reponse' => 'nullable|string|max:255',
            'type_courrier_id' => 'nullable|exists:type_courriers,id',
            'statut_id' => 'nullable|exists:statuts,id',
            'fichier' => 'nullable|file|mimes:pdf,doc,docx,xlsx|max:10240'
        ]);

        return response()->json([
            'success' => true,
            'data' => $request->all(),
        ]);


        $courrier = Courrier::with(['fichier', 'type_courriers', 'statuts'])->findOrFail($id);
        if ($request->hasFile('fichier')) {
            $file = $request->file('fichier');
            $extension = $file->getClientOriginalExtension();
            $nom_fichier = 'courrier_' . $courrier->id . '.' . $extension;
            if ($courrier->fichier) {
                Storage::disk('public')->delete('courriers/' . $courrier->fichier->chemin);
                $courrier->fichier->update(['chemin' => $nom_fichier]);
            } else {
                $fichier = Fichier::create(['chemin' => $nom_fichier]);
                $courrier->fichier_id = $fichier->id;
            }
            $file->storeAs('courriers', $nom_fichier, 'public');
        }
        $courrier->update([
            'num_order_annuel' => $request->input('num_order_annuel'),
            'date_lettre' => $request->input('date_lettre'),
            'num_lettre' => $request->input('num_lettre'),
            'designation_destinataire' => $request->input('designation_destinataire'),
            'analyse_affaire' => $request->input('analyse_affaire'),
            'date_reponse' => $request->input('date_reponse'),
            'num_reponse' => $request->input('num_reponse'),
            'type_courrier_id' => $request->input('type_courrier_id'),
            'statut_id' => $request->input('statut_id')
        ]);
        return response()->json([
            'success' => true,
            'data' => $courrier,
            'message' => 'Courrier mis à jour avec succès'
        ]);
        
}
    


    public function showFile($id)
    {
            $fichier = Fichier::findOrFail($id);
            
            if ($fichier==null) {
                return  response()->json([
                        'success'=>false,
                        'message'=>'Aucun fichier trouve pour ce courrier'
                ]);
            }

            $filePath = storage_path('app/public/courriers/' .$fichier->chemin);
            
            if (!file_exists($filePath)) {
                return  response()->json([
                    'success'=>false,
                    'message'=>'Le fichier n\'existe pas'
            ]);
            }

           // return response()->file($filePath);
            return response()->download($filePath);
          
        
    }


   

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
            $courrier = Courrier::findOrFail($id);
            if ($courrier->fichier) {
                Storage::disk('public')->delete('courriers/' . $courrier->fichier->chemin);
                $courrier->fichier->delete();
            }
            $courrier->delete();
            return response()->json([
                'success' => true,
                'message' => 'Courrier supprimé avec succès'
            ]); 
    }

    public function sendEmail(Request $request, $id)
    {
        $request->validate([
            'email' => 'required|email',
            'content' => 'required|string', // Contenu HTML depuis React
        ]);

        $courrier = Courrier::findOrFail($id);
        $recipientEmail = $request->input('email');
        $content = $request->input('content');

        Mail::to($recipientEmail)->send(new SendCourrierMail($courrier, $content));

        return response()->json([
            'success' => true,
            'message' => 'Courrier envoyé par email avec succès.',
        ]);
    }
}