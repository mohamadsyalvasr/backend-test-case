<?php

function reverseAlphabet($input): string
{
    preg_match('/([a-zA-Z]+)(\d*)/', $input, $matches);
    $alphabets = strrev($matches[1]);
    $numbers = $matches[2];
    return $alphabets . $numbers;
}

echo reverseAlphabet("NEGIE1");
