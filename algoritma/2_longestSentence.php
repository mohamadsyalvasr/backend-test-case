<?php

function longest($sentence): string
{
    $words = explode(" ", $sentence);
    $longest = "";
    foreach($words as $word){
        if(strlen($word) > strlen($longest)){
            $longest = $word;
        }
    }

    return $longest . ": ". strlen($longest) ." characters";
}

echo longest("Saya sangat senang mengerjakan soal algoritma");
