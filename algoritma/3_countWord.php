<?php

function countWords($input, $query): array {
    $result = [];
    foreach ($query as $q) {
        $result[] = array_count_values($input)[$q] ?? 0;
    }
    return $result;
}

$input = ['xc', 'dz', 'bbb', 'dz'];
$query = ['bbb', 'ac', 'dz'];
$output = countWords($input, $query);

print_r($output);
