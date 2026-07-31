<?php

namespace App\Actions;

use Illuminate\Support\Str;

class NumberToIndonesianWords
{
    /** @var array<int, string> */
    private const WORDS = [
        '',
        'satu',
        'dua',
        'tiga',
        'empat',
        'lima',
        'enam',
        'tujuh',
        'delapan',
        'sembilan',
        'sepuluh',
        'sebelas',
    ];

    public function convert(float|int|string $number): string
    {
        $value = (int) round((float) $number);

        if ($value === 0) {
            return 'Nol';
        }

        $words = $value < 0
            ? 'minus '.$this->spell(abs($value))
            : $this->spell($value);

        return Str::of($words)->squish()->title()->toString();
    }

    private function spell(int $number): string
    {
        return match (true) {
            $number < 12 => self::WORDS[$number],
            $number < 20 => $this->spell($number - 10).' belas',
            $number < 100 => $this->spell(intdiv($number, 10)).' puluh '.$this->spell($number % 10),
            $number < 200 => 'seratus '.$this->spell($number - 100),
            $number < 1_000 => $this->spell(intdiv($number, 100)).' ratus '.$this->spell($number % 100),
            $number < 2_000 => 'seribu '.$this->spell($number - 1_000),
            $number < 1_000_000 => $this->spell(intdiv($number, 1_000)).' ribu '.$this->spell($number % 1_000),
            $number < 1_000_000_000 => $this->spell(intdiv($number, 1_000_000)).' juta '.$this->spell($number % 1_000_000),
            $number < 1_000_000_000_000 => $this->spell(intdiv($number, 1_000_000_000)).' miliar '.$this->spell($number % 1_000_000_000),
            default => $this->spell(intdiv($number, 1_000_000_000_000)).' triliun '.$this->spell($number % 1_000_000_000_000),
        };
    }
}
