<?php

use App\Models\utilisateur;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCourriersTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('courriers', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('num_order_annuel');
            $table->date('date_lettre');
            $table->string('num_lettre');
            $table->string('designation_destinataire');
            $table->text('analyse_affaire');
            $table->date('date_reponse')->nullable();
            $table->string('num_reponse')->nullable();
            $table->timestamps();
        
            $table->foreignId('user_id') ->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
        
            $table->foreignId('statut_id') ->nullable() ->constrained('statuts') ->cascadeOnDelete()->cascadeOnUpdate();
        
            $table->foreignId('fichier_id')->nullable()->constrained('fichiers')->cascadeOnDelete()->cascadeOnUpdate();
        
            $table->foreignId('type_courrier_id')->nullable()->constrained('type_courriers')->cascadeOnDelete() ->cascadeOnUpdate();
        });
                
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courriers');
    }
}