<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class FichierFactory extends Factory
{
    public function definition()
    {
        return [
            'chemin' => $this->faker->filePath,
        ];
    }
}