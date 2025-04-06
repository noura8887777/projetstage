<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class courrierResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // return [
        //     'date' => $this->date,
        //     'num_order_annuel' => $this->num_order_annuel,
        //    'date_lettre' => $this->date_lettre,
        //    'num_lettre' => $this->num_lettre,
        //    'designation_destinataire' => $this->designation_destinataire,
        //    'analyse_affaire' => $this->analyse_affaire,
        //    'date_reponse' => $this->date_reponse,
        //    'num_reponse' => $this->num_reponse,
        //    'nom' =>$this->users->name,
        //    'nomtype'=>$this->type_courriers->nom_type
        // ];
    }
}
