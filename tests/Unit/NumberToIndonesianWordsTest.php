<?php

use App\Actions\NumberToIndonesianWords;

it('converts invoice totals to Indonesian words', function () {
    $converter = new NumberToIndonesianWords;

    expect($converter->convert(458985))
        ->toBe('Empat Ratus Lima Puluh Delapan Ribu Sembilan Ratus Delapan Puluh Lima')
        ->and($converter->convert(664335))
        ->toBe('Enam Ratus Enam Puluh Empat Ribu Tiga Ratus Tiga Puluh Lima')
        ->and($converter->convert(0))
        ->toBe('Nol');
});
