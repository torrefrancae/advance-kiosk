<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'code',
        'customer_name',
        'status',
        'items',
        'total_cents',
        'source',
        'paid_at',
        'preparing_at',
        'ready_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'items' => 'array',
            'paid_at' => 'datetime',
            'preparing_at' => 'datetime',
            'ready_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }
}
