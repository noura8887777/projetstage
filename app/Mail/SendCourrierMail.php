<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendCourrierMail extends Mailable
{
    use Queueable, SerializesModels;

    public $courrier;
    public $content; // Contenu personnalisé (envoyé depuis React)

    public function __construct($courrier, $content)
    {
        $this->courrier = $courrier;
        $this->content = $content;
    }

    public function build()
    {
        return $this
            ->subject("Nouveau Courrier : " . $this->courrier->num_lettre)
            ->html($this->content); // Utilise du HTML brut au lieu de Blade
    }
}