<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Firebase extends Model
{
    /**
     * @var array
     */
    protected $fillable = [
        'token', 'user_id'
    ];

    /**
     * @var array
     */
    protected $hidden = [
      'user_id'
    ];

    /**
     * @return BelongsTo
     */
    public function user() {
        return $this->belongsTo(User::class);
    }
}
