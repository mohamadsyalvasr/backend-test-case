<?php

function diagonalDifference($matrix): array
{
    $n = count($matrix);
    $primaryDiagonal = 0;
    $secondaryDiagonal = 0;

    for ($i = 0; $i < $n; $i++) {
        $primaryDiagonal += $matrix[$i][$i];
        $secondaryDiagonal += $matrix[$i][$n - $i - 1];
    }

    return [
        "diagonal pertama" => $primaryDiagonal,
        "diagonal kedua" => $secondaryDiagonal,
        "maka hasilnya adalah" => abs($primaryDiagonal - $secondaryDiagonal)
    ];
}

$matrix = [
    [1, 2, 0],
    [4, 5, 6],
    [7, 8, 9]
];

$nxn = diagonalDifference($matrix);
print_r($nxn);
