<?php

namespace App\Http\Controllers;

use App\Models\Courrier;
use App\Models\User;
use App\Models\Fichier;
use App\Models\Statut;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Mail\SendCourrierMail;
use App\Models\Affectation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class courrierChefController extends Controller
{
    public function indexchef(Request $request)
    {
        // Vérifier que l'utilisateur est authentifié
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié'
            ], 401);
        }

        $userAuthentifie = auth()->user();
        
        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);
        
        // Récupérer les IDs des courriers affectés à l'utilisateur
        $affectations = Affectation::where('user_id', $userAuthentifie->id)
            ->pluck('courrier_id');
        
        // Requête pour les courriers avec leurs relations
        $courriersQuery = Courrier::whereIn('id', $affectations)
            ->with(['fichier', 'type_courriers', 'statuts', 'users'])
            ->orderBy('created_at', 'desc');
        
        $courriersChef = $courriersQuery->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'data' => $courriersChef->items(),
            'pagination' => [
                'total' => $courriersChef->total(),
                'per_page' => $courriersChef->perPage(),
                'current_page' => $courriersChef->currentPage(),
                'last_page' => $courriersChef->lastPage(),
                'from' => $courriersChef->firstItem(),
                'to' => $courriersChef->lastItem()
            ]
        ]);
    }

    public function sendEmail(Request $request, $id)
    {
        $request->validate([
            'email' => 'required|email',
            'content' => 'required|string',
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