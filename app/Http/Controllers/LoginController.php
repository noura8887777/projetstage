<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
        if (!Auth::attempt($validated))
        {
            throw ValidationException::withMessages([
                'message' => 'Wrong credentials',
            ]);
        }
    
        $request->session()->regenerate();
    
        return response()->json([
            'success' => true,
            'user' => Auth::user(),
        ]);
    }
}
